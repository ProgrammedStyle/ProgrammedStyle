import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

const LanguageContext = createContext();

const translations = {
  en,
  ar,
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ar'); // Always start with 'ar' for SSR
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted and load saved language
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  useEffect(() => {
    // Save language to localStorage and update document (client-side only)
    if (typeof window !== 'undefined' && mounted) {
      localStorage.setItem('language', language);
      document.documentElement.lang = language;
      document.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language, mounted]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const changeLanguage = (lang) => {
    if (lang === 'en' || lang === 'ar') {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

