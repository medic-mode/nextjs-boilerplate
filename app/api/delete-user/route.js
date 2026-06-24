import { NextResponse } from "next/server";
import { getAdminAuth, getDb } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const adminAuth = getAdminAuth();
    const db = getDb();
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(token);

    if (decodedToken.email !== "admin@medicmode.com") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, authUid } = await req.json();

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
