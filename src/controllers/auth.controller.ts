import { Request, Response } from "express";
import { auth } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

const USERS_COLLECTION = "users";

import { createToken, refreshTokenIfExpired } from "../jwt/jwt";

const initializeUserDB = async ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  try {
    const db = getFirestore();
    await db.collection(USERS_COLLECTION).doc(userId).set({
      userId,
      email,
      createdAt: new Date().toISOString(),
    });
  } catch (e: any) {
    console.log("Error initializing User DB");
  }
};

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

    // email should be verified before create the dbUser
    const userId = userRecord.uid;
    const userEmail = userRecord.email as string;

    await initializeUserDB({ userId, email: userEmail });

    res.header("Authorization", `Bearer ${token}`);
    res.header("F-Token", `${customToken}`);
    res.json({
      user: {
        email: userEmail,
        isEmailVerified: userRecord.emailVerified,
        userId: userId,
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
    console.log(error);
    res.status(404).json({ error: "User not found" });
  }
}

export async function refreshTokenController(req: Request, res: Response) {
  const { authorization } = req.headers;

  const expiredToken = authorization?.split(" ")[1];
  if (!expiredToken) {
    return res.status(401).json({ error: "Token required" });
  }

  try {
    const token = await refreshTokenIfExpired(expiredToken);
    res.header("Authorization", `Bearer ${token}`).send();
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

export function resetPasswordController(req: Request, res: Response) {
  const { email } = req.body;
  const user = null;
  if (!user) {
    return res.status(404).json({ error: "Not implemented" });
  }
}
