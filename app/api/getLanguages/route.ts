import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
   const { sessionClaims } = auth();

   if (!sessionClaims) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

   const languages = sessionClaims?.languages || {};

   return NextResponse.json({ languages });
}
