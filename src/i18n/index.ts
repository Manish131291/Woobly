import {
  getStoredLanguageVersion,
  getStoredTranslations,
  getUserLanguage,
} from "../core-utils/language.util";
import { EN, HE, HI } from "./translate.i18n";

const lng = getUserLanguage();
const translations = getStoredTranslations();
let version = getStoredLanguageVersion();
const bundledTranslations = {
  en: EN,
  hi: HI,
  he: HE,
};
export const bundledVersions = Object.keys(bundledTranslations).reduce(
  (versionObj, lan) => {
    return { ...versionObj, [lan]: bundledTranslations[lan]?.version || "1.0" };
  },
  {}
);

let resources;

if (translations) {
  resources = {
    [lng]: { translations: JSON.parse(translations) },
  };
  resources = Object.keys(bundledTranslations).reduce((versionObj, lan) => {
    let updatedTranslation;
    if (lan !== lng) {
      updatedTranslation = { ...versionObj, [lan]: bundledTranslations[lan] };
    } else {
      updatedTranslation = versionObj;
    }
    return updatedTranslation;
  }, resources);
} else {
  resources = bundledTranslations;
  version = bundledVersions[lng];
}

export const translationVersion = version ?? "1.0";
