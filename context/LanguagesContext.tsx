"use client";

import { useUser } from "@clerk/nextjs";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

import { getLanguages } from "@/components/helpers/getLangs";
import { LanguageContextType, Languages } from "@/types/types";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const { user } = useUser();
   const [languages, setLanguages] = useState({ mainLang: "", learnLang: "" });
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchlang = async () => {
         const langs = await getLanguages();
         if (Object.keys(langs).length === 0) setLanguages({ mainLang: "", learnLang: "" });
         else {
            setLanguages(langs as Languages);
         }

         setLoading(false);
      };
      fetchlang();
   }, []);

   const updateLanguages = async (newLanguages: Languages) => {
      setLanguages(newLanguages);
      if (user) {
         const metadata: UserUnsafeMetadata = newLanguages as unknown as UserUnsafeMetadata;
         await user.update({
            unsafeMetadata: metadata,
         });
      }
   };

   return <LanguageContext.Provider value={{ languages, updateLanguages, loading }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
   const context = useContext(LanguageContext);
   if (context === undefined) {
      throw new Error("useLanguage must be used within a LanguageProvider");
   }
   return context;
};
