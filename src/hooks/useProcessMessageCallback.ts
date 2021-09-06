// ported from https://github.com/appliedzkp/maci/blob/v0.4.11/cli/ts/process.ts
import { useCallback, useState } from 'react'
import { Keypair, PrivKey, PubKey, StateLeaf } from 'maci-domainobjs'

import { useMaciContract } from './useContract'
import { genMaciStateFromContract } from '../utils/genMaciStateFromContract'
import { useElectionState } from '../state/election/hooks'
import { post } from '../utils/api'
import { RandomStateLeaf } from '../components/QrModal'
import { FormatError, TxError } from '../utils/error'
import { useToggleToggleable } from '../state/application/hooks'

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

  const setUntoggleable = useToggleToggleable()

  const c = useCallback(
    async (maciSk: string) => {
      setTxState(true)
      if (!maciSk.startsWith('macisk')) {
        setTxState(false)
        throw new FormatError('maciSk need to start with macisk')
      }

      const privKey: PrivKey = PrivKey.unserialize(maciSk)
      const coordinatorKeypair: Keypair = new Keypair(privKey)

      // Check whether there are any remaining batches to process
      const currentMessageBatchIndex = (await maciContract.currentMessageBatchIndex()).toNumber()
      const messageTreeMaxLeafIndex = (await maciContract.messageTreeMaxLeafIndex()).toNumber()

      if (!(await maciContract.hasUnprocessedMessages())) {
        setTxState(false)
        throw new TxError('Error: all messages have already been processed')
      }

      if (currentMessageBatchIndex > messageTreeMaxLeafIndex) {
        setTxState(false)
        throw new TxError('Error: the message batch index is invalid. This should never happen.')
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
        setTxState(false)
        throw new TxError(e.message)
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
          setTxState(false)
          throw new TxError('Error: unable to compute batch update state tree witness data')
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
          setTxState(false)
          throw new TxError(txErr)
        }

        const receipt = await tx.wait()

        if (receipt.status !== 1) {
          console.error(txErr)
          setTxState(false)
          break
        }

        const stateRoot = await maciContract.stateRoot()
        if (stateRoot.toString() !== stateRootAfter.toString()) {
          setTxState(false)
          throw new TxError('Error: state root mismatch after processing a batch of messges')
        }

        // console.log(`Processed batch starting at index ${messageBatchIndex}`)
        // console.log(`Transaction hash: ${tx.hash}`)
        // console.log(`Random state leaf: ${rndStateLeaf.serialize()}`)

        if (!(await maciContract.hasUnprocessedMessages())) {
          setRandomStateLeaf({ randomStateLeaf: rndStateLeaf.serialize() })
          setUntoggleable()
          break
        }
      }
      setTxState(false)
    },
    [maciContract, publishMessageLogs, setUntoggleable, signUpLogs]
  )

  return [txState, randomStateLeaf, c]
}
