import { IEncryptor } from "@/application/ports/crypto/IEncryptor";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { TokenEncrypted } from "../../types/encrypter";

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 12;

export class AESTokenEncrypter implements IEncryptor {
  constructor(private encryptionKey: string) {
    if (Buffer.byteLength(encryptionKey, "base64") !== 32) {
      throw new Error("Key de encriptação inválida")
    }
  }
  public encrypt(token: string): TokenEncrypted {
    const keyInBytes = Buffer.from(this.encryptionKey, "base64");
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, keyInBytes, iv);
    const data = cipher.update(token, 'utf-8', "base64");
    const final = cipher.final("base64")

    return {
      cipherText: `${data}${final}`,
      iv: iv.toString("base64"),
      tag: cipher.getAuthTag().toString("base64")
    }
  }
  public decrypt(ivB64: string, cipherText: string, tagB64: string): string {
    try {
      const bufferKey = Buffer.from(this.encryptionKey, "base64");
      const bufferIv = Buffer.from(ivB64, "base64")
      const bufferTag = Buffer.from(tagB64, "base64")

      const decipher = createDecipheriv(ALGORITHM, bufferKey, bufferIv)
      decipher.setAuthTag(bufferTag)

      let decrypted = decipher.update(cipherText, "base64", "utf-8");
      decrypted += decipher.final("utf-8")

      return decrypted;
    } catch (error) {
      throw new Error("Erro ao decriptar os tokens de acesso", { cause: error })
    }
  }
}
