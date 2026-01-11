import { ITokenSerializer } from "@/application/ports/serializer/ITokenSerializer";
import { ERRORS } from "@/types/constant/errors";
import { TokenEncrypted } from "@/types/encrypter";

export class AESSerializer implements ITokenSerializer<TokenEncrypted> {
  serialize(data: TokenEncrypted): string {
    const { cipherText, iv, tag } = data;
    const serializedToken = iv + ":" + cipherText + ":" + tag
    return serializedToken;
  }
  deserialize(data: string | null): TokenEncrypted {
    if (!data) {
      throw new Error(ERRORS.TOKEN_SERIALIZER_ERROR)
    }
    if (/^[^:]+:[^:]+:[^:]+$/.test(data) === false) {
      throw new Error(ERRORS.TOKEN_SERIALIZER_INVALID)
    }
    const [iv, cipher, tag] = data.split(":")
    return {
      cipherText: cipher,
      iv,
      tag
    }
  }

}