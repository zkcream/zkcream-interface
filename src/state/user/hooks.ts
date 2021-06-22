import { useEffect, useState } from 'react'

import { useVotingTokenContract } from '../../hooks/useContract'
import { get } from '../../utils/api'

export interface UserToken {
  votingToken: number
  maciToken: number
  isApproved: boolean
}

export function useUserTokenStatus(
  address: string,
  account: string | null | undefined,
  votingTokenAddress: string | undefined,
  singUpTokenAddress: string | undefined
): UserToken {
  const [tokenState, setTokenState] = useState<any>()
  const votingTokenContract = useVotingTokenContract(votingTokenAddress as string)

  useEffect(() => {
    async function fetchUserStatus() {
      let tokenStatus: UserToken
      if (!account) {
        tokenStatus = {
          votingToken: 0,
          maciToken: 0,
          isApproved: false,
        }
      } else {
        const result = (await get('zkcream/' + address + '/' + account)).data
        let isApproved = false
        if (votingTokenAddress) {
          isApproved = await votingTokenContract.isApprovedForAll(account, address)
        }
        tokenStatus = {
          votingToken: result[0],
          maciToken: result[1],
          isApproved,
        }
      }
      setTokenState(tokenStatus)
    }

    if (!tokenState) {
      fetchUserStatus()
    }
  })

  return tokenState
}
