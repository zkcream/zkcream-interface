import { configureStore } from '@reduxjs/toolkit'
import application from './application/reducer'
import election from './election/reducer'
import token from './token/reducer'
import user from './user/reducer'
import { updateVersion } from './global/actions'

const store = configureStore({
  reducer: {
    application,
    election,
    token,
    user,
  },
})

store.dispatch(updateVersion())
export default store

console.log(store.getState().election)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
