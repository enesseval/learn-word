"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Word } from "../../types/types";
import { Button } from "@/components/ui/button";
import { FaArrowsAltV } from "react-icons/fa";
import { useTranslations } from "next-intl";
import React from "react";
import { MdOutlineEdit } from "react-icons/md";
import { useRouter } from "next/navigation";

const WordHeader: React.FC<{ column: any }> = ({ column }) => {
   const t = useTranslations("table");
   return (
      <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
         {t("word")}
         <FaArrowsAltV className="ml-2 w-4 h-4" />
      </Button>
   );
};

const TranslationHeader: React.FC = () => {
   const t = useTranslations("table");
   return <>{t("translation")}</>;
};

const ShowCount: React.FC<{ column: any }> = ({ column }) => {
   const t = useTranslations("table");
   return <>{t("showCount")}</>;
};

const TrueCount: React.FC<{ column: any }> = ({ column }) => {
   const t = useTranslations("table");
   return <>{t("trueCount")}</>;
};

const EditWord: React.FC<{ row: any }> = ({ row }) => {
   const t = useTranslations("table");
   const router = useRouter();
   const data = row.original;
   return (
      <Button onClick={() => router.push(`/edit/${data.id}`)} variant={"ghost"}>
         {t("button")}
         <MdOutlineEdit className="w-4 h-4 ml-2" />
      </Button>
   );
};

export const columns: ColumnDef<Word>[] = [
   {
      id: "Word",
      accessorKey: "learnLangWord",
      header: WordHeader,
   },
   {
      id: "Translation",
      accessorKey: "mainLangTranslation",
      header: TranslationHeader,
   },
   {
      id: "Show Count",
      accessorKey: "showCount",
      header: ShowCount,
   },
   {
      id: "True Count",
      accessorKey: "trueCount",
      header: TrueCount,
   },
   {
      id: "actions",
      cell: EditWord,
   },
];
