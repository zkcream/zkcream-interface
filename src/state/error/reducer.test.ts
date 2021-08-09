import { Store, createStore } from 'redux'
import { ErrorType, setErrorState } from './actions'
import reducer, { ErrorState } from './reducer'

describe('error reducer', () => {
  let store: Store<ErrorState>

  beforeEach(() => {
    store = createStore(reducer, {
      setErrorState: null,
    })
  })

  describe('setOpenModal()', () => {
    it('set wallet modal', () => {
      store.dispatch(setErrorState(ErrorType.NETWORK_ERROR))
      expect(store.getState().error).toEqual(ErrorType.NETWORK_ERROR)
    })
  })
})
