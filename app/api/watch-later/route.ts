import { fetchWatchLaters } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * GET /api/titles
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

  const watchLater = await fetchWatchLaters(email);

  return NextResponse.json({ watchLater });
});
