"use server";
import { auth } from "@clerk/nextjs/server";

export async function getLanguages() {
   const { sessionClaims } = auth();
   const languages = sessionClaims?.languages || {};
   return languages;
}
