import { Request, Response } from "express";
import { auth } from "firebase-admin";

import { createToken } from "../jwt/jwt";

export async function signupController(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const userRecord = await auth().createUser({
      email,
      password,
    });
    const customToken = await auth().createCustomToken(userRecord.uid);
    const token = createToken(userRecord.uid);

    res.header("Authorization", `Bearer ${token}`);
    res.header("F-Token", `${customToken}`);
    res.json({
      user: {
        email: userRecord.email,
        isEmailVerified: userRecord.emailVerified,
        userId: userRecord.uid,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function signinController(req: Request, res: Response) {
  try {
    const { idToken } = req.body;

    // alternatively the token can be verified using jwt https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_a_third-party_jwt_library
    const decodedIdToken = await auth().verifyIdToken(idToken);
    const userRecord = await auth().getUser(decodedIdToken.uid);
    const token = createToken(userRecord.uid);

    res.header("Authorization", `Bearer ${token}`);
    res.json({
      user: {
        email: userRecord.email,
        isEmailVerified: userRecord.emailVerified,
        userId: userRecord.uid,
      },
    });
  } catch (error) {
    res.status(404).json({ error: "User not found" });
  }
}

// refresh token?
export function refreshTokenController(req: Request, res: Response) {
  const { token } = req.body;

  try {
    res.json({ newToken: "any-token" });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function resetPasswordController(req: Request, res: Response) {
  const { email } = req.body;
  const user = null;
  if (!user) {
    return res.status(404).json({ error: "Email not found" });
  }
}