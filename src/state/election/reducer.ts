import { createReducer } from '@reduxjs/toolkit'
import { setTotalElections, updateCurrentPage } from './actions'

export interface ElectionState {
  readonly total: number
  readonly currentPage: number
}

const initialState: ElectionState = {
  total: 0,
  currentPage: 0,
}

export default createReducer(initialState, (builder) => {
  builder.addCase(setTotalElections, (state, action) => {
    state.total = action.payload
  })
  builder.addCase(updateCurrentPage, (state, action) => {
    state.currentPage = action.payload
  })
})
