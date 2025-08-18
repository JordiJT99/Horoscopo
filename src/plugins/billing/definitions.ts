export interface GooglePlayBillingPlugin {
  /**
   * Inicializar la conexión con Google Play Billing
   */
  initialize(): Promise<{ success: boolean; message?: string }>;

  /**
   * Obtener productos disponibles para compra
   */
  getProducts(options: { productIds: string[] }): Promise<{ products: Product[] }>;

  /**
   * Obtener suscripciones disponibles
   */
  getSubscriptions(options: { subscriptionIds: string[] }): Promise<{ subscriptions: Subscription[] }>;

  /**
   * Iniciar el flujo de compra para un producto
   */
  purchaseProduct(options: { productId: string }): Promise<{ success: boolean; purchase?: Purchase; message?: string }>;

  /**
   * Iniciar el flujo de suscripción
   */
  purchaseSubscription(options: { subscriptionId: string }): Promise<{ success: boolean; purchase?: Purchase; message?: string }>;

  /**
   * Obtener compras del usuario
   */
  getPurchases(): Promise<{ purchases: Purchase[] }>;

  /**
   * Obtener suscripciones activas del usuario
   */
  getActiveSubscriptions(): Promise<{ subscriptions: Purchase[] }>;

  /**
   * Verificar si el usuario tiene una suscripción activa
   */
  hasActiveSubscription(options: { subscriptionId?: string }): Promise<{ hasSubscription: boolean; subscription?: Purchase }>;

  /**
   * Consumir una compra (para productos consumibles)
   */
  consumePurchase(options: { purchaseToken: string }): Promise<{ success: boolean; message?: string }>;

  /**
   * Finalizar la conexión
   */
  disconnect(): Promise<{ success: boolean }>;
}

export interface Product {
  productId: string;
  title: string;
  description: string;
  price: string;
  priceAmountMicros: number;
  priceCurrencyCode: string;
}

export interface Subscription {
  subscriptionId: string;
  title: string;
  description: string;
  price: string;
  priceAmountMicros: number;
  priceCurrencyCode: string;
  billingPeriod: string;
  freeTrialPeriod?: string;
}

export interface Purchase {
  orderId: string;
  packageName: string;
  productId: string;
  purchaseTime: number;
  purchaseState: number;
  purchaseToken: string;
  quantity: number;
  acknowledged: boolean;
  autoRenewing?: boolean;
  originalJson: string;
  signature: string;
}
