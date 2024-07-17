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

type Sentence = {
   mainLangSentence: string;
   learnLangSentence: string;
};

export type Word = {
   learnLangWord?: string;
   mainLangTranslation?: string;
   showCount?: number;
   trueCount?: number;
   addedDate?: Date;
   sentences?: Sentence[];
};
