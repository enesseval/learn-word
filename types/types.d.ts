export interface Languages {
   mainLang: string;
   learnLang: string;
}

export interface UserUnsafeMetadata {
   mainLang?: string;
   learnLang?: string;
}

export interface LanguageContextType {
   languages: Languages;
   updateLanguages: (newLanguages: Languages) => Promise<void>;
   loading: boolean;
}

export interface WordCardContextType {
   openWordCard: boolean;
   updateWordCardStat: (newVal: boolean) => void;
   word?: Word;
   settingWord: (word: Word) => void;
}

type Sentence = {
   mainLangSentence: string;
   learnLangSentence: string;
};

export type Word = {
   id: string;
   learnLangWord?: string;
   learnLangWordLowerCase?: string;
   mainLangTranslation?: string;
   showCount?: number;
   trueCount?: number;
   addedDate?: string;
   sentences?: Sentence[];
};
