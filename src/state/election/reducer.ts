import { createReducer } from '@reduxjs/toolkit'
import { setTotalElections, updateCurrentPage } from './actions'

export interface MaciParams {
  maxVoteOptionIndex: number
  messageTreeDepth: number
  publishMessageLogs: any[]
  signUpLogs: any[]
  coordinatorPubKey: any
  stateTreeDepth: number
  voteOptionTreeDepth: number
  signUpTimestamp: any
  signUpDurationSeconds: number
  votingDurationSeconds: number
}

export interface ElectionData {
  title: string
  recipients: string[]
  electionType: string
  owner: string
  coordinator: string
  zkCreamAddress: string
  maciAddress: string
  votingTokenAddress: string
  signUpTokenAddress: string
  hash: string
  maciParams: MaciParams
}

export interface ElectionState {
  readonly total: number
  readonly currentPage: number
}

const initialState: ElectionState = {
  total: 0,
  currentPage: 0,
}

export default createReducer(initialState, (builder) => {
  builder.addCase(setTotalElections, (state, action) => {
    state.total = action.payload
  })
  builder.addCase(updateCurrentPage, (state, action) => {
    state.currentPage = action.payload
  })
})
