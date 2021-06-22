import { createAction } from '@reduxjs/toolkit'

export enum ApplicationModal {
  WALLET,
  DEPLOY,
}

export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
export const updateCurrentPage = createAction<number>('application/updateCurrentPage')
export const setTotalElectionsCount = createAction<number>('application/setTotalElectionsCount')