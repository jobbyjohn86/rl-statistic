import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class DecryptionService {

    private secretKey: string = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
    private iv: string = 'a3f5d1c5d4b69b4e3b4b5c3d4b4e3f3d';

    constructor() { }

    private base64UrlSafeToBase64(base64UrlSafe: string): string {
        let base64 = base64UrlSafe.replace(/-/g, '+').replace(/_/g, '/');
        switch (base64.length % 4) {
            case 2: base64 += '=='; break;
            case 3: base64 += '='; break;
        }
        return base64;
    }

    decrypt(encryptedData: string): string {
        const base64 = this.base64UrlSafeToBase64(encryptedData);
        const bytes = CryptoJS.AES.decrypt(base64, CryptoJS.enc.Hex.parse(this.secretKey), {
            iv: CryptoJS.enc.Hex.parse(this.iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return bytes.toString(CryptoJS.enc.Utf8);
    }

    //===================//===================//=============


    decryptWithParams(cipherText: string): string {
        const passPhrase = 'RanceLab';
        const saltValue = 'FusionRetail6';
        const hashAlgorithm = 'SHA1';
        const passwordIterations = 6;
        const initVector = 'A1B2C3D4E5F6G7H8';
        const keySize = 128;
        try {
            if (!cipherText) {
                return "-1";
            }

            // Add padding to the ciphertext
            cipherText = cipherText + "==";

            // Convert initialization vector and salt value to byte arrays
            const initVectorBytes = CryptoJS.enc.Utf8.parse(initVector);
            const saltValueBytes = CryptoJS.enc.Utf8.parse(saltValue);

            // Convert ciphertext from Base64 to byte array
            const cipherTextBytes = CryptoJS.enc.Base64.parse(cipherText);

            // Derive key from passPhrase, saltValue, hashAlgorithm, and passwordIterations
            const key = CryptoJS.PBKDF2(passPhrase, saltValueBytes, {
                keySize: keySize / 32,
                iterations: passwordIterations,
                hasher: CryptoJS.algo[hashAlgorithm.toUpperCase()]
            });

            // Decrypt using AES CBC mode
            const decrypted = CryptoJS.AES.decrypt(
                { ciphertext: cipherTextBytes },
                key,
                {
                    iv: initVectorBytes,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }
            );

            // Convert decrypted WordArray to UTF-8 string
            const plainText = decrypted.toString(CryptoJS.enc.Utf8);
            return plainText;
        } catch (error) {
            return "";
        }
    }


}
