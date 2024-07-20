import { getUserId } from "@/firebase/actions";
import { connectApp } from "@/firebase/config";
import { Word } from "@/types/types";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/app/words/data-table";
import { Skeleton } from "./ui/skeleton";
import { columns } from "@/app/words/columns";

function Progress() {
   const [words, setWords] = useState<Word[]>([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const fetchRealTimeWords = async () => {
         const db = getFirestore(connectApp);

         try {
            setLoading(true);
            const userId = await getUserId();
            const unsubscribe = onSnapshot(collection(db, userId), (snapshot) => {
               const wordsArray: Word[] = snapshot.docs.map((doc) => {
                  const data = doc.data();
                  return {
                     learnLangWord: data.learnLangWord,
                     mainLangTranslation: data.mainLangTranslation,
                     showCount: data.showCount,
                     trueCount: data.trueCount,
                     addedDate: data.addedDate.toDate ? data.addedDate.toDate() : new Date(data.addedDate),
                     sentences: data.sentences,
                  };
               });
               setWords(wordsArray);
            });
            setLoading(false);
            return () => unsubscribe();
         } catch (error) {
            console.log("Error fetching words: ", error);
         }
      };
      fetchRealTimeWords();
   }, []);

   if (loading)
      return (
         <div className="flex flex-col space-y-3 mt-2">
            <Skeleton className="h-[30px] w-11/12 mx-auto rounded-xl" />
            <Skeleton className="h-[30px] w-11/12 mx-auto rounded-xl" />
            <Skeleton className="h-[30px] w-11/12 mx-auto rounded-xl" />
         </div>
      );

   return (
      <div className="flex w-full">
         <DataTable columns={columns} data={words} />
      </div>
   );
}

export default Progress;
