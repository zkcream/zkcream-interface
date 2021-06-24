import { createReducer } from '@reduxjs/toolkit'
import { ApplicationModal, setOpenModal, updateCurrentPage } from './actions'

export interface ApplicationState {
  readonly openModal: ApplicationModal | null
  readonly currentPage: number
}

const initialState: ApplicationState = {
  openModal: null,
  currentPage: 0,
}

export default createReducer(initialState, (builder) => {
  builder.addCase(setOpenModal, (state, action) => {
    state.openModal = action.payload
  })
  builder.addCase(updateCurrentPage, (state, action) => {
    state.currentPage = action.payload
  })
})
