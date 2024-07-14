"use client";

import { z } from "zod";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import Navbar from "@/components/Navbar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
   mainLang: z.string({
      required_error: "Lütfen bir dil seçiniz.",
   }),
   learnLang: z.string({
      required_error: "Lütfen bir dil seçiniz.",
   }),
});

function Profile() {
   const { isLoaded, isSignedIn, user } = useUser();
   const t = useTranslations();
   const router = useRouter();

   const [selectedMainLang, setSelectedMainLang] = useState("");

   const langueges = [
      { code: "tr", lang: t("locale-switcher.tr") },
      { code: "en", lang: t("locale-switcher.en") },
      { code: "de", lang: t("locale-switcher.de") },
   ];

   const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
   });

   if (!isLoaded || !isSignedIn) return null;

   const handleChange = (value: string) => {
      setSelectedMainLang(value);
      form.setValue("mainLang", value);
   };

   async function onSubmit(data: z.infer<typeof FormSchema>) {
      try {
         await user?.update({
            unsafeMetadata: {
               mainLang: data.mainLang,
               learnLang: data.learnLang,
            },
         });
         toast({
            title: "Success",
            description: `Seçimleriniz başarıyla kaydedildi`,
         });
         router.push("/");
      } catch (error) {
         toast({
            title: "Error",
            variant: "destructive",
            description: `${t("error.error")}: ${error}`,
         });
      }
   }

   return (
      <>
         <Navbar />
         <div className="w-10/12 mx-auto mt-5">
            <div className="flex flex-col items-center justify-center space-y-5">
               <Avatar className="w-36 h-36">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>{user?.firstName}</AvatarFallback>
               </Avatar>
               <Label className="text-2xl font-bold text-cyan-500">{user?.fullName}</Label>
               <Label className="text-xl font-bold text-cyan-600">{user?.emailAddresses[0].emailAddress}</Label>
               <h1>{t("profile.title")}</h1>
               <div className="border rounded-lg">
                  <Form {...form}>
                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-5 flex flex-col justify-center">
                        <FormField
                           control={form.control}
                           name="mainLang"
                           render={({ field, fieldState }) => (
                              <FormItem>
                                 <Select onValueChange={handleChange} defaultValue={field.value}>
                                    <FormControl>
                                       <SelectTrigger className={cn("w-[350px]", fieldState.error && "border-red-500")}>
                                          <SelectValue placeholder={t("profile.selectMainLang")} />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       <SelectGroup>
                                          {langueges.map((lang) => (
                                             <SelectItem key={lang.code} value={lang.code}>
                                                {lang.lang}
                                             </SelectItem>
                                          ))}
                                       </SelectGroup>
                                    </SelectContent>
                                 </Select>
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="learnLang"
                           render={({ field, fieldState }) => (
                              <FormItem>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                       <SelectTrigger className={cn("w-[350px]", fieldState.error && "border-red-500")}>
                                          <SelectValue placeholder={t("profile.selectLearnLang")} />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       <SelectGroup>
                                          {langueges.map((lang) => (
                                             <div key={lang.code}>{selectedMainLang !== lang.code ? <SelectItem value={lang.code}>{lang.lang}</SelectItem> : ""}</div>
                                          ))}
                                       </SelectGroup>
                                    </SelectContent>
                                 </Select>
                              </FormItem>
                           )}
                        />
                        <Button type="submit" variant={"secondary"}>
                           {t("profile.saveButton")}
                        </Button>
                     </form>
                  </Form>
               </div>
            </div>
         </div>
      </>
   );
}

export default Profile;
