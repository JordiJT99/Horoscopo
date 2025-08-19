
'use client';

import type { Dictionary, Locale } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import { useBilling, SUBSCRIPTION_IDS, PRODUCT_IDS } from '@/hooks/use-billing';
import { useCapacitor } from '@/hooks/use-capacitor';
import { Award, Sparkles, Star, Calendar, MessageCircle, BarChart3, Gem, Crown, Zap, Shield, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface PremiumClientPageProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function PremiumClientPage({ dictionary, locale }: PremiumClientPageProps) {
  const cosmicEnergy = useCosmicEnergy();
  const { isCapacitor } = useCapacitor();
  const { toast } = useToast();
  const { 
    isInitialized, 
    isLoading, 
    subscriptions, 
    hasActiveSubscription, 
    purchaseSubscription,
    purchaseProduct,
    products
  } = useBilling();

  const handleSubscribe = async (subscriptionId: string) => {
    const success = await purchaseSubscription(subscriptionId);
    if (success) {
      toast({
        title: 'Suscripción Exitosa',
        description: 'Tu suscripción se ha activado correctamente',
      });
    }
  };

  const handlePurchaseProduct = async (productId: string) => {
    const success = await purchaseProduct(productId);
    if (success) {
      toast({
        title: 'Compra Exitosa',
        description: 'Tu compra se ha procesado correctamente',
      });
    }
  };

  const monthlyPremium = subscriptions.find(sub => sub.subscriptionId === SUBSCRIPTION_IDS.PREMIUM_MONTHLY);
  const yearlyPremium = subscriptions.find(sub => sub.subscriptionId === SUBSCRIPTION_IDS.PREMIUM_YEARLY);
  const removeAdsProduct = products.find(prod => prod.productId === PRODUCT_IDS.REMOVE_ADS);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
         <h1 className="text-3xl font-bold text-white">{dictionary['PremiumPage.title']}</h1>
        <p className="text-cosmic-gray max-w-2xl mx-auto">
            {dictionary['PremiumPage.subtitle']}
        </p>
        
        {hasActiveSubscription && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2 text-green-300">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">¡Ya tienes una suscripción activa!</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {subscriptions.length === 0 && isInitialized && !isLoading && (
          <div className="col-span-full text-center p-8 bg-red-500/20 border border-red-500/30 rounded-lg">
            <h3 className="text-red-400 font-bold mb-2">No se encontraron suscripciones</h3>
            <p className="text-red-300 text-sm">
              No se pudieron cargar las suscripciones desde Google Play Console.
              <br />
              IDs buscados: {Object.values(SUBSCRIPTION_IDS).join(', ')}
            </p>
          </div>
        )}
        
        {monthlyPremium && (
          <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Crown className="h-6 w-6 text-purple-400" />
                <CardTitle className="text-white">{monthlyPremium.title}</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                {monthlyPremium.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-purple-400">{monthlyPremium.price}</div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>Horóscopos del futuro (mañana/semana)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-yellow-400" />
                  <span>Carta natal completa</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  <span>Experiencia sin anuncios</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-600/80"
                onClick={() => handleSubscribe(monthlyPremium.subscriptionId)}
                disabled={hasActiveSubscription || isLoading}
              >
                {hasActiveSubscription ? 'Ya Suscrito' : 'Suscribirse'}
              </Button>
            </CardContent>
          </Card>
        )}

        {yearlyPremium && (
          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                MEJOR VALOR
              </div>
            </div>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Crown className="h-6 w-6 text-yellow-400" />
                <CardTitle className="text-white">{yearlyPremium.title}</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                {yearlyPremium.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-yellow-400">{yearlyPremium.price}</div>
               <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>Horóscopos del futuro (mañana/semana)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-yellow-400" />
                  <span>Carta natal completa</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  <span>Experiencia sin anuncios</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-yellow-500 text-gray-900 hover:bg-yellow-500/80"
                onClick={() => handleSubscribe(yearlyPremium.subscriptionId)}
                disabled={hasActiveSubscription || isLoading}
              >
                {hasActiveSubscription ? 'Ya Suscrito' : 'Suscribirse'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

        {removeAdsProduct && (
            <Card className="mt-8 bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500/30 max-w-md mx-auto">
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                         <Zap className="h-6 w-6 text-green-400" />
                        <CardTitle className="text-white">{removeAdsProduct.title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-gray-300">{removeAdsProduct.description}</p>
                    <Button 
                        className="w-full bg-green-600 hover:bg-green-600/80"
                        onClick={() => handlePurchaseProduct(removeAdsProduct.productId)}
                        disabled={isLoading}
                    >
                        {removeAdsProduct.price}
                    </Button>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
