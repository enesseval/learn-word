import { UserButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import LocaleSwitcher from "./LocaleSwitcher";

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
            <UserButton />
         </div>
      </nav>
   );
}

export default Navbar;
