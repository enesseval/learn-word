"use client";

import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { HiPencil } from "react-icons/hi";
import { ImSpinner2 } from "react-icons/im";
import { FaBookOpen } from "react-icons/fa";

import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useLocale, useTranslations } from "next-intl";
import { useToast } from "./ui/use-toast";
import { addWord } from "@/firebase/actions";
import { isThisWordCorrect } from "@/googleAi/actions";
import { useLanguage } from "@/context/LanguagesContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

function Buttons() {
   const locale = useLocale();
   const t = useTranslations();
   const { toast } = useToast();
   const { languages } = useLanguage();
   const [word, setWord] = useState("");
   const [addBtn, setAddBtn] = useState(false);
   const [btnValue, setBtnValue] = useState("");
   const [loading, setLoading] = useState(false);
   const [dialogOpen, setDialogOpen] = useState(false);

   const addWordHandle = async () => {
      setLoading(true);
      const result = await isThisWordCorrect(word, languages, locale);
      if (result === "true") {
         const addWordDatabase = await addWord(word, languages, locale);
         if (addWordDatabase.success) {
            toast({
               title: "Success",
               description: addWordDatabase.message,
            });
         } else {
            toast({
               title: "Error",
               description: addWordDatabase.message,
               variant: "destructive",
            });
         }
         setWord("");
         setLoading(false);
         setDialogOpen(false);
      } else {
         setAddBtn(true);
         setLoading(false);
         setBtnValue(result?.toString() || "");
      }
   };

   return (
      <div className="flex flex-row w-10/12 md:w-9/12 lg:w-6/12 mx-auto my-5 px-2 gap-2">
         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
               <Button variant={"outline"} className="w-full text-white bg-gradient-to-r from-indigo-400 to-cyan-400 hover:border-white">
                  {t("buttons.addWord")}
                  <HiPencil className="ml-2 w-4 h-4" />
               </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
               <DialogHeader>
                  <DialogTitle>{t("buttons.addWord")}</DialogTitle>
               </DialogHeader>
               <Input
                  placeholder={t("buttons.inputPlaceholder")}
                  className="h-8"
                  value={word}
                  onChange={(e) => {
                     setWord(e.target.value);
                     setAddBtn(false);
                     setBtnValue("");
                  }}
               />
               <Label className={cn("text-red-500 w-full text-center", btnValue === "" && "hidden")}>{btnValue}</Label>
               <Button disabled={word === "" || addBtn} className="mx-auto mt-2 w-1/2" type="submit" onClick={() => addWordHandle()}>
                  {loading && <ImSpinner2 className="ml-2 h-4 w-4 animate-spin" />}
                  {!loading && (
                     <>
                        {t("buttons.add")}
                        <IoMdAdd className="ml-2 h-4 w-4" />
                     </>
                  )}
               </Button>
            </DialogContent>
         </Dialog>
         <Button variant={"outline"} className="w-full text-white bg-gradient-to-r from-cyan-400 to-indigo-400 hover:border-white">
            {t("buttons.learnWord")}
            <FaBookOpen className="ml-2 w-4 h-4" />
         </Button>
      </div>
   );
}

export default Buttons;
