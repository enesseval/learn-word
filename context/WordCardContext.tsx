"use client";
import { Word, WordCardContextType } from "@/types/types";
import { createContext, ReactNode, useContext, useState } from "react";

export const WordCardContext = createContext<WordCardContextType | undefined>(undefined);

export const WordCardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [openWordCard, setOpenWordCard] = useState(false);
   const [word, setWord] = useState<Word>();

   const updateWordCardStat = (newVal: boolean) => setOpenWordCard(newVal);

   const settingWord = (word: Word) => setWord(word);

   return <WordCardContext.Provider value={{ openWordCard, updateWordCardStat, word, settingWord }}>{children}</WordCardContext.Provider>;
};

export const useWordCard = (): WordCardContextType => {
   const context = useContext(WordCardContext);
   if (context === undefined) throw new Error("Something went wrong");
   return context;
};
