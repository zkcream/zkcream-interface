import { createAction } from '@reduxjs/toolkit'

import { ElectionData } from './reducer'

export enum PagingAction {
  PREV,
  NEXT,
}

export const setTotalElections = createAction<number>('election/setTotalElections')
export const updateCurrentPage = createAction<number>('election/updateCurrentPage')
export const setElectionInfo = createAction<ElectionData | null>('election/setElectionInfo')
