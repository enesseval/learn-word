"use client";

import { z } from "zod";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { deleteCollection } from "@/firebase/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/context/LanguagesContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
   const [isDialogOpen, setIsDialogOpen] = useState(false);

   const { languages, updateLanguages } = useLanguage();

   useEffect(() => {
      if (languages.mainLang) setSelectedMainLang(languages.mainLang);
   }, [languages.mainLang, languages, router]);

   const langueges = [
      { code: "tr", lang: t("locale-switcher.tr") },
      { code: "en", lang: t("locale-switcher.en") },
      { code: "de", lang: t("locale-switcher.de") },
   ];

   const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
         mainLang: languages.mainLang,
         learnLang: languages.learnLang,
      },
   });

   if (!isLoaded || !isSignedIn) return null;

   const handleChange = (value: string) => {
      setSelectedMainLang(value);
      form.setValue("mainLang", value);
   };

   const handleOpenDialog = () => {
      setIsDialogOpen(true);
   };

   const handleCloseDialog = () => {
      setIsDialogOpen(false);
   };

   async function onSubmit(data: z.infer<typeof FormSchema>) {
      deleteCollection();
      updateLanguages(data);
      router.push("/");
   }

   const handleConfirm = async () => {
      handleCloseDialog();
      await onSubmit(form.getValues());
   };

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
                     <form
                        onSubmit={(e) => {
                           e.preventDefault();
                           handleOpenDialog();
                        }}
                        className="space-y-6 p-5 flex flex-col justify-center"
                     >
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
                                 <Select disabled={selectedMainLang === ""} onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Button type="submit" variant={"secondary"} disabled={form.getValues().mainLang === languages.mainLang && form.getValues().learnLang === languages.learnLang}>
                           {t("profile.saveButton")}
                        </Button>
                     </form>
                  </Form>
               </div>
            </div>
         </div>
         <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>{t("profile.alertTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>{t("profile.alertDesc")}</AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel onClick={handleCloseDialog}>{t("profile.alertCancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirm}>{t("profile.alertConfirm")}</AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}

export default Profile;
