import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// TEMPORARY diagnostic route — added to pin down why /admin's role check was
// failing for a user whose Clerk publicMetadata.role is confirmed correct.
// Returns what the SERVER actually sees (JWT session claims) side-by-side
// with what a live API call to Clerk sees (currentUser), for any signed-in
// user, no role required. Delete this file once the root cause is found —
// it's not something that should stay live in production.
export async function GET() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const user = await currentUser();

  return NextResponse.json({
    userId,
    sessionClaims,
    liveMetadataFromCurrentUser: user?.publicMetadata,
  });
}
