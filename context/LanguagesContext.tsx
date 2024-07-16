"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { LanguageContextType, Languages } from "@/types/types";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const { user } = useUser();
   const [languages, setLanguages] = useState<Languages>({ mainLang: "tr", learnLang: "en" });

   const updateLanguages = async (newLanguages: Languages) => {
      setLanguages(newLanguages);
      if (user) {
         const metadata: UserUnsafeMetadata = newLanguages as unknown as UserUnsafeMetadata;
         await user.update({
            unsafeMetadata: metadata,
         });
      }
   };

   return <LanguageContext.Provider value={{ languages, updateLanguages }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
   const context = useContext(LanguageContext);
   if (context === undefined) {
      throw new Error("useLanguage must be used within a LanguageProvider");
   }
   return context;
};
