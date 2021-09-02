import { createReducer } from '@reduxjs/toolkit'
import { setElections, setElectionData, setTotalElections, updateCurrentPage, setLogs } from './actions'

export type StateIndex = string | undefined | null

// SignUpLog {
//   pubkey: BigInt[] // PubKey
//   signUpIndex: BigInt
//   voiceCreditBalance: BigInt
// }

// PublishMessageLog {
//   message: BigInt[iv, BigInt[]] // Message
//   encPubKey:  BigInt[] // PubKey
// }

export type Log = string[]
export type Logs = Log[]

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

export interface DateProps {
  d: number
  h: number
  m: number
  s: number
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
  tallyHash: string
  approved: boolean | undefined
  maciParams: MaciParams
  tokenCounts: number[]
  signUpUntil: DateProps | null
  votingUntil: DateProps | null
}

export interface ElectionState {
  readonly total: number
  readonly currentPage: number
  readonly electionData: ElectionData | undefined
  readonly elections: ElectionData[]
  readonly logs: Logs
}

const initialState: ElectionState = {
  total: 0,
  currentPage: 0,
  electionData: undefined,
  elections: [],
  logs: [],
}

export default createReducer(initialState, (builder) => {
  builder.addCase(setTotalElections, (state, action) => {
    state.total = action.payload
  })
  builder.addCase(updateCurrentPage, (state, action) => {
    state.currentPage = action.payload
  })
  builder.addCase(setElectionData, (state, action) => {
    state.electionData = action.payload
  })
  builder.addCase(setElections, (state, action) => {
    state.elections = action.payload
  })
  builder.addCase(setLogs, (state, action) => {
    state.logs = action.payload
  })
})
