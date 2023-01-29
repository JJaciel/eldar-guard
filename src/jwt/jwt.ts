import { sign } from "jsonwebtoken";
import { readFileSync } from "fs";

export function createToken(userId: string) {
  const privateKeyFilePath = process.env.JWT_PRIVATE_KEY_PATH || "";
  const passPhrase = process.env.PASSPHRASE || "";

  const privateKey = readFileSync(privateKeyFilePath);
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // expires in 1 hour
  };
  const token = sign(
    payload,
    { key: privateKey, passphrase: passPhrase },
    { algorithm: "RS256" }
  );
  return token;
}
