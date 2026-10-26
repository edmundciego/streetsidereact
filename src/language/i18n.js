import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { english } from "./en";

// Keep the default language ready for SSR. Other dictionaries are separate
// chunks, loaded once when a customer actually selects that language.
const languageLoaders = {
  es: () => import("./es").then((module) => module.spain),
  bn: () => import("./bn").then((module) => module.bengali),
  ar: () => import("./ar").then((module) => module.arabic),
};

const translationBackend = {
  type: "backend",
  read(language, namespace, callback) {
    const load = languageLoaders[language];
    if (!load) {
      callback(null, {});
      return;
    }
    load().then(
      (translations) => callback(null, translations),
      (error) => callback(error, false)
    );
  },
};

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: english,
  },
};

i18n
  .use(translationBackend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    partialBundledLanguages: true,
    // Keep the current screen visible while a different language is loading.
    react: { useSuspense: false },
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
