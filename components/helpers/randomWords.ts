import { Word } from "@/types/types";

export const getCombinedWeightRandomWords = (words: Word[]) => {
   const calculateWeights = (words: Word[]) => {
      return words.map((word) => {
         const showCount = word.showCount ?? 0;
         const trueCount = word.trueCount ?? 0;
         let weight;
         if (showCount === trueCount) weight = 0.01;
         else {
            const accuracy = showCount === 0 ? 0 : trueCount / showCount;
            const inverseShowCount = 1 / (showCount + 1);
            weight = (1 - accuracy) * inverseShowCount;
         }
         return { ...word, weight };
      });
   };

   let weights = calculateWeights(words);
   let totalWeight = weights.reduce((acc, word) => acc + word.weight, 0);
   const selectedWords: Word[] = [];

   while (selectedWords.length < 10 && weights.length > 0) {
      if (totalWeight === 0) {
         // Eğer tüm ağırlıklar sıfırsa, kalan kelimelerden rastgele seç
         const remainingWords = weights.slice(0, 10 - selectedWords.length);
         selectedWords.push(...remainingWords);
         break;
      }

      const random = Math.random() * totalWeight;
      let sum = 0;
      for (let i = 0; i < weights.length; i++) {
         sum += weights[i].weight;
         if (random <= sum) {
            selectedWords.push(weights[i]);
            totalWeight -= weights[i].weight; // totalWeight'i güncelle
            weights.splice(i, 1); // Seçilen kelimeyi çıkar
            break;
         }
      }
   }
   return selectedWords;
};
