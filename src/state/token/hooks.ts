import { useCallback } from 'react'
import { TokenType, Status, fetchTokenState } from './reducer'
import { useAppDispatch, useAppSelector } from '../hooks'
import { RootState } from '../index'

export function useFetchTokenState({ zkCreamAddress, account }: { zkCreamAddress: string; account: string }) {
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(fetchTokenState({ zkCreamAddress, account })), [account, dispatch, zkCreamAddress])
}

export function useTokenType(): TokenType {
  return useAppSelector((state: RootState) => state.token.holdingToken)
}

export function useTokenStatus(): Status {
  return useAppSelector((state: RootState) => state.token.isApproved)
}
