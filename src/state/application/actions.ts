import { createAction } from '@reduxjs/toolkit'

export enum ApplicationModal {
  WALLET,
}

export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
