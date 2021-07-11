import { TokenType, Status } from './reducer'
import { useAppSelector } from '../hooks'
import { RootState } from '../index'

export function useTokenType(): TokenType {
  return useAppSelector((state: RootState) => state.token.holdingToken)
}

export function useTokenStatus(): Status {
  return useAppSelector((state: RootState) => state.token.isApproved)
}
