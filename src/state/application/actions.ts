import { createAction } from '@reduxjs/toolkit'

export enum ApplicationModal {
  WALLET,
  DEPLOY,
  NOTE,
  SIGNUP,
  VOTERSTATE,
  RANDOM_STATELEAF,
  DISTRIBUTE,
  COORDINATOR_KEY,
}

export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
