// /app/api/product-click/route.js

import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import admin from "firebase-admin";

export async function GET(req) {
	const { searchParams } = new URL(req.url);

	const productId = searchParams.get("productId") || "first-aid-guide";
	const redirectUrl = "https://forms.gle/kEmADePUFCKKKkQGA";

	try {
		const productRef = db.collection("productClicks").doc(productId);

		await productRef.set(
			{
				productId,
				redirectUrl,
				clickedAt: admin.firestore.FieldValue.serverTimestamp(),
				count: admin.firestore.FieldValue.increment(1),
			},
			{ merge: true }
		);

		return NextResponse.redirect(redirectUrl);
	} catch (error) {
		console.error("Product click tracking failed:", error);
		return NextResponse.redirect(redirectUrl);
	}
}