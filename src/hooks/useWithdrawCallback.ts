import { useCallback } from 'react'

import { useZkCreamContract } from './useContract'
import { useElectionState } from '../state/election/hooks'
import { get } from '../utils/api'

export function useWithdrawCallback() {
  const { zkCreamAddress, tallyHash, recipients }: any = useElectionState()
  const zkCreamContract = useZkCreamContract(zkCreamAddress)

  return useCallback(async () => {
    const r_tally = await get('ipfs/' + tallyHash)
    const resultsArr = r_tally.data.results.tally

    for (let i = 0; i < recipients.length && resultsArr[i] !== 0; i++) {
      const counts = resultsArr[i]
      for (let j = 0; j < counts; j++) {
        const tx = await zkCreamContract.withdraw(i)
        if (tx) {
          await tx.wait()
          console.log('withdrawn')
        }
      }
    }
  }, [recipients.length, tallyHash, zkCreamContract])
}
