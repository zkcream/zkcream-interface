import { Store, createStore } from 'redux'
import {
  setElectionData,
  setElections,
  setLogs,
  setTotalElections,
  Target,
  updateCurrentPage,
  updateElectionData,
  UpdatePayloads,
  VotingState,
} from './actions'
import reducer, { ElectionData, ElectionState, Logs } from './reducer'

const electionData: ElectionData = {
  title: 'foo',
  recipients: ['a', 'b'],
  electionType: '0',
  owner: 'foo',
  coordinator: 'foo',
  zkCreamAddress: 'foo',
  maciAddress: 'foo',
  votingTokenAddress: 'foo',
  signUpTokenAddress: 'foo',
  hash: 'foo',
  tallyHash: 'foo',
  approved: false,
  maciParams: {
    maxVoteOptionIndex: 1,
    messageTreeDepth: 1,
    publishMessageLogs: ['foo'],
    signUpLogs: ['foo'],
    coordinatorPubKey: 'foo',
    stateTreeDepth: 1,
    voteOptionTreeDepth: 1,
    signUpTimestamp: 'foo',
    signUpDurationSeconds: 1,
    votingDurationSeconds: 1,
  },
  tokenCounts: [1, 1],
  signUpTimestamp: 1,
  signUpUntil: null,
  votingUntil: null,
  totalVotes: 1,
  hasUnprocessedMessages: true,
  votingState: 1,
}

describe('election reducer', () => {
  let store: Store<ElectionState>

  beforeEach(() => {
    store = createStore(reducer, {
      total: 0,
      currentPage: 0,
      electionData: undefined,
      elections: [],
      logs: [],
    })
  })

  describe('updateCurrentPage()', () => {
    it('set current page number', () => {
      store.dispatch(updateCurrentPage(1))
      expect(store.getState().currentPage).toEqual(1)
    })
  })
  describe('setTotalElections()', () => {
    it('set total elections length', () => {
      store.dispatch(setTotalElections(1))
      expect(store.getState().total).toEqual(1)
    })
  })
  describe('setLogs()', () => {
    it('set logs', () => {
      const logs: Logs = [['foo', 'bar']]
      store.dispatch(setLogs(logs))
      expect(store.getState().logs).toEqual(logs)
    })
  })
  describe('set/update election(s)', () => {
    it('set elections, set election, update election', () => {
      store.dispatch(setElections([electionData]))
      expect(store.getState().elections[0]).toEqual(electionData)

      store.dispatch(setElectionData(store.getState().elections[0]))
      expect(store.getState().electionData).toEqual(electionData)

      const a: UpdatePayloads = {
        target: Target.HAS_UNPROCESSED_MESSAGES,
        zkcreamAddress: electionData.zkCreamAddress,
      }

      store.dispatch(updateElectionData(a))
      store.dispatch(setElectionData(store.getState().elections[0]))
      expect(store.getState().electionData?.hasUnprocessedMessages).toBeFalsy()

      const b: UpdatePayloads = {
        target: Target.PUBLISHED,
        zkcreamAddress: electionData.zkCreamAddress,
        tallyHash: 'bar',
      }

      store.dispatch(updateElectionData(b))
      store.dispatch(setElectionData(store.getState().elections[0]))
      expect(store.getState().electionData?.tallyHash).toEqual(b.tallyHash)

      const c: UpdatePayloads = {
        target: Target.APPROVED,
        zkcreamAddress: electionData.zkCreamAddress,
      }

      store.dispatch(updateElectionData(c))
      store.dispatch(setElectionData(store.getState().elections[0]))
      expect(store.getState().electionData?.approved).toBeTruthy()
    })
  })
})
