"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";

const FormSchema = z.object({
   mainLang: z.string({
      required_error: "Lütfen bir dil seçiniz.",
   }),
   learnLang: z.string({
      required_error: "Lütfen bir dil seçiniz.",
   }),
});

function User() {
   const t = useTranslations("user");
   const { user } = useUser();
   const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
   });

   async function onSubmit(data: z.infer<typeof FormSchema>) {
      user?.update({
         unsafeMetadata: {
            lang: data,
         },
      });
   }

   return (
      <div className="flex flex-col items-center justify-center mt-20">
         <h1 className="border-b p-2 px-5 text-center">Kelime Öğrenme uygulamasını kullanmak için ana dilinizi ve öğrendiğiniz dili aşağıdan seçiniz</h1>
         <div className="flex justify-center mt-10">
            <div className="border flex flex-col items-center space-y-5 p-5 rounded-lg">
               <Form {...form}>
                  <form className="space-y-6 flex flex-col items-center" onSubmit={form.handleSubmit(onSubmit)}>
                     <FormField
                        control={form.control}
                        name="mainLang"
                        render={({ field }) => (
                           <FormItem>
                              <Select required onValueChange={field.onChange} defaultValue={field.value}>
                                 <FormControl>
                                    <SelectTrigger className="w-[300px]">
                                       <SelectValue placeholder="Lütfen ana dilinizi seçiniz" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    <SelectGroup>
                                       <SelectItem value="tr">Türkçe</SelectItem>
                                       <SelectItem value="en">İngilizce</SelectItem>
                                       <SelectItem value="de">Almanca</SelectItem>
                                    </SelectGroup>
                                 </SelectContent>
                              </Select>
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="learnLang"
                        render={({ field }) => (
                           <FormItem>
                              <Select required onValueChange={field.onChange} defaultValue={field.value}>
                                 <FormControl>
                                    <SelectTrigger className="w-[300px]">
                                       <SelectValue placeholder="Lütfen öğrenmek istediğiniz dili seçiniz" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    <SelectGroup>
                                       <SelectItem value="tr">Türkçe</SelectItem>
                                       <SelectItem value="en">İngilizce</SelectItem>
                                       <SelectItem value="de">Almanca</SelectItem>
                                    </SelectGroup>
                                 </SelectContent>
                              </Select>
                           </FormItem>
                        )}
                     />

                     <Button type="submit" variant={"secondary"}>
                        Seçimleri Kaydet
                     </Button>
                  </form>
               </Form>
            </div>
         </div>
      </div>
   );
}

export default User;
