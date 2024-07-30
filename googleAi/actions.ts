import { Languages } from "@/types/globals";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey: string = process.env.NEXT_PUBLIC_GENERATIVE_AI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

export async function isThisWordCorrect(word: string, languages: Languages, locale: string) {
   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

   const learnLang = languages.learnLang === "tr" ? "Turkish" : languages.learnLang === "en" ? "English" : "German";
   const localeLang = locale === "tr" ? "Turkish" : locale === "en" ? "English" : "German";

   const prompt = `'${word.toLowerCase()}' is the word in ${learnLang}? If it is ${learnLang}, return only true with nothing at the beginning or end. If the word is not ${learnLang}, return an error in ${localeLang} saying "Sorry, this word is not ${learnLang}".`;

   try {
      const result = await model.generateContent(prompt);
      const response = result.response.text().trim();
      return response;
   } catch (error) {
      console.log("isThisWordCorrect---Something went wrong: ", error);
   }
}

export async function getTranslateWord(word: string, languages: Languages) {
   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

   const mainLang = languages.mainLang === "tr" ? "Turkish" : languages.mainLang === "en" ? "English" : "German";

   const prompt = `Give the ${mainLang} translation of the word '${word}' provided in single quotes, and write only the translation with nothing at the beginning or end, without enclosing it in quotes or anything else.`;

   try {
      const result = await model.generateContent(prompt);
      const response = result.response.text().trim();
      return response;
   } catch (error) {
      console.log("getTranslateWords---Something went wrong: ", error);
   }
}

export async function getSentencesByWord(word: string, languages: Languages, locale: string) {
   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

   const mainLang = languages.mainLang === "tr" ? "Turkish" : languages.mainLang === "en" ? "English" : "German";
   const learnLang = languages.learnLang === "tr" ? "Turkish" : languages.learnLang === "en" ? "English" : "German";

   const prompt = `Use the word '${word}' provided in double quotes in 10 different sentences, and provide the ${mainLang} translation of these sentences. The output you give me should be in the following format, you don't need to highlight the words in the sentence, just write it plainly. Do not add anything to the beginning or end of the output, and do not include double quotes in the sentences or titles -> [{ "mainLangSentence": "${mainLang} sentence", "learnLangSentence": "${learnLang} translation" },]
`;

   try {
      const result = await model.generateContent(prompt);
      const res = result.response.text();
      return JSON.parse(res);
   } catch (error) {
      console.log("getSentencesWord---Something went wrong: ", error);
   }
}

export async function getRandomWordMainLang(languages: Languages) {
   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

   const mainLang = languages.mainLang === "tr" ? "Turkish" : languages.mainLang === "en" ? "English" : "German";

   const prompt = `Give me 35 random ${mainLang} words, they can be verbs, adverbs, or nouns like objects, etc. They should be in an array without any commands or anything else at the beginning or end.`;

   try {
      const result = await model.generateContent(prompt);
      const res = result.response.text();
      return JSON.parse(res);
   } catch (error) {
      console.log("getRandomWord---Something went wrong: ", error);
   }
}
