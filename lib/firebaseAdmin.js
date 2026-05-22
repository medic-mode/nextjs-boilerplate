import admin from "firebase-admin";

function getFirebasePrivateKey() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim().replace(/^"|"$/g, "");

  if (!privateKey) {
    throw new Error("Missing FIREBASE_PRIVATE_KEY environment variable");
  }

  if (privateKey.includes("BEGIN PRIVATE KEY")) {
    return privateKey.replace(/\\n/g, "\n");
  }

  return Buffer.from(privateKey, "base64").toString("utf8").replace(/\\n/g, "\n");
}

function getFirebaseAdminApp() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId) {
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable");
  }

  if (!clientEmail) {
    throw new Error("Missing FIREBASE_CLIENT_EMAIL environment variable");
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: getFirebasePrivateKey(),
      }),
    });
  }

  return admin.app();
}

export function getAdminAuth() {
  return admin.auth(getFirebaseAdminApp());
}

export function getDb() {
  return admin.firestore(getFirebaseAdminApp());
}
