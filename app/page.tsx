import Navbar from "@/components/Navbar";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";

export default function Home() {
   const t = useTranslations("HomePage");
   return (
      <div className="flex flex-col min-h-screen max-h-screen min-w-full bg-background">
         <Navbar />
      </div>
   );
}
