import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import SectionTitle from '@/components/shared/SectionTitle';
import HoroscopeSection from '@/components/sections/HoroscopeSection';
import CompatibilitySection from '@/components/sections/CompatibilitySection';
import LuckyNumbersSection from '@/components/sections/LuckyNumbersSection';
import LunarAscendantSection from '@/components/sections/LunarAscendantSection';
import { Sparkles } from 'lucide-react';

export default function AstroVibesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <SectionTitle 
          title="Welcome to AstroVibes" 
          subtitle="Your portal to the cosmos. Explore your astrological path and uncover celestial secrets."
          icon={Sparkles}
          className="mb-12"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <div className="lg:col-span-2">
            <HoroscopeSection />
          </div>
          <CompatibilitySection />
          <LuckyNumbersSection />
          <div className="lg:col-span-2">
            <LunarAscendantSection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
