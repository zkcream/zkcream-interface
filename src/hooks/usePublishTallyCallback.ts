// ported from https://github.com/appliedzkp/maci/blob/v0.4.11/cli/ts/tally.ts
import { useCallback } from 'react'
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

const ethProvider: string = process.env.REACT_APP_URL!

/* TODO: download privKey OR show QR code */
const coordinatorPrivKey: string = process.env.REACT_APP_COORDINATOR_PRIVKEY!
const coordinatorKeypair = new Keypair(new PrivKey(BigInt(coordinatorPrivKey)))

export function usePublishTallyCallback(): (leaf_zero: string) => Promise<void> {
  const { maciAddress, zkCreamAddress, maciParams }: any = useElectionState()
  const maciContract = useMaciContract(maciAddress)
  const zkCreamContract = useZkCreamContract(zkCreamAddress)
  const { publishMessageLogs, signUpLogs }: any = maciParams

  return useCallback(
    async (leaf_zero: string) => {
      // Check whether it's the right time to tally messages
      if (await maciContract.hasUnprocessedMessages()) {
        console.error('Error: not all messages have been processed')
        return
      }

      // Ensure that there are untallied state leaves
      if (!(await maciContract.hasUntalliedStateLeaves())) {
        console.error('Error: all state leaves have been tallied')
        return
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
        console.error('Error: invalid zeroth state leaf')
        return
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
      } catch (e) {
        console.error(e)
        return
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
          console.error('Error: the first current result salt should be zero')
          return
        }

        if (startIndex === BigInt(0) && currentTvcSalt !== BigInt(0)) {
          console.error('Error: the first current total spent voice credits salt should be zero')
          return
        }

        if (startIndex === BigInt(0) && currentPvcSalt !== BigInt(0)) {
          console.error('Error: the first current spent voice credits per vote option salt should be zero')
          return
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
          console.error('Error: unable to compute quadratic vote tally witness data')
          console.error(e)
          return
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
          console.error('Error: proveVoteTallyBatch() failed')
          console.error(txErr)
          console.error(e)
          break
        }

        const receipt = await tx.wait()

        if (receipt.status !== 1) {
          console.error(txErr)
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
        console.error('Error: unable to receive tallyHash from ipfs')
        console.error(e)
        return
      }

      // publishTally on chain
      return await zkCreamContract
        .publishTallyHash(tallyHash.data.path)
        .then(async (r: any) => {
          if (r.status) {
            await r.wait()
            console.log('tally published :', tallyHash.data.path)
          }
        })
        .catch((e: Error) => {
          console.error('Error: signupMaci error: ', e.message)
          throw e
        })
    },
    [maciContract, publishMessageLogs, signUpLogs, zkCreamContract]
  )
}
