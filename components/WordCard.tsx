"use client";

import { AiOutlineRight } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { IoMdClose, IoMdSync } from "react-icons/io";

import Loading from "./Loading";
import { cn } from "@/lib/utils";
import { Word } from "@/types/types";
import { Button } from "./ui/button";
import { useWordCard } from "@/context/WordCardContext";
import { useLanguage } from "@/context/LanguagesContext";
import { getRandomWordMainLang } from "@/googleAi/actions";
import { getCombinedWeightRandomWords } from "./helpers/randomWords";
import { getUserWords, updateShowCount, updateTrueCount } from "@/firebase/actions";

function WordCard() {
   const { languages } = useLanguage();
   const { updateWordCardStat } = useWordCard();
   const [loading, setLoading] = useState(true);
   const [wordCount, setWordCount] = useState(0);
   const [turnBack, setTurnBack] = useState(false);
   const [answers, setAnswers] = useState<string[][]>([]);
   const [answersClick, setAnswersClick] = useState(false);
   const [roundTrueCount, setRoundTrueCount] = useState(0);
   const [words, setWords] = useState<Word[] | undefined>([]);
   const [selectedWords, setSelectedWords] = useState<Word[]>([]);
   const [random, setRandom] = useState(Math.floor(Math.random() * 10));

   useEffect(() => {
      const fetchWords = async () => {
         try {
            setLoading(true);
            const fetchedWords = await getUserWords();
            const fetchedMainLangWords = await getRandomWordMainLang(languages);
            if (fetchedWords && fetchedMainLangWords) {
               setWords(fetchedWords);
               const selWords = getCombinedWeightRandomWords(fetchedWords);
               setSelectedWords(selWords);

               const newAnswers = selWords.map((word) => {
                  const mainLangTranslations = [];
                  const correctTranslationIndex = Math.floor(Math.random() * 4);
                  for (let i = 0; i < 3; i++) {
                     const randomIndex = Math.floor(Math.random() * fetchedMainLangWords.length);
                     mainLangTranslations.push(fetchedMainLangWords[randomIndex]);
                     fetchedMainLangWords.splice(randomIndex, 1);
                  }
                  mainLangTranslations.splice(correctTranslationIndex, 0, word.mainLangTranslation); // Doğru kelimeyi rastgele pozisyona ekle
                  return mainLangTranslations;
               });
               setAnswers(newAnswers);
            }
            setLoading(false); // Kelimeler yüklendiğinde loading durumunu false yap
         } catch (error) {
            console.error("Error fetching words:", error);
            setLoading(false); // Hata durumunda da loading durumunu false yap
         }
      };

      fetchWords();
   }, [languages]);

   useEffect(() => {
      if (selectedWords.length > 0) {
         const currentWord = selectedWords[wordCount];
         updateShowCount(currentWord.learnLangWord || "");
      }

      setRandom(Math.floor(Math.random() * 10)); // wordCount değiştiğinde random yenilenir
   }, [wordCount, selectedWords]);

   const checkAnswer = (word: string) => {
      setAnswersClick(true);
      if (word === selectedWords[wordCount].mainLangTranslation) {
         //doğru trueCount++
         setRoundTrueCount(roundTrueCount + 1);
         updateTrueCount(word);
      }
   };

   const nextWord = () => {
      if (wordCount !== (selectedWords.length === 10 ? 10 : selectedWords.length - 1)) {
         setAnswersClick(false);
         setWordCount(wordCount + 1);
      } else {
         setRoundTrueCount(0);
         updateWordCardStat(false);
      }
   };

   if (loading) {
      return (
         <div className="fixed inset-0">
            <Loading />
         </div>
      );
   }

   return (
      <div className="fixed inset-0 flex flex-col items-center justify-center mx-auto">
         <div className="w-11/12 md:w-8/12 lg:w-6/12 max-w-[500px] aspect-square [perspective:1000px]">
            <div className={cn("relative h-full w-full transition-all duration-500 [transform-style:preserve-3d]", turnBack && "[transform:rotateY(180deg)]")}>
               <div className="absolute inset-0 [backface-visibility:hidden] border-slate-300 border bg-slate-900  rounded-lg">
                  <div className="relative flex flex-col justify-center items-center">
                     <div>
                        <Button
                           variant={"outline"}
                           size={"icon"}
                           className="absolute right-12 top-2"
                           onClick={(e) => {
                              e.preventDefault();
                              setTurnBack(!turnBack);
                           }}
                        >
                           <IoMdSync />
                        </Button>
                        <Button onClick={() => updateWordCardStat(false)} variant={"outline"} size={"icon"} className="absolute right-2 top-2">
                           <IoMdClose />
                        </Button>
                     </div>
                     <h2 className="mt-8 text-2xl text-indigo-400">{selectedWords[wordCount]?.learnLangWord}</h2>
                     <p className="text-xl mt-10 text-center p-2">{selectedWords[wordCount]?.sentences?.[random].learnLangSentence}</p>
                     <div className="w-full grid grid-cols-2 gap-2 p-2 mt-14">
                        {answers[wordCount].map((word, index) => (
                           <Button
                              key={index}
                              variant={"outline"}
                              onClick={() => checkAnswer(word)}
                              className={cn(answersClick && `bg-${word === selectedWords[wordCount]?.mainLangTranslation ? "green" : "red"}-500`)}
                           >
                              {word}
                           </Button>
                        ))}
                     </div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                     <Button variant={"outline"} disabled={!answersClick} onClick={() => nextWord()}>
                        {wordCount !== (selectedWords.length >= 10 ? 10 : selectedWords.length - 1) ? (
                           <>
                              Sonraki kelime
                              <AiOutlineRight className="ml-2" />
                           </>
                        ) : (
                           <>Kapatmak için tıklayın</>
                        )}
                     </Button>
                  </div>
               </div>
               <div className="absolute inset-0 [backface-visibility:hidden] border-slate-300 border bg-slate-900  rounded-lg [transform:rotateY(180deg)]">
                  <div className="relative flex flex-col justify-center items-center">
                     <div>
                        <Button
                           variant={"outline"}
                           size={"icon"}
                           className="absolute right-12 top-2"
                           onClick={(e) => {
                              e.preventDefault();
                              setTurnBack(!turnBack);
                           }}
                        >
                           <IoMdSync />
                        </Button>
                        <Button onClick={() => updateWordCardStat(false)} variant={"outline"} size={"icon"} className="absolute right-2 top-2">
                           <IoMdClose />
                        </Button>
                     </div>
                     <h2 className="mt-10 text-2xl text-indigo-400">{selectedWords[wordCount].mainLangTranslation}</h2>
                     <p className="text-xl mt-20 text-center p-2">{selectedWords[0]?.sentences?.[random].mainLangSentence}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default WordCard;
