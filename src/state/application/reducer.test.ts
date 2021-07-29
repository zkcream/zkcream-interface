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
    it('set note modal', () => {
      store.dispatch(setOpenModal(ApplicationModal.NOTE))
      expect(store.getState().openModal).toEqual(ApplicationModal.NOTE)
    })
    it('set note modal', () => {
      store.dispatch(setOpenModal(ApplicationModal.SIGNUP))
      expect(store.getState().openModal).toEqual(ApplicationModal.SIGNUP)
    })
    it('set note modal', () => {
      store.dispatch(setOpenModal(ApplicationModal.VOTERSTATE))
      expect(store.getState().openModal).toEqual(ApplicationModal.VOTERSTATE)
    })
    it('set note modal', () => {
      store.dispatch(setOpenModal(ApplicationModal.RANDOM_STATELEAF))
      expect(store.getState().openModal).toEqual(ApplicationModal.RANDOM_STATELEAF)
    })
  })
})
