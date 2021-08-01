// ported from https://github.com/appliedzkp/maci/blob/v0.4.11/cli/ts/process.ts
import { useCallback, useMemo, useState } from 'react'
import { Keypair, PrivKey, PubKey, StateLeaf } from 'maci-domainobjs'

import { useMaciContract } from './useContract'
import { genMaciStateFromContract } from '../utils/genMaciStateFromContract'
import { useElectionState } from '../state/election/hooks'
import { post } from '../utils/api'

/* TODO: download privKey OR show QR code */
const coordinatorPrivKey: string = process.env.REACT_APP_COORDINATOR_PRIVKEY!
const coordinatorKeypair = new Keypair(new PrivKey(BigInt(coordinatorPrivKey)))

export type RandomStateLeaf = string | undefined

export function useProcessMessageCallback(): [RandomStateLeaf, () => Promise<void>] {
  const [randomStateLeaf, setRandomStateLeaf] = useState<string | undefined>('')
  const { maciAddress, maciParams }: any = useElectionState()
  const maciContract = useMaciContract(maciAddress)
  const { publishMessageLogs, signUpLogs }: any = maciParams

  const tx = useCallback(async () => {
    // Check whether there are any remaining batches to process
    const currentMessageBatchIndex = (await maciContract.currentMessageBatchIndex()).toNumber()
    const messageTreeMaxLeafIndex = (await maciContract.messageTreeMaxLeafIndex()).toNumber()

    if (!(await maciContract.hasUnprocessedMessages())) {
      console.error('Error: all messages have already been processed')
      return
    }

    if (currentMessageBatchIndex > messageTreeMaxLeafIndex) {
      console.error('Error: the message batch index is invalid. This should never happen.')
      return
    }

    // Build an off-chain representation of the MACI contract using data in the contract storage
    let maciState
    try {
      maciState = await genMaciStateFromContract(
        maciContract,
        coordinatorKeypair,
        StateLeaf.genBlankLeaf(BigInt(0)),
        signUpLogs,
        publishMessageLogs
      )
    } catch (e) {
      console.error(e)
      return
    }

    const messageBatchSize = await maciContract.messageBatchSize()

    let rndStateLeaf

    while (true) {
      rndStateLeaf = StateLeaf.genRandomLeaf()
      const messageBatchIndex = await maciContract.currentMessageBatchIndex()

      const circuitInputs = maciState.genBatchUpdateStateTreeCircuitInputs(
        messageBatchIndex.toNumber(),
        messageBatchSize,
        rndStateLeaf
      )

      // Process the batch of messages
      maciState.batchProcessMessage(messageBatchIndex.toNumber(), messageBatchSize, rndStateLeaf)

      const stateRootAfter = maciState.genStateRoot()

      const configType = maciState.stateTreeDepth === 8 ? 'prod-small' : 'test'

      let formattedProof

      const data = {
        circuitInputs: JSON.stringify(circuitInputs, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        ),
        configType,
        stateRootAfter: JSON.stringify(stateRootAfter, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        ),
      }

      try {
        formattedProof = await post('maci/genproof', data)
      } catch (e) {
        console.error('Error: unable to compute batch update state tree witness data')
        console.error(e)
        return
      }

      const ecdhPubKeys: PubKey[] = []
      for (const p of circuitInputs['ecdh_public_key']) {
        const pubKey = new PubKey(p)
        ecdhPubKeys.push(pubKey)
      }

      const txErr = 'Error: batchProcessMessage() failed'
      let tx

      try {
        tx = await maciContract.batchProcessMessage(
          '0x' + stateRootAfter.toString(16),
          circuitInputs['state_tree_root'].map((x: any) => x.toString()),
          ecdhPubKeys.map((x: any) => x.asContractParam()),
          formattedProof.data,
          { gasLimit: 2000000 }
        )
      } catch (e) {
        console.error(txErr)
        console.error(e)
        break
      }

      const receipt = await tx.wait()

      if (receipt.status !== 1) {
        console.error(txErr)
        break
      }

      const stateRoot = await maciContract.stateRoot()
      if (stateRoot.toString() !== stateRootAfter.toString()) {
        console.error('Error: state root mismatch after processing a batch of messges')
        return
      }

      console.log(`Processed batch starting at index ${messageBatchIndex}`)
      console.log(`Transaction hash: ${tx.hash}`)
      console.log(`Random state leaf: ${rndStateLeaf.serialize()}`)

      if (!(await maciContract.hasUnprocessedMessages())) {
        setRandomStateLeaf(rndStateLeaf.serialize())
        break
      }
    }
  }, [maciContract, publishMessageLogs, signUpLogs])

  const serializedRandomStateLeaf: RandomStateLeaf = useMemo(() => randomStateLeaf, [randomStateLeaf])

  return [serializedRandomStateLeaf, tx]
}
