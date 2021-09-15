// ported from https://github.com/appliedzkp/maci/blob/v0.4.11/cli/ts/tally.ts
import { useCallback, useState } from 'react'
import {
  genPerVOSpentVoiceCreditsCommitment,
  genSpentVoiceCreditsCommitment,
  genTallyResultCommitment,
} from 'maci-core'
import { genRandomSalt } from 'maci-crypto'
import { Keypair, PrivKey, StateLeaf } from 'maci-domainobjs'

import { useMaciContract, useZkCreamContract } from './useContract'
import { genMaciStateFromContract } from '../utils/genMaciStateFromContract'
import { useElectionState } from '../state/election/hooks'
import { post } from '../utils/api'
import { useLocalStorage } from './useLocalStorage'
import { useRandomStateLeafModalToggle } from '../state/application/hooks'
import { TxError } from '../utils/error'
import { ElectionData } from '../state/election/reducer'

const ethProvider: string = process.env.REACT_APP_URL!

export function usePublishTallyCallback(): [state: boolean, callback: (leaf_zero: string) => Promise<void>] {
  const [txState, setTxState] = useState<boolean>(false)
  const election: ElectionData | undefined = useElectionState()
  const maciContract = useMaciContract(election!.maciAddress)
  const zkCreamContract = useZkCreamContract(election!.zkCreamAddress)
  const { publishMessageLogs, signUpLogs }: any = election!.maciParams
  const [macisk] = useLocalStorage('macisk', '')
  const toggleModal = useRandomStateLeafModalToggle()

  const c = useCallback(
    async (leaf_zero: string) => {
      setTxState(true)

      const coordinatorKeypair = new Keypair(PrivKey.unserialize(macisk))

      // Check whether it's the right time to tally messages
      if (await maciContract.hasUnprocessedMessages()) {
        setTxState(false)
        throw new TxError('Error: not all messages have been processed')
      }

      // Ensure that there are untallied state leaves
      if (!(await maciContract.hasUntalliedStateLeaves())) {
        setTxState(false)
        throw new TxError('Error: all state leaves have been tallied')
      }

      // TEMP
      const current_results_salt = '0x0'
      const current_total_vc_salt = '0x0'
      const current_per_vo_vc_salt = '0x0'
      let currentResultsSalt: any = BigInt(current_results_salt)
      let currentTvcSalt = BigInt(current_total_vc_salt)
      let currentPvcSalt = BigInt(current_per_vo_vc_salt)

      // Zeroth leaf
      const serialized = leaf_zero
      let zerothLeaf: StateLeaf
      try {
        zerothLeaf = StateLeaf.unserialize(serialized)
      } catch {
        setTxState(false)
        throw new TxError('Error: invalid zeroth state leaf')
      }

      // Build an off-chain representation of the MACI contract using data in the contract storage
      let maciState
      try {
        maciState = await genMaciStateFromContract(
          maciContract,
          coordinatorKeypair,
          zerothLeaf,
          signUpLogs,
          publishMessageLogs
        )
      } catch (e: any) {
        setTxState(false)
        throw new TxError(e.message)
      }

      const batchSize = BigInt((await maciContract.tallyBatchSize()).toString())

      let cumulativeTally
      let tallyFileData

      while (true) {
        const hasUntalliedStateLeaves = await maciContract.hasUntalliedStateLeaves()
        if (!hasUntalliedStateLeaves) {
          break
        }

        const currentQvtBatchNum = BigInt((await maciContract.currentQvtBatchNum()).toString())
        const startIndex: BigInt = currentQvtBatchNum * batchSize

        cumulativeTally = maciState.computeCumulativeVoteTally(startIndex)

        const tally = maciState.computeBatchVoteTally(startIndex, batchSize)

        let totalVotes = BigInt(0)
        for (let i = 0; i < tally.length; i++) {
          cumulativeTally[i] = BigInt(cumulativeTally[i]) + BigInt(tally[i])
          totalVotes += cumulativeTally[i]
        }

        if (startIndex === BigInt(0) && currentResultsSalt !== BigInt(0)) {
          setTxState(false)
          throw new TxError('Error: the first current result salt should be zero')
        }

        if (startIndex === BigInt(0) && currentTvcSalt !== BigInt(0)) {
          setTxState(false)
          throw new TxError('Error: the first current total spent voice credits salt should be zero')
        }

        if (startIndex === BigInt(0) && currentPvcSalt !== BigInt(0)) {
          setTxState(false)
          throw new TxError('Error: the first current spent voice credits per vote option salt should be zero')
        }

        const newResultsSalt: any = genRandomSalt()
        const newSpentVoiceCreditsSalt: any = genRandomSalt()
        const newPerVOSpentVoiceCreditsSalt: any = genRandomSalt()

        // Generate circuit inputs
        const circuitInputs = maciState.genQuadVoteTallyCircuitInputs(
          startIndex,
          batchSize,
          currentResultsSalt,
          newResultsSalt,
          currentTvcSalt,
          newSpentVoiceCreditsSalt,
          currentPvcSalt,
          newPerVOSpentVoiceCreditsSalt
        )

        // Update the salts for the next iteration
        currentResultsSalt = BigInt(newResultsSalt)
        currentTvcSalt = BigInt(newSpentVoiceCreditsSalt)
        currentPvcSalt = BigInt(newPerVOSpentVoiceCreditsSalt)

        const configType = maciState.stateTreeDepth === 8 ? 'prod-small' : 'test'

        const newResultsCommitment = genTallyResultCommitment(
          cumulativeTally,
          newResultsSalt,
          maciState.voteOptionTreeDepth
        )

        const currentSpentVoiceCredits = maciState.computeCumulativeSpentVoiceCredits(startIndex)

        const newSpentVoiceCredits =
          currentSpentVoiceCredits + maciState.computeBatchSpentVoiceCredits(startIndex, batchSize)

        const newSpentVoiceCreditsCommitment = genSpentVoiceCreditsCommitment(newSpentVoiceCredits, currentTvcSalt)

        const currentPerVOSpentVoiceCredits = maciState.computeCumulativePerVOSpentVoiceCredits(startIndex)

        const perVOSpentVoiceCredits = maciState.computeBatchPerVOSpentVoiceCredits(startIndex, batchSize)

        const totalPerVOSpentVoiceCredits: BigInt[] = []
        for (let i = 0; i < currentPerVOSpentVoiceCredits.length; i++) {
          totalPerVOSpentVoiceCredits[i] = currentPerVOSpentVoiceCredits[i] + perVOSpentVoiceCredits[i]
        }

        const newPerVOSpentVoiceCreditsCommitment = genPerVOSpentVoiceCreditsCommitment(
          totalPerVOSpentVoiceCredits,
          newPerVOSpentVoiceCreditsSalt,
          maciState.voteOptionTreeDepth
        )

        const totalVotesPublicInput = BigInt(circuitInputs.isLastBatch) === BigInt(1) ? totalVotes.toString() : 0

        const contractPublicSignals = await maciContract.genQvtPublicSignals(
          circuitInputs.intermediateStateRoot.toString(),
          newResultsCommitment.toString(),
          newSpentVoiceCreditsCommitment.toString(),
          newPerVOSpentVoiceCreditsCommitment.toString(),
          totalVotesPublicInput
        )

        let formattedProof

        const data = {
          circuitInputs: JSON.stringify(circuitInputs, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
          ),
          configType,
          newResultsCommitment: JSON.stringify(newResultsCommitment, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
          ),
          newSpentVoiceCreditsCommitment: JSON.stringify(newSpentVoiceCreditsCommitment, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
          ),
          newPerVOSpentVoiceCreditsCommitment: JSON.stringify(newPerVOSpentVoiceCreditsCommitment, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
          ),
          contractPublicSignals,
        }

        try {
          formattedProof = await post('maci/gen_qvtproof', data)
        } catch (e) {
          setTxState(false)
          throw new TxError('Error: unable to compute quadratic vote tally witness data')
        }

        let tx
        const txErr = 'Error: proveVoteTallyBatch() failed'

        try {
          tx = await maciContract.proveVoteTallyBatch(
            circuitInputs.intermediateStateRoot.toString(),
            newResultsCommitment.toString(),
            newSpentVoiceCreditsCommitment.toString(),
            newPerVOSpentVoiceCreditsCommitment.toString(),
            totalVotesPublicInput.toString(),
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

        console.log(`Transaction hash: ${tx.hash}`)
        const finalTotalVotes = await maciContract.totalVotes()

        if (!(await maciContract.hasUntalliedStateLeaves())) {
          console.log(`Current results salt: 0x${currentResultsSalt.toString(16)}`)
          const currentResultsCommitment = await maciContract.currentResultsCommitment()
          const c = BigInt(currentResultsCommitment.toString())
          console.log(`Result commitment: 0x${c.toString(16)}`)

          console.log(`Total spent voice credits salt: 0x${currentTvcSalt.toString(16)}`)
          const currentSpentVoiceCreditsCommitment = await maciContract.currentSpentVoiceCreditsCommitment()
          const d = BigInt(currentSpentVoiceCreditsCommitment.toString())
          console.log(`Total spent voice credits commitment: 0x${d.toString(16)}`)

          console.log(`Total spent voice credits per vote option salt: 0x${currentPvcSalt.toString(16)}`)
          const currentPerVOSpentVoiceCreditsCommitment = await maciContract.currentPerVOSpentVoiceCreditsCommitment()
          const e = BigInt(currentPerVOSpentVoiceCreditsCommitment.toString())
          console.log(`Total spent voice credits per vote option commitment: 0x${e.toString(16)}`)
          console.log(`Total votes: ${finalTotalVotes.toString()}`)

          tallyFileData = {
            provider: ethProvider,
            maci: maciContract.address,
            results: {
              commitment: '0x' + c.toString(16),
              tally: cumulativeTally.map((x: any) => x.toString()),
              salt: '0x' + currentResultsSalt.toString(16),
            },
            totalVoiceCredits: {
              spent: newSpentVoiceCredits.toString(),
              commitment: '0x' + newSpentVoiceCreditsCommitment.toString(16),
              salt: '0x' + newSpentVoiceCreditsSalt.toString(16),
            },
            totalVoiceCreditsPerVoteOption: {
              commitment: '0x' + newPerVOSpentVoiceCreditsCommitment.toString(16),
              tally: totalPerVOSpentVoiceCredits.map((x: any) => x.toString()),
              salt: '0x' + newPerVOSpentVoiceCreditsSalt.toString(16),
            },
          }
        }
      }

      console.log(tallyFileData)

      // receive ipfs hash
      let tallyHash: any
      try {
        tallyHash = await post('ipfs/', tallyFileData)
      } catch (e) {
        setTxState(false)
        throw new TxError('Error: unable to receive tallyHash from ipfs')
      }

      // publishTally on chain
      return await zkCreamContract
        .publishTallyHash(tallyHash.data.path)
        .then(async (r: any) => {
          const w = await r.wait()
          if (w.status) {
            setTxState(false)
            console.log('tally published :', tallyHash.data.path)
          }
        })
        .then(() => {
          toggleModal()
        })
        .catch((e: Error) => {
          setTxState(false)
          throw new TxError(e.message)
        })
    },
    [maciContract, macisk, publishMessageLogs, signUpLogs, toggleModal, zkCreamContract]
  )

  return [txState, c]
}
