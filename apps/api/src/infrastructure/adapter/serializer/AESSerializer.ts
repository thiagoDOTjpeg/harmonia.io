import { ITokenSerializer } from "@/application/ports/serializer/ITokenSerializer";
import { TokenEncrypted } from "@/types/encrypter";

export class AESSerializer implements ITokenSerializer<TokenEncrypted> {
  serialize(data: TokenEncrypted): string {
    const { cipherText, iv, tag } = data;
    const serializedToken = iv + ":" + cipherText + ":" + tag
    return serializedToken;
  }
  deserialize(data: string | null): TokenEncrypted {
    if (!data) {
      throw new Error("Erro ao deserializar o Token")
    }
    if (/^[^:]+:[^:]+:[^:]+$/.test(data) === false) {
      throw new Error("Token encriptado inválido")
    }
    const [iv, cipher, tag] = data.split(":")
    return {
      cipherText: cipher,
      iv,
      tag
    }
  }

}