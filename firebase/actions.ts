"use server";

import { currentUser } from "@clerk/nextjs/server";
import { getSentencesByWord, getTranslateWord } from "@/googleAi/actions";
import { addDoc, collection, getDocs, getFirestore, query, where, writeBatch, doc } from "firebase/firestore";

import { Word } from "@/types/types";
import { connectApp } from "./config";
import { Languages } from "@/types/globals";

class UserNotFoundErr extends Error {}

const db = getFirestore(connectApp);

export async function getUserId() {
   const user = await currentUser();
   if (!user) throw new UserNotFoundErr();

   return user.id;
}

export async function addWord(word: string, languages: Languages, locale: string) {
   const user = await currentUser();
   if (!user) throw new UserNotFoundErr();

   const q = query(collection(db, user.id), where("learnLangWordLowerCase", "==", word.toLowerCase()));
   const querySnapshot = await getDocs(q);
   let isExistDatabase;
   querySnapshot.forEach((doc) => (isExistDatabase = doc.data()));

   const userCollectionRef = collection(db, user.id);

   const mainLangTranslation = await getTranslateWord(word, languages);

   const sentences = await getSentencesByWord(word, languages, locale);

   const addedWord: Word = {
      learnLangWord: word,
      learnLangWordLowerCase: word.toLowerCase(),
      mainLangTranslation: mainLangTranslation?.toString() || "",
      addedDate: new Date(),
      showCount: 0,
      trueCount: 0,
      sentences,
   };
   if (isExistDatabase) {
      return { success: false, message: "This word already exists in your list" };
   } else {
      try {
         await addDoc(userCollectionRef, addedWord);
         return { success: true, message: "This word succesfully added." };
      } catch (error) {
         console.log("Error: ", error);
         return { succes: false, message: "An error occurred while adding the word." };
      }
   }
}

export async function deleteCollection() {
   const user = await currentUser();
   if (!user) throw new UserNotFoundErr();

   const userCollectionRef = collection(db, user.id);
   const querySnapshot = await getDocs(userCollectionRef);

   const batch = writeBatch(db);

   querySnapshot.forEach((document) => {
      batch.delete(doc(db, user.id, document.id));
   });

   await batch.commit();
   console.log("tablo silindi...");
}
