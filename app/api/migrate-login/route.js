import { NextResponse } from "next/server";
import { getAdminAuth, getDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req) {
  try {
    const adminAuth = getAdminAuth();
    const db = getDb();
    const { email, password } = await req.json();
    const sanitizedEmail = email.trim().toLowerCase();

    // 1. Check Firestore for the user record
    const snapshot = await db
      .collection("users")
      .where("email", "==", sanitizedEmail)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (userData.password !== password) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    let firebaseUser;

    try {
      firebaseUser = await adminAuth.getUserByEmail(sanitizedEmail);

      await adminAuth.updateUser(firebaseUser.uid, {
        password: password,
      });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        firebaseUser = await adminAuth.createUser({
          email: sanitizedEmail,
          password: password,
        });
      } else {
        throw error;
      }
    }

    // 5. Update Firestore: Remove plain-text password and mark as migrated
    await userDoc.ref.update({
      uid: firebaseUser.uid, // Fixed variable name
      password: FieldValue.delete(), // Uses admin SDK delete
      migratedToAuth: true,
      migrationDate: new Date(),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Migration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
