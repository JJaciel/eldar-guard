import { sign, decode } from "jsonwebtoken";
import { readFileSync } from "fs";

import { getAuthPrivateKeyPath, getAuthPassphrase } from "../util/envVars";

const privateKeyFilePath = getAuthPrivateKeyPath();
const passPhrase = getAuthPassphrase();

export function createToken(userId: string) {
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

export async function refreshTokenIfExpired(token: string) {
  try {
    const decoded = decode(token, { json: true });

    const exp = decoded?.exp;
    const userId: string = decoded?.userId;

    if (!userId || !exp) {
      throw new Error("No valid signature");
    }

    if (Date.now() <= exp * 1000) {
      throw new Error("Invalid token"); // token does not expires yet
    }

    const newToken = createToken(userId);

    return newToken;
  } catch (e) {
    console.log("e");
    console.log(e);
  }
}
