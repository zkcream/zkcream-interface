import { createAction } from '@reduxjs/toolkit'

export enum ErrorType {
  NETWORK_ERROR,
  UNKNOWN_ERROR,
  FORMAT_ERROR,
  TX_ERROR,
  SIG_ERROR,
}

export const setErrorState = createAction<ErrorType | null>('error/setErrorState')
