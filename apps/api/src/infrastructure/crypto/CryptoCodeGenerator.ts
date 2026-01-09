import { ICodeGenerator } from "@/application/ports/crypto/ICodeGenerator";
import { randomBytes, randomInt } from "node:crypto";

export class CryptoCodeGenerator implements ICodeGenerator {
  generateState(): string {
    const randomBuffer = randomBytes(32);
    return randomBuffer.toString("base64url");
  }
  generateResetPasswordCode(): string {
    const n = randomInt(0, 1000000);
    return n.toString().padStart(6, "0");
  }
}