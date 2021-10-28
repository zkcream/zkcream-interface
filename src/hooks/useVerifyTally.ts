// add method to verify tally + button

import { useCallback, useState } from 'react'
import { useElectionState } from '../state/election/hooks'
import { get } from '../utils/api'
import { TxError } from '../utils/error'
import verify from '../utils/verify'
import { useMaciContract } from './useContract'

export function useVerifyTally(): [state: boolean, callback: () => Promise<void>] {
  const [txState, setTxState] = useState<boolean>(false)
  const { tallyHash, maciAddress }: any = useElectionState()
  const maciContract = useMaciContract(maciAddress)

  const c = useCallback(async () => {
    setTxState(true)
    const r_tally = await get('ipfs/' + tallyHash)
    const data = r_tally.data

    await verify(data, maciContract).catch((e: Error) => {
      setTxState(false)
      throw new TxError(e.message)
    })
  }, [maciContract, tallyHash])

  return [txState, c]
}
