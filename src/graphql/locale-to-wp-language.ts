import { LanguageCodeFilterEnum } from "./__gen__/graphql";

export const localeToWpLanguage = {
  "pt-BR": LanguageCodeFilterEnum.Pt,
  "es-ES": LanguageCodeFilterEnum.Pt, // Fallback to Pt as WP doesn't have ES
  "en-US": LanguageCodeFilterEnum.En,
  "de-DE": LanguageCodeFilterEnum.Pt,
  "it-IT": LanguageCodeFilterEnum.Pt,
  "fr-FR": LanguageCodeFilterEnum.Pt,
  "zh-CN": LanguageCodeFilterEnum.Pt,
} as const;

export type SupportedLocale = keyof typeof localeToWpLanguage;

export function resolveWpLanguage(locale?: string): (typeof localeToWpLanguage)[SupportedLocale] {
  if (!locale) {
    return localeToWpLanguage["pt-BR"];
  }

  return localeToWpLanguage[locale as SupportedLocale] ?? localeToWpLanguage["pt-BR"];
}
