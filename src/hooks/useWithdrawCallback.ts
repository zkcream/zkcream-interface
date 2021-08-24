import { useCallback, useState } from 'react'

import { useZkCreamContract } from './useContract'
import { useElectionState } from '../state/election/hooks'
import { get } from '../utils/api'

export function useWithdrawCallback(): [state: boolean, callback: () => Promise<void>] {
  const [txState, setTxState] = useState<boolean>(false)
  const { zkCreamAddress, tallyHash, recipients }: any = useElectionState()
  const zkCreamContract = useZkCreamContract(zkCreamAddress)

  const c = useCallback(async () => {
    setTxState(true)
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
    setTxState(false)
  }, [recipients.length, tallyHash, zkCreamContract])

  return [txState, c]
}
