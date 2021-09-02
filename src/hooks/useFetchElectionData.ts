import { useCallback } from 'react'
import { useSetElections } from '../state/election/hooks'
import { ElectionData } from '../state/election/reducer'
import { fetchContractDetails } from '../utils/api'

export function useFetchElectionData() {
  const setElections = useSetElections()

  return useCallback(
    async (logs) => {
      const r: ElectionData[] = await Promise.all(
        logs.map(async (log: any) => {
          return await fetchContractDetails(log)
        })
      )
      setElections(r.reverse())
    },
    [setElections]
  )
}
