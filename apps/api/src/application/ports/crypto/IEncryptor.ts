import { TokenEncrypted } from "@/infrastructure/http/types/encrypter";

export interface IEncryptor {
  encrypt(token: string): TokenEncrypted;
  decrypt(ivB64: string, cipherText: string, tagB64: string): string;
}