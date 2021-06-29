import { Store, createStore } from 'redux'
import { ApplicationModal, setOpenModal } from './actions'
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
  })
})
