"use client";

import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
   const t = useTranslations("HomePage");
   const { user } = useUser();

   useEffect(() => {
      if (user && !user.unsafeMetadata?.lang) redirect("/user");
   }, [user]);

   return <div className="flex flex-col min-h-screen max-h-screen min-w-full bg-background">a</div>;
}
