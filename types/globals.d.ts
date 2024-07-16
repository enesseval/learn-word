export {};

export type Languages = {
   mainLang?: string | undefined;
   learnLang?: string | undefined;
};

declare global {
   interface CustomJwtSessionClaims {
      languages: {
         mainLang?: string | undefined;
         learnLang?: string | undefined;
      };
   }
}
