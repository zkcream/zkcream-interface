import { useEffect, useState } from 'react'

import { get } from '../../utils/api'

export interface UserToken {
  votingToken: number
  maciToken: number
}

export function useUserTokenStatus(address: string, account: string | null | undefined): UserToken {
  const [tokenState, setTokenState] = useState<any>()

  useEffect(() => {
    async function fetchUserStatus() {
      let tokenStatus: UserToken
      if (!account) {
        tokenStatus = {
          votingToken: 0,
          maciToken: 0,
        }
      } else {
        const result = (await get('zkcream/' + address + '/' + account)).data
        tokenStatus = {
          votingToken: result[0],
          maciToken: result[1],
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
