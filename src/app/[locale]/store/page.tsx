// src/app/[locale]/store/page.tsx

import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';
import { products } from '@/lib/store-products';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale.toString(),
  }));
}

interface StorePageProps {
  params: { locale: Locale };
}

export default async function StorePage({ params }: StorePageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['StorePage.title'] || "Cosmic Recommendations"}
        subtitle={dictionary['StorePage.subtitle'] || "Handpicked items to enhance your spiritual journey."}
        icon={ShoppingBag}
        className="mb-12"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            dictionary={dictionary}
          />
        ))}
      </div>

      <div className="text-center mt-12 p-4 bg-card/60 rounded-lg">
        <p className="text-sm text-muted-foreground">
          {dictionary['StorePage.affiliateDisclaimer'] || "As an Amazon Associate, we earn from qualifying purchases. This helps support our app at no extra cost to you."}
        </p>
      </div>
    </main>
  );
}
