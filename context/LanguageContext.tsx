"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LANGUAGE, dictionaries, type Language } from "@/i18n/dictionaries";

type LanguageContextValue = {
  lang: Language;
  language: Language;
  setLang: (language: Language) => void;
  setLanguage: (language: Language) => void;
  t: (typeof dictionaries)[Language];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const saved = window.localStorage.getItem("language");
  return saved === "en" || saved === "bm" ? saved : DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = lang === "bm" ? "ms" : "en";
    window.localStorage.setItem("language", lang);
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      language: lang,
      setLang: setLangState,
      setLanguage: setLangState,
      t: dictionaries[lang],
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
