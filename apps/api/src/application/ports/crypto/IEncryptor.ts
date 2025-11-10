import { TokenEncrypted } from "@/infrastructure/http/types/encrypter";

export interface IEncryptor {
  encrypt(token: string): TokenEncrypted;
  decrypt(ivB64: string, encryptedB64: string, tagB64: string): string;
}