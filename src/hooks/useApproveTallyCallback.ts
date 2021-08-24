import { useCallback, useState } from 'react'

import { useZkCreamContract } from './useContract'
import { useElectionState } from '../state/election/hooks'

export function useApproveTallyCallback(): [state: boolean, callback: () => Promise<void>] {
  const [txState, setTxState] = useState<boolean>(false)
  const { zkCreamAddress }: any = useElectionState()
  const zkCreamContract = useZkCreamContract(zkCreamAddress)

  const c = useCallback(async () => {
    setTxState(true)
    await zkCreamContract
      .approveTally()
      .then(async (r: any) => {
        const w = await r.wait()
        if (w.status) {
          setTxState(false)
        }
      })
      .catch((e: Error) => {
        console.log('approve tally error: ', e.message)
        setTxState(false)
        throw e
      })
  }, [zkCreamContract])

  return [txState, c]
}
