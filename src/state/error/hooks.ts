import { useCallback } from 'react'

import { ErrorType, setErrorState } from './actions'
import { useAppDispatch, useAppSelector } from '../hooks'
import { RootState } from '..'

export function useErrorState(): ErrorType | null {
  return useAppSelector((state: RootState) => state.error.error)
}

export function useSetError(): (error: ErrorType) => void {
  const dispatch = useAppDispatch()
  return useCallback((error) => dispatch(setErrorState(error)), [dispatch])
}
