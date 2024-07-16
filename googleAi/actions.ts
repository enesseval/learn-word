import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey: string = process.env.NEXT_PUBLIC_GENERATIVE_AI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

const getLanguages = async () => {
   try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseUrl}/api/getLanguages`);

      if (!response.ok) throw new Error("Failed to fetch user metadata");
      const data = await response.json();
      return data.languages;
   } catch (error) {
      console.error("Error fetching user metadata: ", error);
      return null;
   }
};

export async function isThisWordCorrect(word: string) {
   const languages = await getLanguages();
   console.log(languages);

   if (!languages) console.error("No languages found in user metadata");

   console.log("word: ", word);
   console.log("langs: ", languages);
}
