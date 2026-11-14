import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import pl from "@/i18n/locales/pl.json";

void i18n.use(initReactI18next).init({
  resources: { pl: { translation: pl } },
  lng: "pl",
  fallbackLng: "pl",
  supportedLngs: ["pl"],
  interpolation: { escapeValue: false },
  initAsync: false,
});

document.title = i18n.t("app.title");
document.documentElement.lang = "pl";

export default i18n;
