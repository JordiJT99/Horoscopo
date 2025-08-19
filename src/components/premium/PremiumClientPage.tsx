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

  // Debug logs
  console.log('[PREMIUM] Component state:', {
    isCapacitor,
    isInitialized,
    isLoading,
    subscriptionsCount: subscriptions.length,
    subscriptions,
    hasActiveSubscription
  });

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

  // Buscar suscripciones específicas
  const monthlyPremium = subscriptions.find(sub => sub.subscriptionId === SUBSCRIPTION_IDS.PREMIUM_MONTHLY);
  const yearlyPremium = subscriptions.find(sub => sub.subscriptionId === SUBSCRIPTION_IDS.PREMIUM_YEARLY);

  // Si no es Capacitor (web), mostrar mensaje informativo
  if (!isCapacitor) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Smartphone className="h-16 w-16 text-cosmic-purple" />
          </div>
          <h1 className="text-3xl font-bold text-white">Suscripciones Premium</h1>
          <p className="text-cosmic-gray max-w-2xl mx-auto">
            Las suscripciones premium están disponibles exclusivamente en nuestra aplicación móvil. 
            Descarga AstroMística desde Google Play Store para acceder a todas las funciones premium.
          </p>
        </div>

        {/* Mostrar planes de suscripción (solo informativos) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Plan Mensual */}
          <Card className="bg-gradient-to-br from-cosmic-purple/20 to-cosmic-pink/20 border-cosmic-purple/30">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Crown className="h-6 w-6 text-cosmic-purple" />
                <CardTitle className="text-white">Premium Mensual</CardTitle>
              </div>
              <CardDescription className="text-cosmic-gray">
                Acceso completo por 1 mes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-cosmic-purple">€4,99</div>
              <ul className="space-y-2 text-sm text-cosmic-gray">
                <li className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-cosmic-yellow" />
                  <span>Horóscopos del futuro (mañana/semana)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-cosmic-yellow" />
                  <span>Carta natal completa</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-cosmic-yellow" />
                  <span>Experiencia sin anuncios</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Gem className="h-4 w-4 text-cosmic-yellow" />
                  <span>Bonificación doble de Stardust</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-cosmic-purple hover:bg-cosmic-purple/80"
                disabled
              >
                Disponible en la App Móvil
              </Button>
            </CardContent>
          </Card>

          {/* Plan Anual */}
          <Card className="bg-gradient-to-br from-cosmic-yellow/20 to-cosmic-orange/20 border-cosmic-yellow/30 relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-cosmic-yellow text-cosmic-dark px-3 py-1 rounded-full text-xs font-bold">
                MEJOR VALOR
              </div>
            </div>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Crown className="h-6 w-6 text-cosmic-yellow" />
                <CardTitle className="text-white">Premium Anual</CardTitle>
              </div>
              <CardDescription className="text-cosmic-gray">
                Acceso completo por 1 año (58% de descuento)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-cosmic-yellow">€49,99</div>
                <div className="text-sm text-cosmic-gray line-through">€119,88</div>
                <div className="text-sm text-cosmic-green">¡Ahorras €69,89!</div>
              </div>
              <ul className="space-y-2 text-sm text-cosmic-gray">
                <li className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-cosmic-yellow" />
                  <span>Horóscopos del futuro (mañana/semana)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-cosmic-yellow" />
                  <span>Carta natal completa</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-cosmic-yellow" />
                  <span>Experiencia sin anuncios</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Gem className="h-4 w-4 text-cosmic-yellow" />
                  <span>Bonificación doble de Stardust</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-cosmic-yellow text-cosmic-dark hover:bg-cosmic-yellow/80"
                disabled
              >
                Disponible en la App Móvil
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Call to action para descargar la app */}
        <div className="text-center space-y-4 bg-gradient-to-r from-cosmic-purple/20 to-cosmic-pink/20 rounded-lg p-8">
          <h3 className="text-xl font-bold text-white">¿Listo para desbloquear el poder completo de AstroMística?</h3>
          <p className="text-cosmic-gray">
            Descarga nuestra aplicación móvil y accede a todas las funciones premium
          </p>
          <Button 
            className="bg-cosmic-purple hover:bg-cosmic-purple/80"
            onClick={() => window.open('https://play.google.com/store/apps/details?id=com.astromistica.horoscopo', '_blank')}
          >
            <Smartphone className="mr-2 h-4 w-4" />
            Descargar en Google Play
          </Button>
        </div>
      </div>
    );
  }

  // Para dispositivos móviles con Capacitor
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
        <h1 className="text-3xl font-bold text-white">Suscripciones Premium</h1>
        <p className="text-cosmic-gray max-w-2xl mx-auto">
          Desbloquea el poder completo de AstroMística con acceso a horóscopos del futuro, 
          carta natal completa y experiencia sin anuncios.
        </p>
        
        {hasActiveSubscription && (
          <div className="bg-cosmic-green/20 border border-cosmic-green/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-cosmic-green">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">¡Ya tienes una suscripción activa!</span>
            </div>
          </div>
        )}
      </div>

      {/* Mostrar suscripciones reales desde Google Play */}
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
          <Card className="bg-gradient-to-br from-cosmic-purple/20 to-cosmic-pink/20 border-cosmic-purple/30">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Crown className="h-6 w-6 text-cosmic-purple" />
                <CardTitle className="text-white">{monthlyPremium.title}</CardTitle>
              </div>
              <CardDescription className="text-cosmic-gray">
                {monthlyPremium.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-cosmic-purple">{monthlyPremium.price}</div>
              <ul className="space-y-2 text-sm text-cosmic-gray">
                <li className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-cosmic-yellow" />
                  <span>Horóscopos del futuro (mañana/semana)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-cosmic-yellow" />
                  <span>Carta natal completa</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-cosmic-yellow" />
                  <span>Experiencia sin anuncios</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Gem className="h-4 w-4 text-cosmic-yellow" />
                  <span>Bonificación doble de Stardust</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-cosmic-purple hover:bg-cosmic-purple/80"
                onClick={() => handleSubscribe(monthlyPremium.subscriptionId)}
                disabled={hasActiveSubscription || isLoading}
              >
                {hasActiveSubscription ? 'Ya Suscrito' : 'Suscribirse'}
              </Button>
            </CardContent>
          </Card>
        )}

        {yearlyPremium && (
          <Card className="bg-gradient-to-br from-cosmic-yellow/20 to-cosmic-orange/20 border-cosmic-yellow/30 relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-cosmic-yellow text-cosmic-dark px-3 py-1 rounded-full text-xs font-bold">
                MEJOR VALOR
              </div>
            </div>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Crown className="h-6 w-6 text-cosmic-yellow" />
                <CardTitle className="text-white">{yearlyPremium.title}</CardTitle>
              </div>
              <CardDescription className="text-cosmic-gray">
                {yearlyPremium.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-cosmic-yellow">{yearlyPremium.price}</div>
              <ul className="space-y-2 text-sm text-cosmic-gray">
                <li className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-cosmic-yellow" />
                  <span>Horóscopos del futuro (mañana/semana)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-cosmic-yellow" />
                  <span>Carta natal completa</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-cosmic-yellow" />
                  <span>Experiencia sin anuncios</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Gem className="h-4 w-4 text-cosmic-yellow" />
                  <span>Bonificación doble de Stardust</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-cosmic-yellow text-cosmic-dark hover:bg-cosmic-yellow/80"
                onClick={() => handleSubscribe(yearlyPremium.subscriptionId)}
                disabled={hasActiveSubscription || isLoading}
              >
                {hasActiveSubscription ? 'Ya Suscrito' : 'Suscribirse'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
