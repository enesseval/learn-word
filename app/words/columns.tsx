import { ColumnDef } from "@tanstack/react-table";
import { Word } from "../../types/types";
import { Button } from "@/components/ui/button";
import { FaArrowsAltV } from "react-icons/fa";
import { useTranslations } from "next-intl";

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

const LearnButton: React.FC<{ row: any }> = ({ row }) => {
   const t = useTranslations("table");
   return (
      <div className="flex justify-end">
         <Button variant="outline" className="p-2">
            {t("button")}
         </Button>
      </div>
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
      id: "button",
      cell: LearnButton,
   },
];
