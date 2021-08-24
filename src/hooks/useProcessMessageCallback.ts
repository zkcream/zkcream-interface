// ported from https://github.com/appliedzkp/maci/blob/v0.4.11/cli/ts/process.ts
import { useCallback, useState } from 'react'
import { Keypair, PrivKey, PubKey, StateLeaf } from 'maci-domainobjs'

import { useMaciContract } from './useContract'
import { genMaciStateFromContract } from '../utils/genMaciStateFromContract'
import { useElectionState } from '../state/election/hooks'
import { post } from '../utils/api'
import { RandomStateLeaf } from '../components/QrModal'

export function useProcessMessageCallback(): [
  state: boolean,
  random: RandomStateLeaf,
  callback: (maciSk: string) => Promise<void>
] {
  const [txState, setTxState] = useState<boolean>(false)
  const [randomStateLeaf, setRandomStateLeaf] = useState<RandomStateLeaf>({ randomStateLeaf: '' })
  const { maciAddress, maciParams }: any = useElectionState()
  const maciContract = useMaciContract(maciAddress)
  const { publishMessageLogs, signUpLogs }: any = maciParams

  const c = useCallback(
    async (maciSk: string) => {
      setTxState(true)
      const privKey: PrivKey = PrivKey.unserialize(maciSk)
      const coordinatorKeypair: Keypair = new Keypair(privKey)

      // Check whether there are any remaining batches to process
      const currentMessageBatchIndex = (await maciContract.currentMessageBatchIndex()).toNumber()
      const messageTreeMaxLeafIndex = (await maciContract.messageTreeMaxLeafIndex()).toNumber()

      if (!(await maciContract.hasUnprocessedMessages())) {
        console.error('Error: all messages have already been processed')
        setTxState(false)
        return
      }

      if (currentMessageBatchIndex > messageTreeMaxLeafIndex) {
        console.error('Error: the message batch index is invalid. This should never happen.')
        setTxState(false)
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
        setTxState(false)
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
          setTxState(false)
          break
        }

        const receipt = await tx.wait()

        if (receipt.status !== 1) {
          console.error(txErr)
          setTxState(false)
          break
        }

        const stateRoot = await maciContract.stateRoot()
        if (stateRoot.toString() !== stateRootAfter.toString()) {
          console.error('Error: state root mismatch after processing a batch of messges')
          setTxState(false)
          return
        }

        // console.log(`Processed batch starting at index ${messageBatchIndex}`)
        // console.log(`Transaction hash: ${tx.hash}`)
        // console.log(`Random state leaf: ${rndStateLeaf.serialize()}`)

        if (!(await maciContract.hasUnprocessedMessages())) {
          setRandomStateLeaf({ randomStateLeaf: rndStateLeaf.serialize() })
          break
        }
      }
      setTxState(false)
    },
    [maciContract, publishMessageLogs, signUpLogs]
  )

  return [txState, randomStateLeaf, c]
}
