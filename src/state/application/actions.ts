import { createAction } from '@reduxjs/toolkit'

export enum ApplicationModal {
  WALLET,
  DEPLOY,
}

export enum PagingAction {
  PREV,
  NEXT,
}

export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
export const updateCurrentPage = createAction<number>('application/updateCurrentPage')
