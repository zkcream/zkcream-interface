import { createAction } from '@reduxjs/toolkit'

export enum ApplicationModal {
  WALLET,
  DEPLOY,
  NOTE,
  SIGNUP,
  POST_SIGNUP,
  VOTERSTATE,
  POST_PROCESSMESSAGE,
  RANDOM_STATELEAF,
  DISTRIBUTE,
  COORDINATOR_KEY,
}

export const updateChainId = createAction<{ chainId: number | null }>('application/updateChainId')
export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')
export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
