"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import LocaleSwitcher from "./LocaleSwitcher";
import { UserButton } from "@clerk/nextjs";

const DotIcon = () => {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
         <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
      </svg>
   );
};

const CustomPage = () => {
   return (
      <div>
         <h1>Custom Profile Page</h1>
         <p>This is the custom profile page</p>
         fgdsfdsdfe
      </div>
   );
};

function Navbar() {
   const t = useTranslations("navbar");
   return (
      <nav className="flex justify-between items-center border-b h-[60px] px-4 py-2">
         <Link href={"/"} className="font-bold text-2xl bg-gradient-to-r dark:from-cyan-400 dark:to-indigo-400 from-indigo-800 to-gray-600 text-transparent bg-clip-text hover:cursor-pointer">
            {t("logo")}
         </Link>
         <div className="flex gap-4 items-center">
            <LocaleSwitcher />
            <ThemeSwitcher />
            <UserButton userProfileMode="navigation" userProfileUrl="/profile" />
         </div>
      </nav>
   );
}

export default Navbar;
