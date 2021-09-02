import { createStore } from '@reduxjs/toolkit'
import { Store } from 'redux'
import { updateUserLocale } from './actions'
import reducer, { UserState } from './reducer'

describe('token reducer', () => {
  let store: Store<UserState>

  beforeEach(() => {
    store = createStore(reducer, {
      userLocale: null,
      timestamp: new Date().getTime(),
    })
  })

  describe('updateUserLocale()', () => {
    it('set token states', () => {
      store.dispatch(updateUserLocale({ userLocale: 'en-US' }))
      expect(store.getState().userLocale).toEqual('en-US')
    })
  })
})
