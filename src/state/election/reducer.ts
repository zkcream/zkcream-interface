import { createReducer } from '@reduxjs/toolkit'
import { setElections, setElectionData, setTotalElections, updateCurrentPage, setLogs, VotingState, updateElectionData, Target } from './actions'

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

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
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
  signUpTimestamp: number // since react toolkit cannot store non-serializable value
  signUpUntil: TimeLeft | null
  votingUntil: TimeLeft | null
  totalVotes: number
  hasUnprocessedMessages: boolean
  votingState: VotingState
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
  builder.addCase(updateElectionData, (state, action) => {
    switch(action.payload) {
      case Target.HAS_UNPROCESSED_MESSAGES :
        state.electionData!.hasUnprocessedMessages = false
        break
      case Target.APPROVED :
        state.electionData!.approved = true
        break
    }
  })
  builder.addCase(setElections, (state, action) => {
    state.elections = action.payload
  })
  builder.addCase(setLogs, (state, action) => {
    state.logs = action.payload
  })
})
