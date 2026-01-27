import React, { createContext, useContext, useState, ReactNode } from "react";
import { translations, Language, TranslationKey } from "@/i18n/translations";

// Map language codes to locale strings for date formatting
const localeMap: Record<Language, string> = {
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
  t: (key: TranslationKey) => string;
  locale: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("PT");

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations["PT"][key] || key;
  };

  const locale = localeMap[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, locale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
