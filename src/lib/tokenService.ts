import CryptoJS from 'crypto-js';
import Logger from '../utils/logger';
import { CONFIG } from '../utils/constants';


export class TokenService {

    private static readonly ACCESS_TOKEN_KEY = 'access_token';
    private static readonly SECRET_KEY: string = CONFIG.development.TOKEN_ENCRYPTION_KEY;

    getAccessToken(): string | null {
        const token = localStorage.getItem(TokenService.ACCESS_TOKEN_KEY);
        return this.decryptToken(token)
    }
    
    setAccessToken(token: string): void {
        localStorage.setItem(TokenService.ACCESS_TOKEN_KEY, this.encryptToken(token));
    }

    removeAccessToken(): void {
        localStorage.removeItem(TokenService.ACCESS_TOKEN_KEY);
    }

    encryptToken(token: string): string {
        return CryptoJS.AES.encrypt(token, TokenService.SECRET_KEY).toString();
    }

    decryptToken(token: string | null): string | null {
        if(!token)
            return null;
        try{
            const bytes = CryptoJS.AES.decrypt(token, TokenService.SECRET_KEY);
            return bytes.toString(CryptoJS.enc.Utf8);
        }catch(error: unknown){
            const errorMessage = error instanceof Error ? error.message : String(error);
            Logger.error("Token decryption failed: " + errorMessage);
            return null;
        }
    }
}