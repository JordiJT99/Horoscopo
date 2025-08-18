
'use client';

import type { Dictionary, Locale } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import { useBilling, SUBSCRIPTION_IDS, PRODUCT_IDS } from '@/hooks/use-billing';
import { Award, Sparkles, Star, Calendar, MessageCircle, BarChart3, Gem, Crown, Zap, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface PremiumClientPageProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function PremiumClientPage({ dictionary, locale }: PremiumClientPageProps) {
  const { togglePremium } = useCosmicEnergy();
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

  const handleTogglePremium = () => {
    togglePremium();
    toast({
      title: 'Premium Status Changed (Dev)',
      description: `Premium features are now available for all users.`,
    });
  };

  const handleSubscribe = async (subscriptionId: string) => {
    const success = await purchaseSubscription(subscriptionId);
    if (success) {
      // Actualizar el estado premium
      togglePremium();
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
  const monthlyVip = subscriptions.find(sub => sub.subscriptionId === SUBSCRIPTION_IDS.VIP_MONTHLY);
  const yearlyVip = subscriptions.find(sub => sub.subscriptionId === SUBSCRIPTION_IDS.VIP_YEARLY);

  // Buscar productos específicos
  const removeAds = products.find(prod => prod.productId === PRODUCT_IDS.REMOVE_ADS);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Estado de suscripción */}
      {hasActiveSubscription && (
        <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50">
          <CardContent className="flex items-center gap-3 p-6">
            <Crown className="h-8 w-8 text-yellow-500" />
            <div>
              <h3 className="font-semibold text-yellow-500">Estado Premium Activo</h3>
              <p className="text-sm text-muted-foreground">Tienes acceso a todas las funciones premium</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Características Premium */}
        <div className="space-y-6">
          <Card className="bg-card/70 backdrop-blur-sm border-primary/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-primary">
                {dictionary['PremiumPage.featuresTitle'] || 'Características Premium'}
              </CardTitle>
              <CardDescription className="text-lg">
                {dictionary['PremiumPage.featuresDesc'] || 'Desbloquea todo el poder cósmico'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-cyan-400 mt-1" />
                <div>
                  <h4 className="font-semibold">Sin Anuncios</h4>
                  <p className="text-sm text-muted-foreground">Experiencia sin interrupciones publicitarias</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Gem className="h-6 w-6 text-cyan-400 mt-1" />
                <div>
                  <h4 className="font-semibold">200 Stardust Diario</h4>
                  <p className="text-sm text-muted-foreground">Doble bonificación diaria para funciones especiales</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="h-6 w-6 text-cyan-400 mt-1" />
                <div>
                  <h4 className="font-semibold">Carta Natal Completa</h4>
                  <p className="text-sm text-muted-foreground">Acceso completo a tu blueprint astrológico</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-6 w-6 text-cyan-400 mt-1" />
                <div>
                  <h4 className="font-semibold">Horóscopos del Futuro</h4>
                  <p className="text-sm text-muted-foreground">Ve las energías de los próximos días</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle className="h-6 w-6 text-cyan-400 mt-1" />
                <div>
                  <h4 className="font-semibold">Chat Psíquico Ilimitado</h4>
                  <p className="text-sm text-muted-foreground">Conversaciones sin límite con psíquicos IA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Planes de Suscripción */}
        <div className="space-y-6">
          {/* Suscripciones Premium */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Premium Mensual */}
            {monthlyPremium && (
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
                <CardHeader className="text-center">
                  <Crown className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <CardTitle className="text-lg">Premium Mensual</CardTitle>
                  <CardDescription className="text-2xl font-bold text-purple-400">
                    {monthlyPremium.price}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700" 
                    onClick={() => handleSubscribe(SUBSCRIPTION_IDS.PREMIUM_MONTHLY)}
                    disabled={isLoading || !isInitialized}
                  >
                    {isLoading ? <LoadingSpinner className="h-4 w-4 mr-2" /> : null}
                    Suscribirse
                  </Button>
                  <p className="text-xs text-center mt-2 text-muted-foreground">
                    Se renueva automáticamente
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Premium Anual */}
            {yearlyPremium && (
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    AHORRA 30%
                  </span>
                </div>
                <CardHeader className="text-center pt-6">
                  <Crown className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <CardTitle className="text-lg">Premium Anual</CardTitle>
                  <CardDescription className="text-2xl font-bold text-purple-400">
                    {yearlyPremium.price}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700" 
                    onClick={() => handleSubscribe(SUBSCRIPTION_IDS.PREMIUM_YEARLY)}
                    disabled={isLoading || !isInitialized}
                  >
                    {isLoading ? <LoadingSpinner className="h-4 w-4 mr-2" /> : null}
                    Suscribirse
                  </Button>
                  <p className="text-xs text-center mt-2 text-muted-foreground">
                    Facturado anualmente
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Compras Únicas */}
          <Card className="bg-card/70 backdrop-blur-sm border-green-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Compras Únicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {removeAds && (
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div>
                    <h4 className="font-semibold text-green-400">Eliminar Anuncios para Siempre</h4>
                    <p className="text-sm text-muted-foreground">Pago único, sin suscripciones</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">{removeAds.price}</p>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handlePurchaseProduct(PRODUCT_IDS.REMOVE_ADS)}
                      disabled={isLoading || !isInitialized}
                    >
                      {isLoading ? <LoadingSpinner className="h-4 w-4 mr-1" /> : null}
                      Comprar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card className="bg-card/50 border-blue-500/30">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <h4 className="font-semibold text-blue-400">💫 Garantía de Satisfacción</h4>
                <p className="text-sm text-muted-foreground">
                  Puedes cancelar tu suscripción en cualquier momento desde Google Play Store
                </p>
                <p className="text-xs text-muted-foreground">
                  Las suscripciones se gestionan a través de Google Play Billing
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
