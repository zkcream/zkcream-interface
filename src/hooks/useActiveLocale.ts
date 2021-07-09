import { useMemo } from 'react'

import { DEFAULT_LOCALE, SupportedLocale, SUPPORTED_LOCALES } from '../constants/locales'
import { useUserLocale } from '../state/user/hooks'

function parseLocale(maybeSupportedLocale: string): SupportedLocale | undefined {
  const lowerMaybeSupportedLocale = maybeSupportedLocale.toLowerCase()
  return SUPPORTED_LOCALES.find(
    (locale) => locale.toLowerCase() === lowerMaybeSupportedLocale || locale.split('-')[0] === lowerMaybeSupportedLocale
  )
}

export function navigatorLocale(): SupportedLocale | undefined {
  if (!navigator.language) return undefined

  const [language, region] = navigator.language.split('-')

  if (region) {
    return parseLocale(`${language}-${region.toUpperCase()}`) ?? parseLocale(language)
  }

  return parseLocale(language)
}

export function useActiveLocale(): SupportedLocale {
  const userLocale = useUserLocale()

  return useMemo(() => {
    return userLocale ?? navigatorLocale() ?? DEFAULT_LOCALE
  }, [userLocale])
}
