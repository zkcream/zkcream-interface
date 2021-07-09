import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import application from './application/reducer'
import election from './election/reducer'
import user from './user/reducer'
import { updateVersion } from './global/actions'

const store = configureStore({
  reducer: {
    application,
    election,
    user,
  },
  middleware: [...getDefaultMiddleware({ thunk: false })],
})

store.dispatch(updateVersion())
export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
