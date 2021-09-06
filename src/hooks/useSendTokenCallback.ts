import { useCallback, useState } from 'react'
import { TxError } from '../utils/error'
import { useVotingTokenContract } from './useContract'

export function useSendTokenCallback(
  votingTokenAddress: string
): [state: boolean, callback: (addressList: string[]) => Promise<void>] {
  const [txState, setTxState] = useState<boolean>(false)
  const votingTokenContract = useVotingTokenContract(votingTokenAddress)

  const c = useCallback(
    async (addressList: string[]): Promise<void> => {
      setTxState(true)
      for (let i = 0; i < addressList.length; i++) {
        await votingTokenContract
          .giveToken(addressList[i])
          .then(async (r: any) => {
            const w = await r.wait()
            if (w.status) {
              console.log('token sent to: ', addressList[i])
            }
          })
          .catch((e: Error) => {
            setTxState(false)
            throw new TxError('giveToken contract tx failed')
          })
      }
    },
    [votingTokenContract]
  )

  return [txState, c]
}
