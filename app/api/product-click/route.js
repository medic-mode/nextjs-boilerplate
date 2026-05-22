import { getDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req) {
	const { searchParams } = new URL(req.url);

	const productId = searchParams.get("productId") || "first-aid-guide";
	const redirectUrl = "https://forms.gle/kEmADePUFCKKKkQGA";

	try {
		const db = getDb();
		const productRef = db.collection("productClicks").doc(productId);

		await productRef.set(
			{
				productId,
				redirectUrl,
				clickedAt: FieldValue.serverTimestamp(),
				count: FieldValue.increment(1),
			},
			{ merge: true }
		);

		return NextResponse.redirect(redirectUrl);
	} catch (error) {
		console.error("Product click tracking failed:", error);
		return NextResponse.redirect(redirectUrl);
	}
}
