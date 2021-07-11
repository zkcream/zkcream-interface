import { useCallback } from 'react'

import { useVotingTokenContract } from './useContract'

export function useApproveTokenCallback(zkCreamAddress: string, votingTokenAddress: string): () => Promise<void> {
  const votingTokenContract = useVotingTokenContract(votingTokenAddress)

  return useCallback(async (): Promise<void> => {
    await votingTokenContract
      .setApprovalForAll(zkCreamAddress, true)
      .then(async (r: any) => {
        if (r.status) {
          await r.wait()
        }
      })
      .then()
      .catch((e: Error) => {
        console.log('token approval error: ', e.message)
        throw e
      })
  }, [votingTokenContract, zkCreamAddress])
}
