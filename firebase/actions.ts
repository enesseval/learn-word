"use server";

import { nanoid } from "nanoid";
import { currentUser } from "@clerk/nextjs/server";
import { getSentencesByWord, getTranslateWord } from "@/googleAi/actions";
import { addDoc, collection, getDocs, getFirestore, query, where, writeBatch, doc, updateDoc, getDoc } from "firebase/firestore";

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
      id: nanoid(10),
      learnLangWord: word,
      learnLangWordLowerCase: word.toLowerCase(),
      mainLangTranslation: mainLangTranslation?.toString() || "",
      addedDate: new Date().toISOString(),
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
}

export async function getUserWords() {
   const user = await currentUser();
   if (!user) throw new UserNotFoundErr();

   const snapShot = await getDocs(collection(db, user.id));
   const words: Word[] = snapShot.docs.map((doc) => {
      const data = doc.data();
      return {
         id: data.id,
         learnLangWord: data.learnLangWord,
         mainLangWord: data.mainLangWord,
         mainLangTranslation: data.mainLangTranslation,
         showCount: data.showCount,
         trueCount: data.trueCount,
         addedDate: data.addedDate,
         sentences: data.sentences,
      };
   });

   return words;
}

export async function getWordById(id: string) {
   const user = await currentUser();
   if (!user) throw new UserNotFoundErr();

   try {
      const q = query(collection(db, user.id), where("id", "==", id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
         const data = querySnapshot.docs[0].data();
         return data as Word;
      } else return { success: false, message: "Kelime bulunamadı" };
   } catch (error) {
      console.error("Something went wrong: ", error);
   }
}

export async function updateShowCount(word: string) {
   const user = await currentUser();
   if (!user) throw new UserNotFoundErr();

   try {
      const q = query(collection(db, user.id), where("learnLangWord", "==", word));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
         const docRef = querySnapshot.docs[0].ref;
         const currentShowCount = querySnapshot.docs[0].data().showCount || 0;

         await updateDoc(docRef, {
            showCount: currentShowCount + 1,
         });
         return { success: true, message: "ShowCount successfully updated." };
      } else {
         return { success: false, message: "Word not found in your list." };
      }
   } catch (error) {
      console.error("ShowCount güncellenirken hata oluştu: ", error);
   }
}

export async function updateTrueCount(word: string) {
   const user = await currentUser();
   if (!user) throw new UserNotFoundErr();

   try {
      const q = query(collection(db, user.id), where("mainLangTranslation", "==", word));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
         const docRef = querySnapshot.docs[0].ref;
         const currentTrueCount = querySnapshot.docs[0].data().trueCount || 0;
         await updateDoc(docRef, {
            trueCount: currentTrueCount + 1,
         });

         return { success: true, message: "True Count successfully updated." };
      } else {
         return { success: false, message: "Word not found in your list." };
      }
   } catch (error) {
      console.error("True count güncellenirken bir hata oluştu: ", error);
   }
}

export async function updateWord(word: Word) {
   const user = await currentUser();
   if (!user) throw new UserNotFoundErr();

   try {
      const q = query(collection(db, user.id), where("id", "==", word.id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
         const docRef = querySnapshot.docs[0].ref;
         await updateDoc(docRef, word);
         return { success: true, message: "Word succesfully updated." };
      } else {
         return { success: false, message: "Word not found in your list." };
      }
   } catch (error) {
      console.error("Kelime güncellenirken bir hata oluştu: ", error);
   }
}
