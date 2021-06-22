import { createReducer } from '@reduxjs/toolkit'
import { ApplicationModal, setOpenModal, updateCurrentPage, setTotalElectionsCount } from './actions'

export interface ApplicationState {
  readonly openModal: ApplicationModal | null
  readonly currentPage: number
  readonly totalElectionsCount: number | null
}

const initialState: ApplicationState = {
  openModal: null,
  currentPage: 0,
  totalElectionsCount: null
}

export default createReducer(initialState, (builder) => {
  builder.addCase(setOpenModal, (state, action) => {
    state.openModal = action.payload
  })
  builder.addCase(updateCurrentPage, (state, action) => {
    state.currentPage = action.payload
  })
  builder.addCase(setTotalElectionsCount, (state, action) => {
    state.totalElectionsCount = action.payload
  })
})
