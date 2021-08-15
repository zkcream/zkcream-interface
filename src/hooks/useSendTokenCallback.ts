import { useCallback, useState } from 'react'
import { useVotingTokenContract } from './useContract'

export function useSendTokenCallback(
  votingTokenAddress: string
): [state: boolean, callback: (voterAddress: string) => Promise<void>] {
  const [txState, setTxState] = useState<boolean>(false)
  const votingTokenContract = useVotingTokenContract(votingTokenAddress)

  const c = useCallback(
    async (voterAddress: string): Promise<void> => {
      setTxState(true)
      return await votingTokenContract
        .giveToken(voterAddress)
        .then(async (r: any) => {
          const w = await r.wait()
          if (w.status) {
            setTxState(false)
          }
        })
        .catch((e: Error) => {
          console.error('Error: giveToken error: ', e.message)
          setTxState(false)
          throw e
        })
    },
    [votingTokenContract]
  )

  return [txState, c]
}
