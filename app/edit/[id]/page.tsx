"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Word } from "@/types/types";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getWordById, updateWord } from "@/firebase/actions";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTranslations } from "next-intl";

function Edit() {
   const router = useRouter();
   const { id } = useParams();
   const t = useTranslations("editWord");
   const [errors, setErrors] = useState<any>({});
   const [loading, setLoading] = useState(false);
   const [selectedSentence, setSelectedSentence] = useState(0);
   const [word, setWord] = useState<Word | undefined>(undefined);

   useEffect(() => {
      const fetchWord = async () => {
         setLoading(true);
         const word = await getWordById(id.toString());
         setWord(word as Word);
         setLoading(false);
      };
      fetchWord();
   }, [id]);

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;

      if (name.startsWith("sentence-")) {
         const [_, field] = name.split("-");
         setWord((prevWord) => {
            if (!prevWord || !prevWord.sentences) return prevWord;
            const updatedSentences = [...prevWord.sentences];
            updatedSentences[selectedSentence] = {
               ...updatedSentences[selectedSentence],
               [field]: value,
            };
            return {
               ...prevWord,
               sentences: updatedSentences,
            };
         });
      } else {
         setWord(
            (prevWord) =>
               ({
                  ...prevWord,
                  [name]: value,
               } as Word)
         );
      }
   };

   const handleSubmit = async () => {
      const newErrors: any = {};

      if (!word?.learnLangWord || word.learnLangWord.trim() === "") newErrors.learnLangWord = true;
      if (!word?.mainLangTranslation || word.mainLangTranslation.trim() === "") newErrors.mainLangTranslation = true;
      word?.sentences?.forEach((sentence, index) => {
         if (!sentence.learnLangSentence || sentence.learnLangSentence.trim() === "") newErrors[`sentence-learnLangSentence-${index}`] = true;
         if (!sentence.mainLangSentence || sentence.mainLangSentence.trim() === "") newErrors[`sentence-mainLangSentence-${index}`] = true;
      });

      setErrors(newErrors);
      await updateWord(word as Word);
      router.push("/");
   };

   if (loading) return <Loading />;

   return (
      <>
         <Navbar />
         <div className="w-full mx-auto flex flex-col items-center justify-center mt-5 space-y-5 p-3">
            <div className="flex flex-col md:flex-row justify-start w-full max-w-[450px]">
               <h2 className="text-2xl font-bold mr-5 mt-1 min-w-[150px]">{t("word")}:</h2>
               <Input style={{ borderColor: errors.learnLangWord ? "red" : "inherit" }} name="learnLangWord" value={word?.learnLangWord} onChange={handleChange} />
            </div>
            <div className="flex flex-col md:flex-row justify-start w-full max-w-[450px]">
               <h2 className="text-2xl font-bold mr-5 mt-1 min-w-[150px]">{t("translate")}:</h2>
               <Input style={{ borderColor: errors.mainLangWord ? "red" : "inherit" }} name="mainLangTranslation" value={word?.mainLangTranslation} onChange={handleChange} />
            </div>
            <ToggleGroup type="single" variant={"outline"} defaultValue={selectedSentence.toString()}>
               {word?.sentences?.map((_, index) => (
                  <ToggleGroupItem
                     style={{ borderColor: errors[`sentence-learnLangSentence-${index}`] || errors[`sentence-mainLangSentence-${index}`] ? "red" : "inherit" }}
                     onClick={() => setSelectedSentence(index)}
                     value={index.toString()}
                     key={index}
                  >
                     {index + 1}
                  </ToggleGroupItem>
               ))}
            </ToggleGroup>
            <div className="flex flex-col md:flex-row w-full max-w-[700px]">
               <h2 className="text-xl mr-5 mt-1 min-w-[170px] text-center">{t("learnLangSentence")}:</h2>
               <Input
                  style={{ borderColor: errors[`sentence-learnLangSentence-${selectedSentence}`] ? "red" : "inherit" }}
                  name="sentence-learnLangSentence"
                  value={word?.sentences?.[selectedSentence].learnLangSentence}
                  onChange={handleChange}
               />
            </div>
            <div className="flex flex-col md:flex-row w-full max-w-[700px]">
               <h2 className="text-xl mr-5 mt-1 min-w-[170px] text-center">{t("mainLangSentence")}:</h2>
               <Input
                  style={{ borderColor: errors[`sentence-mainLangSentence-${selectedSentence}`] ? "red" : "inherit" }}
                  name="sentence-mainLangSentence"
                  value={word?.sentences?.[selectedSentence].mainLangSentence}
                  onChange={handleChange}
               />
            </div>
         </div>
         <div className="flex items-center justify-center mt-5">
            <Button onClick={() => handleSubmit()} variant={"outline"}>
               {t("button")}
            </Button>
         </div>
      </>
   );
}

export default Edit;
