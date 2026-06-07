import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en/en.json";
import arTranslation from "./locales/ar/ar.json";
import LanguageDetector from 'i18next-browser-languagedetector'; 

const resources = {
  en: {
    translation: enTranslation
  },
  ar: {
    translation: arTranslation
  }
};

i18n
  .use(LanguageDetector) // يكتشف لغة المستخدم تلقائياً
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en",
    detection:{
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;