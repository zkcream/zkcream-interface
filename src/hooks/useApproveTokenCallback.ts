import { useCallback, useState } from 'react'
import { useFetchTokenState } from '../state/token/hooks'
import { useVotingTokenContract } from './useContract'
import { useActiveWeb3React } from './web3'

export function useApproveTokenCallback(
  zkCreamAddress: string,
  votingTokenAddress: string
): [state: boolean, callback: () => Promise<void>] {
  const { account } = useActiveWeb3React()
  const [txState, setTxState] = useState<boolean>(false)
  const votingTokenContract = useVotingTokenContract(votingTokenAddress)
  const arg: any = { zkCreamAddress, account }
  const fetchTokenState = useFetchTokenState(arg)

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
      .then(() => {
        fetchTokenState()
      })
      .catch((e: Error) => {
        console.log('token approval error: ', e.message)
        setTxState(false)
        throw e
      })
  }, [fetchTokenState, votingTokenContract, zkCreamAddress])

  return [txState, c]
}
