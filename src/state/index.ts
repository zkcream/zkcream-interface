import { configureStore } from '@reduxjs/toolkit'
import application from './application/reducer'
import election from './election/reducer'
import error from './error/reducer'
import token from './token/reducer'
import user from './user/reducer'
import { updateVersion } from './global/actions'

const store = configureStore({
  reducer: {
    application,
    election,
    error,
    token,
    user,
  },
})

store.dispatch(updateVersion())
export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
