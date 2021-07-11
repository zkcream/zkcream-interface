import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { fetchTokenStatus } from '../../utils/api'

export enum TokenType {
  NULL = 0,
  VOTING = 1 << 0,
  SIGNUP = 1 << 1,
}

export enum Status {
  UNAPPROVED = 0,
  APPROVED = 1 << 0,
}

export interface TokenState {
  readonly holdingToken: TokenType
  readonly isApproved: Status
  readonly txStatus: 'idle' | 'loading' | 'failed'
}

const initialState: TokenState = {
  holdingToken: TokenType.NULL,
  isApproved: Status.UNAPPROVED,
  txStatus: 'idle',
}

export const fetchTokenState = createAsyncThunk<TokenState, { address: string; account: string }>(
  'token/fetchTokenState',
  async ({ address, account }) => {
    const r = await fetchTokenStatus(address, account)
    return r
  }
)

const userSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTokenState.pending, (state) => {
        state.txStatus = 'loading'
      })
      .addCase(fetchTokenState.fulfilled, (state, action) => {
        state.txStatus = 'idle'
        state.holdingToken = action.payload.holdingToken
        state.isApproved = action.payload.isApproved
      })
  },
})

export default userSlice.reducer
