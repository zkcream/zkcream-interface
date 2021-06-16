import { createAction } from '@reduxjs/toolkit'

export enum ApplicationModal {
  WALLET,
  DEPLOY,
}

export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
