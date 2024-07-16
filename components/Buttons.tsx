"use client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { HiPencil } from "react-icons/hi";
import { ImSpinner2 } from "react-icons/im";
import { FaBookOpen } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { isThisWordCorrect } from "@/googleAi/actions";

function Buttons() {
   const [word, setWord] = useState("");
   const [dialogOpen, setDialogOpen] = useState(false);
   const [loading, setLoading] = useState(false);

   const handleAddWord = async (word: string) => {
      isThisWordCorrect(word);
   };

   return (
      <div className="flex flex-row w-full my-2 px-2 gap-2">
         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
               <Button variant={"outline"} className="w-full text-white bg-gradient-to-r from-indigo-400 to-cyan-400 hover:border-white">
                  Kelime ekle
                  <HiPencil className="ml-2 w-4 h-4" />
               </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
               <DialogHeader>
                  <DialogTitle>Kelime ekle</DialogTitle>
               </DialogHeader>
               <Input placeholder="Eklemek istediğiniz kelimeyi yazınız." value={word} onChange={(e) => setWord(e.target.value)} />
               <Button className="mx-auto mt-2 w-1/2" type="submit" onClick={() => handleAddWord(word)}>
                  {loading && <ImSpinner2 className="ml-2 h-4 w-4 animate-spin" />}
                  {!loading && (
                     <>
                        Ekle
                        <IoMdAdd className="ml-2 h-4 w-4" />
                     </>
                  )}
               </Button>
            </DialogContent>
         </Dialog>
         <Button variant={"outline"} className="w-full text-white bg-gradient-to-r from-cyan-400 to-indigo-400 hover:border-white">
            Kelime öğren
            <FaBookOpen className="ml-2 w-4 h-4" />
         </Button>
      </div>
   );
}

export default Buttons;
