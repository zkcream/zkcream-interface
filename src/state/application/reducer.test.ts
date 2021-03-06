import { Store, createStore } from 'redux'
import { ApplicationModal, setOpenModal, toggleToggleable, updateBlockNumber, updateChainId } from './actions'
import reducer, { ApplicationState } from './reducer'

describe('application reducer', () => {
  let store: Store<ApplicationState>

  beforeEach(() => {
    store = createStore(reducer, {
      chainId: null,
      blockNumber: {
        [1]: 3,
      },
      openModal: null,
      toggleable: true,
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

  describe('updateChainId', () => {
    it('updates chain id', () => {
      expect(store.getState().chainId).toEqual(null)

      store.dispatch(updateChainId({ chainId: 1 }))

      expect(store.getState().chainId).toEqual(1)
    })
  })
  describe('updateBlockNumber', () => {
    it('updates block number', () => {
      store.dispatch(updateBlockNumber({ chainId: 1, blockNumber: 4 }))
      expect(store.getState().blockNumber[1]).toEqual(4)
    })
    it('no op if late', () => {
      store.dispatch(updateBlockNumber({ chainId: 1, blockNumber: 2 }))
      expect(store.getState().blockNumber[1]).toEqual(3)
    })
    it('works with non-set chains', () => {
      store.dispatch(updateBlockNumber({ chainId: 3, blockNumber: 2 }))
      expect(store.getState().blockNumber).toEqual({
        [1]: 3,
        [3]: 2,
      })
    })
  })
  describe('toggleToggleable()', () => {
    it('should toggle', () => {
      store.dispatch(toggleToggleable(false))
      expect(store.getState().toggleable).toBeFalsy()
    })
  })
})
