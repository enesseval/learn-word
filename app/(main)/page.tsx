"use client";

import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
   const t = useTranslations("HomePage");
   const { user } = useUser();

   useEffect(() => {
      console.log(user);
      if (user && !user.unsafeMetadata?.lang) redirect("/profile");
   }, [user]);

   return (
      <div>
         <Navbar />
         <div className="flex flex-col min-h-screen max-h-screen min-w-full bg-background">dwadwa</div>
      </div>
   );
}
