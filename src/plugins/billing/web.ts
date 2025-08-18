import { WebPlugin } from '@capacitor/core';
import type { GooglePlayBillingPlugin, Product, Subscription, Purchase } from './definitions';

export class GooglePlayBillingWeb extends WebPlugin implements GooglePlayBillingPlugin {
  async initialize(): Promise<{ success: boolean; message?: string }> {
    console.log('GooglePlayBilling: Web implementation - initialize');
    return { success: true, message: 'Billing initialized on web (mock)' };
  }

  async getProducts(options: { productIds: string[] }): Promise<{ products: Product[] }> {
    console.log('GooglePlayBilling: Web implementation - getProducts', options);
    // Mock products para testing en web
    const mockProducts: Product[] = options.productIds.map(id => ({
      productId: id,
      title: `Mock Product ${id}`,
      description: `Description for ${id}`,
      price: '$0.99',
      priceAmountMicros: 990000,
      priceCurrencyCode: 'USD'
    }));
    return { products: mockProducts };
  }

  async getSubscriptions(options: { subscriptionIds: string[] }): Promise<{ subscriptions: Subscription[] }> {
    console.log('GooglePlayBilling: Web implementation - getSubscriptions', options);
    // Mock subscriptions para testing en web
    const mockSubscriptions: Subscription[] = options.subscriptionIds.map(id => ({
      subscriptionId: id,
      title: `Mock Subscription ${id}`,
      description: `Subscription description for ${id}`,
      price: '$4.99',
      priceAmountMicros: 4990000,
      priceCurrencyCode: 'USD',
      billingPeriod: 'P1M',
      freeTrialPeriod: 'P7D'
    }));
    return { subscriptions: mockSubscriptions };
  }

  async purchaseProduct(options: { productId: string }): Promise<{ success: boolean; purchase?: Purchase; message?: string }> {
    console.log('GooglePlayBilling: Web implementation - purchaseProduct', options);
    return { 
      success: false, 
      message: 'Purchases not available on web. Please use the mobile app.' 
    };
  }

  async purchaseSubscription(options: { subscriptionId: string }): Promise<{ success: boolean; purchase?: Purchase; message?: string }> {
    console.log('GooglePlayBilling: Web implementation - purchaseSubscription', options);
    return { 
      success: false, 
      message: 'Subscriptions not available on web. Please use the mobile app.' 
    };
  }

  async getPurchases(): Promise<{ purchases: Purchase[] }> {
    console.log('GooglePlayBilling: Web implementation - getPurchases');
    return { purchases: [] };
  }

  async getActiveSubscriptions(): Promise<{ subscriptions: Purchase[] }> {
    console.log('GooglePlayBilling: Web implementation - getActiveSubscriptions');
    return { subscriptions: [] };
  }

  async hasActiveSubscription(options: { subscriptionId?: string }): Promise<{ hasSubscription: boolean; subscription?: Purchase }> {
    console.log('GooglePlayBilling: Web implementation - hasActiveSubscription', options);
    return { hasSubscription: false };
  }

  async consumePurchase(options: { purchaseToken: string }): Promise<{ success: boolean; message?: string }> {
    console.log('GooglePlayBilling: Web implementation - consumePurchase', options);
    return { success: true, message: 'Mock consume completed' };
  }

  async disconnect(): Promise<{ success: boolean }> {
    console.log('GooglePlayBilling: Web implementation - disconnect');
    return { success: true };
  }
}
