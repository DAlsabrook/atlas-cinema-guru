import { fetchFavorites } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * GET /api/favorites
 */
export const GET = auth(async (req: NextRequest) => {

  //@ts-ignore
  if (!req.auth) {
    return NextResponse.json(
      { error: "Unauthorized - Not logged in" },
      { status: 401 }
    );
  }

  const {
    user: { email }, //@ts-ignore
  } = req.auth;

  const favorites = await fetchFavorites(email);
  return NextResponse.json({ favorites });
});
