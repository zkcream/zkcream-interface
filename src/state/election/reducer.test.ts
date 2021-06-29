import { Store, createStore } from 'redux'
import { setTotalElections, updateCurrentPage } from './actions'
import reducer, { ElectionState } from './reducer'

describe('election reducer', () => {
  let store: Store<ElectionState>

  beforeEach(() => {
    store = createStore(reducer, {
      total: 0,
      currentPage: 0,
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
})
