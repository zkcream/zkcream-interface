import { Store, createStore } from 'redux'
import { setLogs, setTotalElections, updateCurrentPage } from './actions'
import reducer, { ElectionState, Logs } from './reducer'

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
})
