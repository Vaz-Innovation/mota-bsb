import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { translations, Language } from "@/i18n/translations";

const localeMap: Record<string, Language> = {
  "pt-BR": "PT",
  "es-ES": "ES",
  "en-US": "EN",
  "de-DE": "DE",
  "it-IT": "IT",
  "fr-FR": "FR",
  "zh-CN": "ZH",
};

const reverseLocaleMap: Record<Language, string> = {
  PT: "pt-BR",
  ES: "es-ES",
  EN: "en-US",
  DE: "de-DE",
  IT: "it-IT",
  FR: "fr-FR",
  ZH: "zh-CN",
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const { locale } = router;

  const [language, setLanguageState] = useState<Language>(
    (locale && localeMap[locale]) || "PT",
  );

  useEffect(() => {
    if (locale && localeMap[locale]) {
      setLanguageState(localeMap[locale]);
    }
  }, [locale]);

  const setLanguage = (lang: Language) => {
    const nextLocale = reverseLocaleMap[lang];
    if (nextLocale) {
      router.push(router.asPath, router.asPath, { locale: nextLocale });
    } else {
      setLanguageState(lang);
    }
  };

  const t = (key: string): string => {
    // Attempt flat lookup first (mota-bsb style)
    const flatValue = (translations[language] as any)?.[key];
    if (flatValue) return flatValue;

    // Attempt nested lookup (mota-poa style fallback)
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
