'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { type Locale, translations, getTranslation } from './translations';

export type { Locale };
export { getTranslation };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || 'en');
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('yaramall-locale') as Locale | null;
    if (stored && ['ar', 'fr', 'en'].includes(stored)) {
      setLocaleState(stored);
      document.cookie = `yaramall-locale=${stored}; path=/; max-age=31536000; SameSite=Lax`;
      return;
    }
    if (initialLocale) {
      localStorage.setItem('yaramall-locale', initialLocale);
      document.cookie = `yaramall-locale=${initialLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [initialLocale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('yaramall-locale', newLocale);
    document.cookie = `yaramall-locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }, [router]);

  const t = useCallback((key: string) => {
    return translations[locale][key] || translations.ar[key] || key;
  }, [locale]);

  const dir: 'rtl' | 'ltr' = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}