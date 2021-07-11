import { useAppSelector } from '../hooks'
import { SupportedLocale } from '../../constants/locales'
import { RootState } from '../index'

export function useUserLocale(): SupportedLocale | null {
  return useAppSelector((state: RootState) => state.user.userLocale)
}
