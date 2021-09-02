import { createAction } from '@reduxjs/toolkit'

import { ElectionData, Logs } from './reducer'

export enum PagingAction {
  PREV,
  NEXT,
}

export const setTotalElections = createAction<number>('election/setTotalElections')
export const updateCurrentPage = createAction<number>('election/updateCurrentPage')
export const setElectionData = createAction<ElectionData | undefined>('election/setElectionData')
export const setElections = createAction<ElectionData[]>('election/setElections')
export const setLogs = createAction<Logs>('election/setLogs')
