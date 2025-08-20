"use client";

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Languages, Search } from 'lucide-react';
import type { Locale } from '@/types';

interface LanguageInfo {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

// Definición de todos los idiomas con sus banderas emoji
const AVAILABLE_LANGUAGES: LanguageInfo[] = [
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Europa' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', region: 'América' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'Europa' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Europa' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', region: 'Europa' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', region: 'Europa' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Europa' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', region: 'Asia' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Asia' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'Asia' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Oriente Medio' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'Asia' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', region: 'Asia' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Asia' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', region: 'Europa' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', region: 'Europa' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', region: 'Europa' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', region: 'Europa' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', region: 'Europa' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', region: 'Europa' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', region: 'Europa' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', region: 'Europa' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', region: 'Europa' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', region: 'Europa' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', region: 'Europa' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', region: 'Europa' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', region: 'Oriente Medio' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', region: 'Oriente Medio' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', region: 'Asia' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Asia' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', region: 'África' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', region: 'Asia' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'Asia' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', region: 'Asia' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', region: 'Asia' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'Asia' },
];

interface LanguageSelectorProps {
  currentLocale: Locale;
  dictionary?: any;
  variant?: 'button' | 'compact';
}

export default function LanguageSelector({ currentLocale, dictionary, variant = 'button' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const currentLanguage = AVAILABLE_LANGUAGES.find(lang => lang.code === currentLocale);

  const handleLanguageChange = (newLocale: Locale) => {
    // Prevenir múltiples clicks
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }
    
    localStorage.setItem('userLocale', newLocale);
    
    // Construir nueva ruta correctamente - solo reemplazar el primer segmento de idioma
    const pathSegments = pathname.split('/');
    pathSegments[1] = newLocale; // El idioma siempre está en la posición 1 después del slash inicial
    const newPath = pathSegments.join('/');
    
    setIsOpen(false);
    router.push(newPath);
  };

  const filteredLanguages = AVAILABLE_LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Agrupar idiomas por región
  const groupedLanguages = filteredLanguages.reduce((acc, lang) => {
    if (!acc[lang.region]) acc[lang.region] = [];
    acc[lang.region].push(lang);
    return acc;
  }, {} as Record<string, LanguageInfo[]>);

  if (variant === 'compact') {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 h-8 px-2 hover:bg-primary/10"
          >
            <span className="text-lg">{currentLanguage?.flag}</span>
            <span className="text-sm font-medium">{currentLanguage?.code.toUpperCase()}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              {dictionary?.['Header.changeLanguage'] || 'Seleccionar idioma'}
            </DialogTitle>
          </DialogHeader>
          <LanguageSelectorContent 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            groupedLanguages={groupedLanguages}
            currentLocale={currentLocale}
            handleLanguageChange={handleLanguageChange}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-3 w-full justify-start bg-card/90 hover:bg-primary/10 border border-border/50 p-4 h-auto"
        >
          <Languages className="w-5 h-5 text-primary" />
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentLanguage?.flag}</span>
            <div className="text-left">
              <div className="font-medium text-foreground">
                {dictionary?.['Header.changeLanguage'] || 'Idioma'}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentLanguage?.nativeName}
              </div>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Languages className="w-6 h-6" />
            {dictionary?.['Header.changeLanguage'] || 'Seleccionar idioma'}
          </DialogTitle>
        </DialogHeader>
        <LanguageSelectorContent 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          groupedLanguages={groupedLanguages}
          currentLocale={currentLocale}
          handleLanguageChange={handleLanguageChange}
        />
      </DialogContent>
    </Dialog>
  );
}

function LanguageSelectorContent({ 
  searchQuery, 
  setSearchQuery, 
  groupedLanguages, 
  currentLocale, 
  handleLanguageChange 
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  groupedLanguages: Record<string, LanguageInfo[]>;
  currentLocale: Locale;
  handleLanguageChange: (locale: Locale) => void;
}) {
  return (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar idioma..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <ScrollArea className="h-96">
        <div className="space-y-4">
          {Object.entries(groupedLanguages).map(([region, languages]) => (
            <div key={region}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 sticky top-0 bg-background/95 backdrop-blur py-1">
                {region}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={currentLocale === lang.code ? "default" : "ghost"}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="flex items-center gap-3 w-full justify-start p-3 h-auto hover:bg-primary/10"
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <div className="text-left">
                      <div className="font-medium">{lang.nativeName}</div>
                      <div className="text-xs text-muted-foreground">{lang.name}</div>
                    </div>
                    {currentLocale === lang.code && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary"></div>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
