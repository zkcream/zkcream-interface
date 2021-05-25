import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { AppState } from './index'

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
