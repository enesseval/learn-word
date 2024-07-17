import { Languages } from "@/types/globals";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey: string = process.env.NEXT_PUBLIC_GENERATIVE_AI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

export async function isThisWordCorrect(word: string, languages: Languages, locale: string) {
   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

   const mainLang = languages.mainLang === "tr" ? "Türkçe" : languages.mainLang === "en" ? "İngilizce" : "Almanca";
   const learnLang = languages.learnLang === "tr" ? "Türkçe" : languages.learnLang === "en" ? "İngilizce" : "Almanca";
   const localeLang = locale === "tr" ? "Türkçe" : locale === "en" ? "İngilizce" : "Almanca";

   const prompt = `'${word}' tek tırnaklar içerisinde verdiğim kelime ${learnLang} mı ? eğer ${learnLang} ise sadece true olarak cevap döndür başında veya sonunda hiç bir şey olmasın, eğer kelime ${learnLang} değilse ${localeLang} "Üzgünüm bu kelime ${learnLang} değil" şeklinde bir hata döndür`;

   try {
      const result = await model.generateContent(prompt);
      const response = result.response.text().trim();
      return response;
   } catch (error) {
      console.log("Something went wrong: ", error);
   }
}

export async function getTranslateWord(word: string, languages: Languages) {
   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

   const mainLang = languages.mainLang === "tr" ? "Türkçe" : languages.learnLang === "en" ? "İngilizce" : "Almanca";

   const prompt = `'${word}' tek tırnaklar içinde verdiğim kelimenin ${mainLang} çevirisini ver sadece çeviriyi yaz başında yada sonunda herhangi birşey olmasın`;

   try {
      const result = await model.generateContent(prompt);
      const response = result.response.text().trim();
      return response;
   } catch (error) {
      console.log("Something went wrong: ", error);
   }
}

export async function getSentencesByWord(word: string, languages: Languages, locale: string) {
   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

   const mainLang = languages.mainLang === "tr" ? "Türkçe" : languages.mainLang === "en" ? "İngilizce" : "Almanca";
   const learnLang = languages.learnLang === "tr" ? "Türkçe" : languages.learnLang === "en" ? "İngilizce" : "Almanca";
   const localeLang = locale === "tr" ? "Türkçe" : locale === "en" ? "İngilizce" : "Almanca";

   const prompt = `'${word}' çift tırnaklar arasında verdiğim kelimeyi 10 tane farklı cümle içince kullanarak ver, ve bu cümlenin ${mainLang} çevirisini ver.bana vereceğin çıktı şu 
   formatta olmalı, kelimeleri cümle içinde özellikle belirtmen gerekmiyor dümdüz yaz. çıktının başına yada sonuna herhangi birşey 
   koyma -> [{ mainLangSentence:"${mainLang} cümle", learnLangSentence:"${learnLang} çevirisi" },]`;

   try {
      const result = await model.generateContent(prompt);
      const res = result.response.text();
      return JSON.parse(res);
   } catch (error) {
      console.log("Something went wrong: ", error);
   }
}
