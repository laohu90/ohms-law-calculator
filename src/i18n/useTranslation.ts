import { useState, useEffect, useCallback } from 'react';
import { Language, TRANSLATIONS, TranslationSchema, LANGUAGES } from './translations';

const STORAGE_KEY_LANG = 'ohms_calculator_lang_v2';

export function getInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LANG) as Language;
    if (saved && Object.keys(LANGUAGES).includes(saved)) {
      return saved;
    }

    // Smart browser language detection
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('zh')) return 'zh';
    if (browserLang.startsWith('es')) return 'es';
    if (browserLang.startsWith('fr')) return 'fr';
    if (browserLang.startsWith('pt')) return 'pt';
    
    // Default to English as requested
    return 'en';
  } catch {
    return 'en';
  }
}

export function useTranslation() {
  const [lang, setLangState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, newLang);
      document.documentElement.lang = newLang;
    } catch {
      // Storage restricted
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t: TranslationSchema = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return { lang, setLanguage, t, languages: LANGUAGES };
}
