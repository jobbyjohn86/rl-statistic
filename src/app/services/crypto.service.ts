import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';

@Injectable({
    providedIn: 'root',
})
export class CryptoService {
    // private initVector: string = 'A1B2C3D4E5F6G7H8'; // Should be 16 bytes for AES
    // private saltValue: string = 'FusionRetail6';
    // private passPhrase: string = 'RanceLab';
    // private keySize: number = 128; // Key size in bits
    // private iterations: number = 1000; // Number of iterations

    private initVector: Uint8Array = new Uint8Array([/* your 16-byte IV here */]);
    private saltValue: Uint8Array = new Uint8Array([/* your salt bytes here */]);
    private passPhrase: string = 'your-passphrase';
    private keySize: number = 256; // Key size in bits
    private iterations: number = 1000; // Number of iterations


    constructor() { 
        this.initVector = this.stringToUint8Array('A1B2C3D4E5F6G7H8');
        this.saltValue = this.stringToUint8Array('FusionRetail6');
    }

    stringToUint8Array(str: string): Uint8Array {
        const utf8 = unescape(encodeURIComponent(str));
        const arr = new Uint8Array(utf8.length);
        for (let i = 0; i < utf8.length; i++) {
            arr[i] = utf8.charCodeAt(i);
        }
        return arr;
    }


    async decrypt(cipherText: string): Promise<string> {
        try {
            if (!cipherText) {
                console.error('Cipher text is empty');
                return '-1';
            }

            const cipherTextBytes = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));

            const key = await this.deriveKey(this.passPhrase, this.saltValue);
            const decryptedText = await this.decryptText(cipherTextBytes, key, this.initVector);

            return decryptedText;
        } catch (error) {
            console.error('Decryption failed:', error);
            return '';
        }
    }

    private async deriveKey(passPhrase: string, salt: Uint8Array): Promise<CryptoKey> {
        const encoder = new TextEncoder();
        const passphraseKey = await crypto.subtle.importKey(
            'raw',
            encoder.encode(passPhrase),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );

        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: this.iterations,
                hash: 'SHA-256',
            },
            passphraseKey,
            { name: 'AES-CBC', length: this.keySize },
            false,
            ['decrypt']
        );
    }

    private async decryptText(cipherText: Uint8Array, key: CryptoKey, iv: Uint8Array): Promise<string> {
        try {
            const decryptedArrayBuffer = await crypto.subtle.decrypt(
                {
                    name: 'AES-CBC',
                    iv: iv,
                },
                key,
                cipherText
            );

            const decoder = new TextDecoder();
            return decoder.decode(decryptedArrayBuffer);
        } catch (error) {
            console.error('Decryption error:', error);
            throw error;
        }
    }




}
