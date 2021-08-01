import { useCallback } from 'react'

import { useZkCreamContract } from './useContract'
import { useElectionState } from '../state/election/hooks'

export function useApproveTallyCallback() {
  const { zkCreamAddress }: any = useElectionState()
  const zkCreamContract = useZkCreamContract(zkCreamAddress)

  return useCallback(async () => {
    await zkCreamContract.approveTally().then(async (r: any) => {
      if (r.status) {
        await r.wait()
        console.log('tally approved.')
      }
    })
  }, [zkCreamContract])
}
