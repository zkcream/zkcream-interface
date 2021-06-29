import { createAction } from '@reduxjs/toolkit'

export enum PagingAction {
  PREV,
  NEXT,
}

export const setTotalElections = createAction<number>('election/setTotalElections')
export const updateCurrentPage = createAction<number>('application/updateCurrentPage')
