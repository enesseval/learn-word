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
}
