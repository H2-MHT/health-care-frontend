import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpApi) // Load translations via HTTP
  .use(LanguageDetector) // Detect user's language
  .use(initReactI18next) // Integrate with React
  .init({
    fallbackLng: "en", // Default language
    supportedLngs: ["en", "fr", "es","ro","bg","lt","pl","uk","ru","hi","ar","pt-br","ur"], // Supported languages
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Path to JSON translation files
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;








