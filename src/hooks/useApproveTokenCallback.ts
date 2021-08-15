import { useCallback, useState } from 'react'
import { useVotingTokenContract } from './useContract'

export function useApproveTokenCallback(
  zkCreamAddress: string,
  votingTokenAddress: string
): [state: boolean, callback: () => Promise<void>] {
  const [txState, setTxState] = useState<boolean>(false)
  const votingTokenContract = useVotingTokenContract(votingTokenAddress)

  const c = useCallback(async (): Promise<void> => {
    setTxState(true)
    await votingTokenContract
      .setApprovalForAll(zkCreamAddress, true)
      .then(async (r: any) => {
        const w = await r.wait()
        if (w.status) {
          setTxState(false)
        }
      })
      .catch((e: Error) => {
        console.log('token approval error: ', e.message)
        setTxState(false)
        throw e
      })
  }, [votingTokenContract, zkCreamAddress])

  return [txState, c]
}
