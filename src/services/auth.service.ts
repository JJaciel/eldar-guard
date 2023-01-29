import admin from "firebase-admin";

export function initializeFirebase() {
  const serviceAccountPath = process.env
    .GOOGLE_APPLICATION_CREDENTIALS as string;
  const credential = admin.credential.cert(serviceAccountPath);

  admin.initializeApp({
    credential,
  });
}
