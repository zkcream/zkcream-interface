import { createReducer } from '@reduxjs/toolkit'
import { setTotalElections } from './actions'

export interface ElectionState {
  readonly total: number
}

const initialState: ElectionState = {
  total: 0,
}

export default createReducer(initialState, (builder) => {
  builder.addCase(setTotalElections, (state, action) => {
    console.log(action)
  })
})
