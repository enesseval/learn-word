import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/context/LanguagesContext";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { WordCardProvider } from "@/context/WordCardContext";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const locale = await getLocale();
   const messages = await getMessages();

   const title = (messages.navbar as any).logo;

   return (
      <ClerkProvider>
         <LanguageProvider>
            <WordCardProvider>
               <html lang={locale} suppressHydrationWarning={true}>
                  <head>
                     <title>{title}</title>
                     <link rel="icon" type="image/x-icon" href="/logo.ico"></link>
                  </head>
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
            </WordCardProvider>
         </LanguageProvider>
      </ClerkProvider>
   );
}
