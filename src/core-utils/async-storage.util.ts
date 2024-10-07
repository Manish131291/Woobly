import secureLocalStorage from "react-secure-storage";

import CryptoJS from "crypto-js";

const { REACT_APP_ITERATIONS, REACT_APP_KEY_BUFFER, REACT_APP_KEY_SIZE } =
  process.env;

export class Storage {
  static setItemAsync(key: string, value: string): void {
    secureLocalStorage.setItem(key, value);
  }

  static setItemAsyncWithEncryption(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  static getItemAsync(key: string): string | null {
    return secureLocalStorage.getItem(key) as string | null;
  }

  static getItemAsyncWithDecryption(key: string): string | null {
    const value = localStorage.getItem(key);
    if (value != null) {
      return value;
    }
    return "";
  }

  static existAsync(key: string): boolean {
    const value = localStorage.getItem(key);
    return !!value;
  }

  static deleteItemAsync(key: string): void {
    return secureLocalStorage.removeItem(key);
  }
}
export class SessionStorage {
  static setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  static getItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  static removeItem(key: string): void {
    return sessionStorage.removeItem(key);
  }

  static clear(): void {
    return sessionStorage.clear();
  }
}

export function generateKey(salt, passPhrase) {
  return CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
    keySize: Number(REACT_APP_KEY_SIZE) / Number(REACT_APP_KEY_BUFFER),
    iterations: Number(REACT_APP_ITERATIONS),
  });
}

export function encryptWithIvSalt(passPhrase, iv, plainText) {
  const key = CryptoJS.enc.Utf8.parse(passPhrase);
  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

export function decryptWithIvSalt(passPhrase, iv, cipherText) {
  const key = CryptoJS.enc.Utf8.parse(passPhrase);
  if (!cipherText) {
    return null;
  }
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(cipherText),
  });
  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

const rsaPublicKey =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgFGVfrY4jQSoZQWWygZ83roKXWD4YeT2x2p41dGkPixe73rT2IW04glagN2vgoZoHuOPqa5and6kAmK2ujmCHu6D1auJhE2tXP+yLkpSiYMQucDKmCsWMnW9XlC5K7OSL77TXXcfvTvyZcjObEz6LIBRzs6+FqpFbUO9SJEfh6wIDAQAB";

export function ArrayBufferToBase64(input: any) {
  return Buffer.from(input, "utf8").toString("base64");
}

export function Base64ToArrayBuffer(encoded: any) {
  return Buffer.from(encoded, "base64");
}

export function ArrayBufferToUTF8(encoded: any) {
  return Buffer.from(encoded, "utf8");
}

export const generateRandom = (_stringLength: any) => {
  const random = "";
  return {
    base64: ArrayBufferToBase64(random),
    object: random,
  };
};

export const randomGenerateNumber = function () {
  const randomArray = new Uint32Array(32 / 8); // 32-bit numbers, 32/4 = 8 bytes
  crypto.getRandomValues(randomArray);
  // Convert the array of 32-bit integers into a string
  let randomString = "";
  randomArray.forEach((val) => {
    randomString += val.toString(16).padStart(8, "0");
  });

  return randomString;
};
