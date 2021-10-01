import { createAction } from '@reduxjs/toolkit'

import { ElectionData, Logs } from './reducer'

export enum PagingAction {
  PREV,
  NEXT,
}

export enum VotingState {
  ACTIVE,
  CALCULATING,
  AWAITING,
  FINISHED,
}

export enum Target {
  HAS_UNPROCESSED_MESSAGES,
  APPROVED,
}

export const setTotalElections = createAction<number>('election/setTotalElections')
export const updateCurrentPage = createAction<number>('election/updateCurrentPage')
export const setElectionData = createAction<ElectionData | undefined>('election/setElectionData')
export const updateElectionData = createAction<Target>('election/updateElectionData')
export const setElections = createAction<ElectionData[]>('election/setElections')
export const setLogs = createAction<Logs>('election/setLogs')
