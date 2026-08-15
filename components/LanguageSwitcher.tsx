"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "vi" ? "en" : "vi");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 text-foreground-secondary hover:text-foreground transition-colors"
      title="Switch language"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium uppercase">{language === "vi" ? "EN" : "VI"}</span>
    </button>
  );
}
