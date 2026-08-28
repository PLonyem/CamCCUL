import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { affiliates as mockAffiliates } from "@/lib/mock-data";

const CHAPTER_BY_REGION: Record<string, string> = {
  ADAMAWA: "Adamawa Chapter",
  CENTRE: "Centre Chapter",
  EAST: "East Chapter",
  "FAR NORTH": "Far North Chapter",
  LITTORAL: "Littoral Chapter",
  NORTH: "North Chapter",
  NORTHWEST: "Northwest Chapter",
  SOUTH: "South Chapter",
  SOUTHWEST: "Southwest Chapter",
  WEST: "West Chapter",
};

function chapterName(chapter: string | null | undefined, region: string) {
  return chapter || CHAPTER_BY_REGION[region.toUpperCase()] || `${region} Chapter`;
}

// Public directory endpoint — no auth. Profile content (history, contact
// details, leadership, services) is only included once profileStatus is
// "approved"; unapproved submissions never leave the server, not just
// hidden client-side, since a rejected draft could contain content the
// chapter doesn't want public yet.
export async function GET() {
  try {
    const affiliates = await prisma.affiliate.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        code: true,
        name: true,
        region: true,
        chapter: true,
        city: true,
        address: true,
        phone: true,
        email: true,
        yearEstablished: true,
        briefHistory: true,
        totalMembers: true,
        branchCount: true,
        services: true,
        chapterPresident: true,
        chapterSupervisor: true,
        boardSize: true,
        staffCount: true,
        profileStatus: true,
        profileUpdatedAt: true,
      },
    });

    const publicAffiliates = affiliates.map((a) => {
      const isApproved = a.profileStatus === "approved";
      return {
        id: a.id,
        code: a.code,
        name: a.name,
        region: a.region,
        chapter: chapterName(a.chapter, a.region),
        city: a.city,
        // profileStatus defaults to "pending" in the DB for every
        // affiliate, submitted or not — profileUpdatedAt (null until a
        // chapter actually submits) is the real "has submission" signal,
        // same one the admin review queue and the credit union's own
        // dashboard already use. Exposed so the client can tell "genuinely
        // pending review" apart from "never submitted".
        profileStatus: a.profileStatus,
        hasSubmittedProfile: a.profileUpdatedAt !== null,
        address: isApproved ? a.address : null,
        phone: isApproved ? a.phone : null,
        email: isApproved ? a.email : null,
        yearEstablished: isApproved ? a.yearEstablished : null,
        briefHistory: isApproved ? a.briefHistory : null,
        totalMembers: isApproved ? a.totalMembers : null,
        branchCount: isApproved ? a.branchCount : null,
        services: isApproved ? a.services : [],
        chapterPresident: isApproved ? a.chapterPresident : null,
        chapterSupervisor: isApproved ? a.chapterSupervisor : null,
        boardSize: isApproved ? a.boardSize : null,
        staffCount: isApproved ? a.staffCount : null,
      };
    });

    return NextResponse.json({ affiliates: publicAffiliates, source: "database" });
  } catch (error) {
    console.error(
      "Database unavailable, falling back to mock affiliate data:",
      error
    );
    const fallback = mockAffiliates
      .filter((a) => a.isActive)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((a) => ({
        id: a.id,
        code: a.code,
        name: a.name,
        region: a.region,
        chapter: chapterName(null, a.region),
        city: a.city,
        profileStatus: null,
        hasSubmittedProfile: false,
        address: null,
        phone: null,
        email: null,
        yearEstablished: null,
        briefHistory: null,
        totalMembers: null,
        branchCount: null,
        services: [] as string[],
        chapterPresident: null,
        chapterSupervisor: null,
        boardSize: null,
        staffCount: null,
      }));
    return NextResponse.json({ affiliates: fallback, source: "fallback" });
  }
}
