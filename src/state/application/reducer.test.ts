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
    it('modal tests', () => {
      for (let i = 0; i < Object.entries(ApplicationModal).length / 2; i++) {
        store.dispatch(setOpenModal(i))
        expect(store.getState().openModal).toEqual(i)
      }
    })
  })
})
