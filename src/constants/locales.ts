export const SUPPORTED_LOCALES = ['en-US', 'ja-JP'] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]
export const DEFAULT_LOCALE: SupportedLocale = 'en-US'
