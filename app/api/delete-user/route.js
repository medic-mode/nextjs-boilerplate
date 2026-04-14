import { NextResponse } from "next/server";
import { adminAuth, db } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { userId, authUid } = await req.json();

    console.log(userId, authUid)

    // 1. Delete from Firebase Auth (if they have an authUid)
    if (authUid) {
      try {
        await adminAuth.deleteUser(authUid);
      } catch (authErr) {
        // If user doesn't exist in Auth, we continue to delete the Firestore doc
        console.warn("Auth user not found or already deleted:", authErr.message);
      }
    }

    // 2. Delete from Firestore
    await db.collection("users").doc(userId).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}