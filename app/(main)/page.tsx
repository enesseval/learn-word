"use client";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import Loading from "@/components/Loading";
import { useEffect } from "react";
import { useLanguage } from "@/context/LanguagesContext";
import Progress from "@/components/Progress";
import Buttons from "@/components/Buttons";
import { useWordCard } from "@/context/WordCardContext";
import { cn } from "@/lib/utils";
import WordCard from "@/components/WordCard";

export default function Home() {
   const { user } = useUser();

   const { languages, loading } = useLanguage();
   const { openWordCard } = useWordCard();

   useEffect(() => {
      if (user && (languages.mainLang === "" || languages.learnLang === "")) redirect("/profile");
   }, [user, languages]);

   if (loading) {
      return <Loading />;
   }

   return (
      <div>
         <div className="relative">
            <Navbar />
            <div className={cn("flex flex-col min-h-screen max-h-screen min-w-full bg-background", openWordCard && "blur-sm transition-all ease-in-out duration-300 pointer-events-none")}>
               <Buttons />
               <Progress />
            </div>
            {openWordCard && <WordCard />}
         </div>
      </div>
   );
}
