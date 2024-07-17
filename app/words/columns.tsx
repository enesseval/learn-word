import { ColumnDef } from "@tanstack/react-table";
import { Word } from "../../types/types";

export const columns: ColumnDef<Word>[] = [
   { accessorKey: "learnLangWord", header: "Kelime" },
   { accessorKey: "showCount", header: "Gösterim Sayısı" },
   { accessorKey: "trueCount", header: "Doğru Sayısı" },

   {
      accessorKey: "addedDate",
      header: "Ekleme Tarihi",
      cell: ({ row }) => {
         const date = row.getValue<Date>("addedDate");
         const formatted = new Intl.DateTimeFormat("tr-TR", {
            dateStyle: "long",
            timeStyle: "short",
         }).format(date);
         return <div className="">{formatted}</div>;
      },
   },
];
