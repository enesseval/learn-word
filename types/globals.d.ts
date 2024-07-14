export {};

declare global {
   interface CustomJwtSessionClaims {
      mainLang?: string;
      learnLang?: string;
   }
}
