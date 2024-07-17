"use client";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Buttons from "@/components/Buttons";
import { redirect } from "next/navigation";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguagesContext";

export default function Home() {
   const { user } = useUser();

   const { languages, loading } = useLanguage();

   useEffect(() => {
      if (user && (languages.mainLang === "" || languages.learnLang === "")) redirect("/profile");
   }, [user, languages]);

   if (loading) {
      return <Loading />;
   }

   return (
      <div>
         <Navbar />
         <div className="flex flex-col min-h-screen max-h-screen min-w-full bg-background">
            <Buttons />
         </div>
      </div>
   );
}
