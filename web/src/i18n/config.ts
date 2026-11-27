export const DEFAULT_LOCALE = "en";
export const SUPPORTED_LOCALES = [DEFAULT_LOCALE, "zh-CN"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
export const LOCALE_STORAGE_KEY = "artex_locale";

export function resolveLocale(value: string | null | undefined): AppLocale {
  return /^zh(?:-|$)/i.test(value ?? "") ? "zh-CN" : DEFAULT_LOCALE;
}
