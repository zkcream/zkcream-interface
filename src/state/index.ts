import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import application from './application/reducer'
import { updateVersion } from './global/actions'

const store = configureStore({
  reducer: {
    application,
  },
  middleware: [...getDefaultMiddleware({ thunk: false })],
})

store.dispatch(updateVersion())
export default store

export type AppState = ReturnType<typeof store.getState>
