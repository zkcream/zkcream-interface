import { createAction } from '@reduxjs/toolkit'

export const setTotalElections = createAction<number>('election/setTotalElections')
