// add method to verify tally + button

import { useCallback, useState } from 'react'
import { useElectionState } from '../state/election/hooks'
import { get } from '../utils/api'
import { TxError } from '../utils/error'
import verify from '../utils/verify'
import { useMaciContract } from './useContract'

export function useVerifyTally(): [state: boolean, callback: (setState: any) => Promise<void>] {
  const [txState, setTxState] = useState<boolean>(false)
  const { tallyHash, maciAddress }: any = useElectionState()
  const maciContract = useMaciContract(maciAddress)

  const c = useCallback(
    async (setState) => {
      setTxState(true)
      const r_tally = await get('ipfs/' + tallyHash)
      const data = r_tally.data

      await verify(data, maciContract)
        .then(() => {
          setState(true)
          setTxState(false)
        })
        .catch((e: Error) => {
          setTxState(false)
          throw new TxError(e.message)
        })
    },
    [maciContract, tallyHash]
  )

  return [txState, c]
}
