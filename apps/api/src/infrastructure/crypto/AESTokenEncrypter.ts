import { IEncryptor } from "@/application/ports/crypto/IEncryptor";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { TokenEncrypted } from "../http/types/encrypter";

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 12;

export class AESTokenEncrypter implements IEncryptor {
  constructor(private encryptionKey: string) {
    if (Buffer.byteLength(encryptionKey, "utf-8") !== 32) {
      throw new Error("Key de encriptação inválida")
    }
  }
  encrypt(token: string): TokenEncrypted {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, this.encryptionKey, iv);
    const data = cipher.update(token, 'utf-8', "base64");
    const final = cipher.final('base64')
    return {
      cipherText: `${data}${final}`,
      iv: iv.toString("base64"),
      tag: cipher.getAuthTag().toString("base64")
    }
  }
  decrypt(ivB64: string, encryptedB64: string, tagB64: string): string {
    try {
      const decipher = createDecipheriv(ALGORITHM, this.encryptionKey, Buffer.from(ivB64, "base64"))
      decipher.setAuthTag(Buffer.from(tagB64, "base64"))

      let decrypted = decipher.update(encryptedB64, "base64", "utf8");
      decrypted += decipher.final("utf-8")

      return decrypted;
    } catch (error) {
      throw new Error("Erro ao decriptar os tokens de acesso", { cause: error })
    }
  }
}
