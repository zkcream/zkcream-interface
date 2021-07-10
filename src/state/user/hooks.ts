import { useEffect, useState } from 'react'

import { useAppSelector } from '../hooks'
import { SupportedLocale } from '../../constants/locales'

import { get } from '../../utils/api'
import { RootState } from '../index'

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

export function useUserLocale(): SupportedLocale | null {
  return useAppSelector((state: RootState) => state.user.userLocale)
}
