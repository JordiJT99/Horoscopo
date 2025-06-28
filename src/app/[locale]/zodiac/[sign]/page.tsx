
import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import { ZODIAC_SIGNS } from '@/lib/constants';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { Flame, Mountain, Wind, Droplets, Layers, Anchor, RefreshCw, Sun, Shield, Heart, Briefcase, Sparkles } from 'lucide-react';
import type { AstrologicalElement, AstrologicalModality, AstrologicalPolarity } from '@/types';
import { cn } from '@/lib/utils';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  const signs = ZODIAC_SIGNS.map(s => s.name.toLowerCase());
  const params: { locale: string; sign: string }[] = [];

  locales.forEach(locale => {
    signs.forEach(sign => {
      params.push({ locale, sign });
    });
  });

  return params;
}

const getElementInfo = (element: AstrologicalElement, dictionary: any) => {
    const info = { icon: Sparkles, color: 'text-gray-400', label: element };
    if (element === "Fire") {
        info.icon = Flame;
        info.color = 'text-red-500';
    } else if (element === "Earth") {
        info.icon = Mountain;
        info.color = 'text-green-600';
    } else if (element === "Air") {
        info.icon = Wind;
        info.color = 'text-blue-400';
    } else if (element === "Water") {
        info.icon = Droplets;
        info.color = 'text-cyan-500';
    }
    info.label = dictionary[element] || element;
    return info;
};

const getModalityInfo = (modality: AstrologicalModality, dictionary: any) => {
    const info = { icon: Sparkles, color: 'text-gray-400', label: modality };
    if (modality === "Cardinal") {
        info.icon = Layers;
        info.color = 'text-purple-500';
    } else if (modality === "Fixed") {
        info.icon = Anchor;
        info.color = 'text-orange-500';
    } else if (modality === "Mutable") {
        info.icon = RefreshCw;
        info.color = 'text-indigo-500';
    }
    info.label = dictionary[modality] || modality;
    return info;
};

const getPolarityInfo = (polarity: AstrologicalPolarity, dictionary: any) => {
    const info = { icon: Sparkles, color: 'text-gray-400', label: polarity };
    if (polarity === "Masculine") {
        info.icon = Sun;
        info.color = 'text-yellow-500';
    } else if (polarity === "Feminine") {
        info.icon = Shield; 
        info.color = 'text-pink-500';
    }
    info.label = dictionary[polarity] || polarity;
    return info;
};


interface TraitCardProps {
    title: string;
    items: string[];
}

const TraitCard = ({ title, items }: TraitCardProps) => (
    <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-lg">
        <CardHeader>
            <CardTitle className="text-xl text-primary font-headline">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="list-disc list-inside space-y-1 font-body text-card-foreground">
                {items.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        </CardContent>
    </Card>
);


export default async function ZodiacDetailPage({ params }: { params: { locale: Locale, sign: string } }) {
  const dictionary = await getDictionary(params.locale);
  const signData = ZODIAC_SIGNS.find(s => s.name.toLowerCase() === params.sign.toLowerCase());

  if (!signData) {
    notFound();
  }

  const detailDict = dictionary.ZodiacDetail?.[signData.name] || {};
  const pageTitle = detailDict.title?.replace('{signName}', dictionary[signData.name] || signData.name) || signData.name;
  
  const elementInfo = getElementInfo(signData.element, dictionary);
  const modalityInfo = getModalityInfo(signData.modality, dictionary);
  const polarityInfo = getPolarityInfo(signData.polarity, dictionary);
  
  let imagePath = `https://placehold.co/256x256.png?text=${signData.name.substring(0, 2).toUpperCase()}`;
  let aiHint = "zodiac placeholder";

  if (signData.customIconPath) {
    imagePath = signData.customIconPath;
    aiHint = `${signData.name.toLowerCase()} zodiac symbol illustration`;
  }
  
  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary mb-2">{pageTitle}</h1>
            <p className="text-lg text-muted-foreground">{signData.dateRange}</p>
        </div>
        
        <div className="flex justify-center mb-12">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"></div>
                 <Image
                    src={imagePath}
                    alt={dictionary[signData.name] || signData.name}
                    width={224}
                    height={224}
                    className="relative w-full h-full object-contain drop-shadow-lg"
                    data-ai-hint={aiHint}
                    priority
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-12">
            <Card className="p-4 bg-card/60 backdrop-blur-sm">
                <elementInfo.icon className={cn("w-8 h-8 mx-auto mb-2", elementInfo.color)} />
                <p className="font-semibold text-lg">{elementInfo.label}</p>
                <p className="text-sm text-muted-foreground">{dictionary.ZodiacDetail?.element || 'Element'}</p>
            </Card>
             <Card className="p-4 bg-card/60 backdrop-blur-sm">
                <modalityInfo.icon className={cn("w-8 h-8 mx-auto mb-2", modalityInfo.color)} />
                <p className="font-semibold text-lg">{modalityInfo.label}</p>
                 <p className="text-sm text-muted-foreground">{dictionary.ZodiacDetail?.modality || 'Modality'}</p>
            </Card>
             <Card className="p-4 bg-card/60 backdrop-blur-sm">
                <polarityInfo.icon className={cn("w-8 h-8 mx-auto mb-2", polarityInfo.color)} />
                <p className="font-semibold text-lg">{polarityInfo.label}</p>
                 <p className="text-sm text-muted-foreground">{dictionary.ZodiacDetail?.polarity || 'Polarity'}</p>
            </Card>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
            <p className="text-lg text-center text-foreground/90 leading-relaxed">
                {detailDict.description || "Description not available."}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TraitCard title={detailDict.strengthsTitle || "Strengths"} items={detailDict.strengths || []} />
                <TraitCard title={detailDict.weaknessesTitle || "Weaknesses"} items={detailDict.weaknesses || []} />
            </div>

            <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-lg">
                <CardHeader className="flex flex-row items-center gap-3">
                    <Heart className="w-6 h-6 text-primary" />
                    <CardTitle className="text-xl text-primary font-headline">{detailDict.loveTitle || "In Love"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-body text-card-foreground/90 leading-relaxed">{detailDict.love || "Love characteristics not available."}</p>
                </CardContent>
            </Card>
             <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-lg">
                <CardHeader className="flex flex-row items-center gap-3">
                    <Briefcase className="w-6 h-6 text-primary" />
                    <CardTitle className="text-xl text-primary font-headline">{detailDict.workTitle || "At Work"}</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="font-body text-card-foreground/90 leading-relaxed">{detailDict.work || "Work characteristics not available."}</p>
                </CardContent>
            </Card>

        </div>
    </main>
  );
}
