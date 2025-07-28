import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import AdMobTestComponent from '@/components/shared/AdMobTestComponent';

interface AdMobTestPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function AdMobTestPage({ params }: AdMobTestPageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">
          AdMob Test Center
        </h1>
        <p className="text-muted-foreground">
          Test your AdMob integration with Google's test ads
        </p>
      </div>
      
      <AdMobTestComponent />
      
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">📱 Instrucciones de Testing:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li><strong>1.</strong> Los anuncios solo funcionan en dispositivos físicos (no en emulador)</li>
            <li><strong>2.</strong> Genera un APK: <code className="bg-yellow-100 px-1 rounded">npm run build && npx cap sync android</code></li>
            <li><strong>3.</strong> Instala en tu dispositivo: <code className="bg-yellow-100 px-1 rounded">cd android && ./gradlew installDebug</code></li>
            <li><strong>4.</strong> Los anuncios de prueba aparecerán con el texto "Test Ad"</li>
            <li><strong>5.</strong> Si todo funciona, cambia los IDs en <code className="bg-yellow-100 px-1 rounded">src/lib/admob.ts</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
