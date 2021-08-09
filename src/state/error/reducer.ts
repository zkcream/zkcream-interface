import { createReducer } from '@reduxjs/toolkit'
import { ErrorType, setErrorState } from './actions'

export interface ErrorState {
  readonly error: ErrorType | null
}

const initialState: ErrorState = {
  error: null,
}

export default createReducer(initialState, (builder) => {
  builder.addCase(setErrorState, (state, action) => {
    state.error = action.payload
  })
})
