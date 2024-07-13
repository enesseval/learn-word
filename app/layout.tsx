import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

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
         <html lang={locale}>
            <body className={inter.className}>
               <NextIntlClientProvider messages={messages}>
                  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                     {children}
                  </ThemeProvider>
               </NextIntlClientProvider>
            </body>
         </html>
      </ClerkProvider>
   );
}
