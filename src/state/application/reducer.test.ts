import { createStore, Store } from 'redux'
import { ApplicationModal, setOpenModal, updateCurrentPage } from './actions'
import reducer, { ApplicationState } from './reducer'

describe('application reducer', () => {
  let store: Store<ApplicationState>

  beforeEach(() => {
    store = createStore(reducer, {
      setOpenModal: null,
    })
  })

  describe('setOpenModal()', () => {
    it('set wallet modal', () => {
      store.dispatch(setOpenModal(ApplicationModal.WALLET))
      expect(store.getState().openModal).toEqual(ApplicationModal.WALLET)
    })
    it('set deploy modal', () => {
      store.dispatch(setOpenModal(ApplicationModal.DEPLOY))
      expect(store.getState().openModal).toEqual(ApplicationModal.DEPLOY)
    })
    it('set current page number', () => {
      store.dispatch(updateCurrentPage(1))
      expect(store.getState().currentPage).toEqual(1)
    })
  })
})
