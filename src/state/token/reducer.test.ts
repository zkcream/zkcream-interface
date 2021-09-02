import { createStore } from '@reduxjs/toolkit'
import { Store } from 'redux'
import reducer, { fetchTokenState, Status, TokenState, TokenType } from './reducer'

describe('token reducer', () => {
  let store: Store<TokenState>

  beforeEach(() => {
    store = createStore(reducer, {
      holdingToken: TokenType.NULL,
      isApproved: Status.UNAPPROVED,
      txStatus: 'idle',
    })
  })

  describe('fetchTokenState()', () => {
    it('set token states', () => {
      const updateState: TokenState = {
        holdingToken: TokenType.VOTING,
        isApproved: Status.APPROVED,
        txStatus: 'idle',
      }
      store.dispatch(fetchTokenState.fulfilled(updateState, '', { zkCreamAddress: 'foo', account: 'bar' }, null))
      expect(store.getState().holdingToken).toEqual(TokenType.VOTING)
      expect(store.getState().isApproved).toEqual(Status.APPROVED)
    })
  })
})
