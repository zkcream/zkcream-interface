import { useCallback } from 'react'
import { useSetLogs, useSetTotalElections } from '../state/election/hooks'
import { get } from '../utils/api'

export function useDeployedLogs() {
  const setLogs = useSetLogs()
  const setTotalElections = useSetTotalElections()

  return useCallback(async (): Promise<any> => {
    const r = (await get('factory/logs')).data
    if (r.length > 0) {
      setLogs(r)
      setTotalElections(r.length)
    }
  }, [setLogs, setTotalElections])
}
