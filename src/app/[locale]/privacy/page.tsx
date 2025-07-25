import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import type { Locale } from '@/types';
import SectionTitle from '@/components/shared/SectionTitle';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({ locale }));
}

interface PrivacyPolicyPageProps {
  params: { locale: Locale };
}

export default async function PrivacyPolicyPage({ params }: PrivacyPolicyPageProps) {
  const dictionary = await getDictionary(params.locale);
  const privacyDict = dictionary.PrivacyPolicy || {};

  const sections = [
    { title: privacyDict.introduction?.title, content: privacyDict.introduction?.content },
    { title: privacyDict.informationWeCollect?.title, content: privacyDict.informationWeCollect?.content },
    { title: privacyDict.howWeUseInformation?.title, content: privacyDict.howWeUseInformation?.content },
    { title: privacyDict.dataSharing?.title, content: privacyDict.dataSharing?.content },
    { title: privacyDict.advertising?.title, content: privacyDict.advertising?.content },
    { title: privacyDict.dataSecurity?.title, content: privacyDict.dataSecurity?.content },
    { title: privacyDict.yourRights?.title, content: privacyDict.yourRights?.content },
    { title: privacyDict.dataDeletion?.title, content: privacyDict.dataDeletion?.content },
    { title: privacyDict.childrensPrivacy?.title, content: privacyDict.childrensPrivacy?.content },
    { title: privacyDict.changesToPolicy?.title, content: privacyDict.changesToPolicy?.content },
    { title: privacyDict.contactUs?.title, content: privacyDict.contactUs?.content },
  ];

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={privacyDict.title || "Privacy Policy"}
        icon={Shield}
        className="mb-8"
      />
      <Card className="max-w-4xl mx-auto bg-card/70 backdrop-blur-sm p-4 sm:p-6 md:p-8">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-xl font-headline text-primary">
            {privacyDict.title || "Privacy Policy"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {privacyDict.lastUpdated || "Last updated"}: {new Date().toLocaleDateString(params.locale, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </CardHeader>
        <CardContent className="p-0 space-y-6 text-sm text-foreground/90 leading-relaxed">
          {sections.map((section, index) => (
            section.title && section.content && (
              <div key={index}>
                <h2 className="text-lg font-semibold font-headline text-primary mb-2">{section.title}</h2>
                <div className="whitespace-pre-line space-y-3" dangerouslySetInnerHTML={{ __html: section.content.replace(/\\n/g, '<br />') }}>
                </div>
              </div>
            )
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
