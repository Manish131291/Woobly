import { Storage } from './async-storage.util';

export function getUserLanguage(): string {
  // check language is available in local storage
  const storedLanguage = getStoredLanguage();

  // detect language from browser
  const userLanguage =
    storedLanguage ??
    (navigator.languages?.length ? navigator.languages[0] : navigator.language);

  const lng = userLanguage.substring(0, 2);
  Storage.setItemAsync('LANGUAGE', lng);
  return lng;
}

export function getStoredLanguage(): string | null {
  return Storage.getItemAsync('LANGUAGE');
}

export function getStoredLanguageVersion(): string | null {
  return Storage.getItemAsync('LANGUAGE-VERSION');
}

export function getStoredTranslations(): string | null {
  return Storage.getItemAsync('LANGUAGE-TRANSLATION');
}

export function getUserLanguageVersion(): string | null {
  return Storage.getItemAsync('LANGUAGE-VERSION');
}

export function clearUserLanguage(language) {
  Storage.setItemAsync('LANGUAGE', language);
  Storage.deleteItemAsync('LANGUAGE-VERSION');
  Storage.deleteItemAsync('LANGUAGE-NAME');
  Storage.deleteItemAsync('LANGUAGE-TRANSLATION');
}

export function setLanguageTranslations(language: any, i18n: any) {
  if (language?.translations !== undefined) {
    const translationObject = language?.translations;
    Storage.setItemAsync('LANGUAGE', language?.languageCode);
    Storage.setItemAsync('LANGUAGE-VERSION', language?.languageVersion);
    Storage.setItemAsync('LANGUAGE-NAME', language?.languageName);
    Storage.setItemAsync(
      'LANGUAGE-TRANSLATION',
      JSON.stringify(translationObject)
    );
    i18n.addResourceBundle(
      language?.languageCode,
      'translations',
      translationObject,
      true,
      true
    );
    i18n.changeLanguage(language?.languageCode);
  }
}
