import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface DataTablePaginationProps<TData> {
   table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
   const t = useTranslations("table");
   return (
      <div className="flex items-center justify-center mt-5 px-2 w-10/12 mx-auto">
         <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
               <p className="text-sm font-medium">{t("rowsPerPage")}</p>
               <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                     table.setPageSize(Number(value));
                  }}
               >
                  <SelectTrigger className="h-8 w-[70px]">
                     <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                     {[10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                           {pageSize}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
               {t("page")} {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
               <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                  <span className="sr-only">{t("goFirst")}</span>
                  <DoubleArrowLeftIcon className="h-4 w-4" />
               </Button>
               <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                  <span className="sr-only">{t("goPrevious")}</span>
                  <ChevronLeftIcon className="h-4 w-4" />
               </Button>
               <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  <span className="sr-only">{t("goNext")}</span>
                  <ChevronRightIcon className="h-4 w-4" />
               </Button>
               <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                  <span className="sr-only">{t("goLast")}</span>
                  <DoubleArrowRightIcon className="h-4 w-4" />
               </Button>
            </div>
         </div>
      </div>
   );
}
