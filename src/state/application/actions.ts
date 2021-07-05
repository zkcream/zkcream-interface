import { createAction } from '@reduxjs/toolkit'

export enum ApplicationModal {
  WALLET,
  DEPLOY,
  NOTE,
}

export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
