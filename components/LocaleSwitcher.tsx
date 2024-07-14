"use client";
import { useLocale, useTranslations } from "next-intl";
import React, { useTransition } from "react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { GrLanguage } from "react-icons/gr";
import Flag from "react-flagkit";
import { Locale } from "@/config";
import { setUserLocale } from "@/services/locale";

function LocaleSwitcher() {
   const t = useTranslations("locale-switcher");
   const [isPending, startTransition] = useTransition();

   const locale = useLocale();

   const handleLocaleChange = (value: string) => {
      const locale = value as Locale;
      startTransition(() => setUserLocale(locale));
   };

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="outline" size={"icon"} className="focus-visible:ring-0">
               <GrLanguage className="w-4 h-4" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent className="w-24 md:w-56">
            <DropdownMenuCheckboxItem onCheckedChange={() => handleLocaleChange("tr")} checked={locale === "tr"}>
               <span className="hidden md:block">{t("tr")}</span>
               <Flag className="rounded ml-3" size={25} country="TR" />
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onCheckedChange={() => handleLocaleChange("en")} checked={locale === "en"}>
               <span className="hidden md:block">{t("en")}</span>
               <Flag className="rounded ml-3" size={25} country="US" />
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onCheckedChange={() => handleLocaleChange("de")} checked={locale === "de"}>
               <span className="hidden md:block">{t("de")}</span>
               <Flag className="rounded ml-3" size={25} country="DE" />
            </DropdownMenuCheckboxItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}

export default LocaleSwitcher;
