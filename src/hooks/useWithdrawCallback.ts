import { useCallback, useState } from 'react'

import { useZkCreamContract } from './useContract'
import { useElectionState } from '../state/election/hooks'
import { get } from '../utils/api'
import { TxError } from '../utils/error'

export function useWithdrawCallback(): [state: boolean, callback: () => Promise<void>] {
  const [txState, setTxState] = useState<boolean>(false)
  const { zkCreamAddress, tallyHash, recipients }: any = useElectionState()
  const zkCreamContract = useZkCreamContract(zkCreamAddress)

  const c = useCallback(async (): Promise<void> => {
    setTxState(true)
    const r_tally = await get('ipfs/' + tallyHash)
    const resultsArr = r_tally.data.results.tally

    for (let i = 0; i < recipients.length && resultsArr[i] !== 0; i++) {
      const counts = resultsArr[i]
      for (let j = 0; j < counts; j++) {
        await zkCreamContract
          .withdraw(i)
          .then(async (r: any) => {
            const w = await r.wait()
            if (w.status) {
              console.log('token withdrawn')
            }
          })
          .catch((e: Error) => {
            setTxState(false)
            throw new TxError('Withdraw contract tx failed')
          })
      }
    }
    setTxState(false)
  }, [recipients.length, tallyHash, zkCreamContract])

  return [txState, c]
}
