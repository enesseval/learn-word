import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/context/LanguagesContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
   title: "Create Next App",
   description: "Generated by create next app",
};

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const locale = await getLocale();

   const messages = await getMessages();

   return (
      <ClerkProvider>
         <LanguageProvider>
            <html lang={locale} suppressHydrationWarning={true}>
               <body className={inter.className}>
                  <NextIntlClientProvider messages={messages}>
                     <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <Toaster />
                        <NextTopLoader />
                        {children}
                     </ThemeProvider>
                  </NextIntlClientProvider>
               </body>
            </html>
         </LanguageProvider>
      </ClerkProvider>
   );
}
