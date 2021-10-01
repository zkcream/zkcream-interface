import { Store, createStore } from 'redux'
import { setElectionData, setLogs, setTotalElections, Target, updateCurrentPage, updateElectionData, VotingState } from './actions'
import reducer, { ElectionData, ElectionState, Logs } from './reducer'

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
  describe('set/update ElectionData', () => {
    it('set election data', () => {
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
        maciParams : {
          maxVoteOptionIndex: 1,
          messageTreeDepth: 1,
          publishMessageLogs: ['foo'],
          signUpLogs: ['foo'],
          coordinatorPubKey: 'foo',
          stateTreeDepth: 1,
          voteOptionTreeDepth: 1,
          signUpTimestamp: 'foo',
          signUpDurationSeconds: 1,
          votingDurationSeconds: 1
        },
        tokenCounts: [1, 1],
        signUpTimestamp: 1,
        signUpUntil: null,
        votingUntil: null,
        totalVotes: 1,
        hasUnprocessedMessages: true,
        votingState: 1,
      }   
      store.dispatch(setElectionData(electionData))
      expect(store.getState().electionData).toEqual(electionData)

      store.dispatch(updateElectionData(Target.HAS_UNPROCESSED_MESSAGES))
      expect(store.getState().electionData?.hasUnprocessedMessages).toBeFalsy()

      store.dispatch(updateElectionData(Target.APPROVED))
      expect(store.getState().electionData?.approved).toBeTruthy()
    })
  })
})
