package com.astromistica.plugins;

import android.app.Activity;
import android.content.Context;
import android.util.Log;

import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.List;

@CapacitorPlugin(name = "GooglePlayBilling")
public class GooglePlayBillingPlugin extends Plugin implements PurchasesUpdatedListener {
    
    private static final String TAG = "GooglePlayBilling";
    private BillingClient billingClient;
    private boolean isServiceConnected = false;

    @Override
    public void load() {
        Context context = getContext();
        billingClient = BillingClient.newBuilder(context)
            .setListener(this)
            .enablePendingPurchases()
            .build();
    }

    @PluginMethod
    public void initialize(PluginCall call) {
        if (billingClient.isReady()) {
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("message", "Billing client already connected");
            call.resolve(ret);
            return;
        }

        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(BillingResult billingResult) {
                JSObject ret = new JSObject();
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    isServiceConnected = true;
                    ret.put("success", true);
                    ret.put("message", "Billing service connected successfully");
                    Log.d(TAG, "Billing service connected");
                } else {
                    isServiceConnected = false;
                    ret.put("success", false);
                    ret.put("message", "Failed to connect to billing service: " + billingResult.getDebugMessage());
                    Log.e(TAG, "Failed to connect to billing service: " + billingResult.getDebugMessage());
                }
                call.resolve(ret);
            }

            @Override
            public void onBillingServiceDisconnected() {
                isServiceConnected = false;
                Log.d(TAG, "Billing service disconnected");
            }
        });
    }

    @PluginMethod
    public void getProducts(PluginCall call) {
        if (!isServiceConnected) {
            call.reject("Billing service not connected");
            return;
        }

        JSArray productIds = call.getArray("productIds");
        if (productIds == null) {
            call.reject("Product IDs are required");
            return;
        }

        List<String> productIdList = new ArrayList<>();
        try {
            for (int i = 0; i < productIds.length(); i++) {
                productIdList.add(productIds.getString(i));
            }
        } catch (Exception e) {
            call.reject("Invalid product IDs format");
            return;
        }

        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        for (String productId : productIdList) {
            productList.add(
                QueryProductDetailsParams.Product.newBuilder()
                    .setProductId(productId)
                    .setProductType(BillingClient.ProductType.INAPP)
                    .build()
            );
        }

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
            .setProductList(productList)
            .build();

        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
            JSObject ret = new JSObject();
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                JSArray products = new JSArray();
                for (ProductDetails productDetails : productDetailsList) {
                    JSObject product = new JSObject();
                    product.put("productId", productDetails.getProductId());
                    product.put("title", productDetails.getTitle());
                    product.put("description", productDetails.getDescription());
                    if (productDetails.getOneTimePurchaseOfferDetails() != null) {
                        product.put("price", productDetails.getOneTimePurchaseOfferDetails().getFormattedPrice());
                        product.put("priceAmountMicros", productDetails.getOneTimePurchaseOfferDetails().getPriceAmountMicros());
                        product.put("priceCurrencyCode", productDetails.getOneTimePurchaseOfferDetails().getPriceCurrencyCode());
                    }
                    products.put(product);
                }
                ret.put("products", products);
                call.resolve(ret);
            } else {
                call.reject("Failed to get products: " + billingResult.getDebugMessage());
            }
        });
    }

    @PluginMethod
    public void getSubscriptions(PluginCall call) {
        if (!isServiceConnected) {
            call.reject("Billing service not connected");
            return;
        }

        JSArray subscriptionIds = call.getArray("subscriptionIds");
        if (subscriptionIds == null) {
            call.reject("Subscription IDs are required");
            return;
        }

        List<String> subscriptionIdList = new ArrayList<>();
        try {
            for (int i = 0; i < subscriptionIds.length(); i++) {
                subscriptionIdList.add(subscriptionIds.getString(i));
            }
        } catch (Exception e) {
            call.reject("Invalid subscription IDs format");
            return;
        }

        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        for (String subscriptionId : subscriptionIdList) {
            productList.add(
                QueryProductDetailsParams.Product.newBuilder()
                    .setProductId(subscriptionId)
                    .setProductType(BillingClient.ProductType.SUBS)
                    .build()
            );
        }

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
            .setProductList(productList)
            .build();

        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
            JSObject ret = new JSObject();
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                JSArray subscriptions = new JSArray();
                for (ProductDetails productDetails : productDetailsList) {
                    JSObject subscription = new JSObject();
                    subscription.put("subscriptionId", productDetails.getProductId());
                    subscription.put("title", productDetails.getTitle());
                    subscription.put("description", productDetails.getDescription());
                    
                    if (productDetails.getSubscriptionOfferDetails() != null && !productDetails.getSubscriptionOfferDetails().isEmpty()) {
                        ProductDetails.SubscriptionOfferDetails offerDetails = productDetails.getSubscriptionOfferDetails().get(0);
                        if (!offerDetails.getPricingPhases().getPricingPhaseList().isEmpty()) {
                            ProductDetails.PricingPhase pricingPhase = offerDetails.getPricingPhases().getPricingPhaseList().get(0);
                            subscription.put("price", pricingPhase.getFormattedPrice());
                            subscription.put("priceAmountMicros", pricingPhase.getPriceAmountMicros());
                            subscription.put("priceCurrencyCode", pricingPhase.getPriceCurrencyCode());
                            subscription.put("billingPeriod", pricingPhase.getBillingPeriod());
                        }
                        subscription.put("basePlanId", offerDetails.getBasePlanId());
                        subscription.put("offerId", offerDetails.getOfferId());
                    }
                    
                    subscriptions.put(subscription);
                }
                ret.put("subscriptions", subscriptions);
                call.resolve(ret);
            } else {
                call.reject("Failed to get subscriptions: " + billingResult.getDebugMessage());
            }
        });
    }

    @PluginMethod
    public void purchaseProduct(PluginCall call) {
        if (!isServiceConnected) {
            call.reject("Billing service not connected");
            return;
        }

        String productId = call.getString("productId");
        if (productId == null) {
            call.reject("Product ID is required");
            return;
        }

        // Primero obtenemos los detalles del producto
        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        productList.add(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId(productId)
                .setProductType(BillingClient.ProductType.INAPP)
                .build()
        );

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
            .setProductList(productList)
            .build();

        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && !productDetailsList.isEmpty()) {
                ProductDetails productDetails = productDetailsList.get(0);
                
                BillingFlowParams.ProductDetailsParams productDetailsParams = BillingFlowParams.ProductDetailsParams.newBuilder()
                    .setProductDetails(productDetails)
                    .build();

                List<BillingFlowParams.ProductDetailsParams> productDetailsParamsList = new ArrayList<>();
                productDetailsParamsList.add(productDetailsParams);

                BillingFlowParams billingFlowParams = BillingFlowParams.newBuilder()
                    .setProductDetailsParamsList(productDetailsParamsList)
                    .build();

                Activity activity = getActivity();
                BillingResult result = billingClient.launchBillingFlow(activity, billingFlowParams);
                
                if (result.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    // El resultado se manejará en onPurchasesUpdated
                    JSObject ret = new JSObject();
                    ret.put("success", true);
                    ret.put("message", "Purchase flow started");
                    call.resolve(ret);
                } else {
                    call.reject("Failed to start purchase flow: " + result.getDebugMessage());
                }
            } else {
                call.reject("Product not found or failed to get product details");
            }
        });
    }

    @PluginMethod
    public void purchaseSubscription(PluginCall call) {
        if (!isServiceConnected) {
            call.reject("Billing service not connected");
            return;
        }

        String subscriptionId = call.getString("subscriptionId");
        if (subscriptionId == null) {
            call.reject("Subscription ID is required");
            return;
        }

        // Primero obtenemos los detalles de la suscripción
        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        productList.add(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId(subscriptionId)
                .setProductType(BillingClient.ProductType.SUBS)
                .build()
        );

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
            .setProductList(productList)
            .build();

        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && !productDetailsList.isEmpty()) {
                ProductDetails productDetails = productDetailsList.get(0);
                
                if (productDetails.getSubscriptionOfferDetails() != null && !productDetails.getSubscriptionOfferDetails().isEmpty()) {
                    ProductDetails.SubscriptionOfferDetails offerDetails = productDetails.getSubscriptionOfferDetails().get(0);
                    
                    BillingFlowParams.ProductDetailsParams productDetailsParams = BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(productDetails)
                        .setOfferToken(offerDetails.getOfferToken())
                        .build();

                    List<BillingFlowParams.ProductDetailsParams> productDetailsParamsList = new ArrayList<>();
                    productDetailsParamsList.add(productDetailsParams);

                    BillingFlowParams billingFlowParams = BillingFlowParams.newBuilder()
                        .setProductDetailsParamsList(productDetailsParamsList)
                        .build();

                    Activity activity = getActivity();
                    BillingResult result = billingClient.launchBillingFlow(activity, billingFlowParams);
                    
                    if (result.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                        // El resultado se manejará en onPurchasesUpdated
                        JSObject ret = new JSObject();
                        ret.put("success", true);
                        ret.put("message", "Subscription flow started");
                        call.resolve(ret);
                    } else {
                        call.reject("Failed to start subscription flow: " + result.getDebugMessage());
                    }
                } else {
                    call.reject("No subscription offers available");
                }
            } else {
                call.reject("Subscription not found or failed to get subscription details");
            }
        });
    }

    @PluginMethod
    public void getPurchases(PluginCall call) {
        if (!isServiceConnected) {
            call.reject("Billing service not connected");
            return;
        }

        QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
            .setProductType(BillingClient.ProductType.INAPP)
            .build();

        billingClient.queryPurchasesAsync(params, (billingResult, purchases) -> {
            JSObject ret = new JSObject();
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                JSArray purchaseArray = new JSArray();
                for (Purchase purchase : purchases) {
                    JSObject purchaseObj = new JSObject();
                    purchaseObj.put("orderId", purchase.getOrderId());
                    purchaseObj.put("packageName", purchase.getPackageName());
                    purchaseObj.put("productId", purchase.getProducts().get(0));
                    purchaseObj.put("purchaseTime", purchase.getPurchaseTime());
                    purchaseObj.put("purchaseState", purchase.getPurchaseState());
                    purchaseObj.put("purchaseToken", purchase.getPurchaseToken());
                    purchaseObj.put("isAcknowledged", purchase.isAcknowledged());
                    purchaseArray.put(purchaseObj);
                }
                ret.put("purchases", purchaseArray);
                call.resolve(ret);
            } else {
                call.reject("Failed to get purchases: " + billingResult.getDebugMessage());
            }
        });
    }

    @PluginMethod
    public void getActiveSubscriptions(PluginCall call) {
        if (!isServiceConnected) {
            call.reject("Billing service not connected");
            return;
        }

        QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
            .setProductType(BillingClient.ProductType.SUBS)
            .build();

        billingClient.queryPurchasesAsync(params, (billingResult, purchases) -> {
            JSObject ret = new JSObject();
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                JSArray subscriptionArray = new JSArray();
                for (Purchase purchase : purchases) {
                    if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                        JSObject subscriptionObj = new JSObject();
                        subscriptionObj.put("orderId", purchase.getOrderId());
                        subscriptionObj.put("packageName", purchase.getPackageName());
                        subscriptionObj.put("productId", purchase.getProducts().get(0));
                        subscriptionObj.put("purchaseTime", purchase.getPurchaseTime());
                        subscriptionObj.put("purchaseState", purchase.getPurchaseState());
                        subscriptionObj.put("purchaseToken", purchase.getPurchaseToken());
                        subscriptionObj.put("isAcknowledged", purchase.isAcknowledged());
                        subscriptionObj.put("isAutoRenewing", purchase.isAutoRenewing());
                        subscriptionArray.put(subscriptionObj);
                    }
                }
                ret.put("activeSubscriptions", subscriptionArray);
                call.resolve(ret);
            } else {
                call.reject("Failed to get active subscriptions: " + billingResult.getDebugMessage());
            }
        });
    }

    @PluginMethod
    public void disconnect(PluginCall call) {
        if (billingClient != null && billingClient.isReady()) {
            billingClient.endConnection();
            isServiceConnected = false;
        }
        
        JSObject ret = new JSObject();
        ret.put("success", true);
        ret.put("message", "Billing client disconnected");
        call.resolve(ret);
    }

    @Override
    public void onPurchasesUpdated(BillingResult billingResult, List<Purchase> purchases) {
        JSObject data = new JSObject();
        
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            JSArray purchaseArray = new JSArray();
            for (Purchase purchase : purchases) {
                JSObject purchaseObj = new JSObject();
                purchaseObj.put("orderId", purchase.getOrderId());
                purchaseObj.put("packageName", purchase.getPackageName());
                purchaseObj.put("productId", purchase.getProducts().get(0));
                purchaseObj.put("purchaseTime", purchase.getPurchaseTime());
                purchaseObj.put("purchaseState", purchase.getPurchaseState());
                purchaseObj.put("purchaseToken", purchase.getPurchaseToken());
                purchaseObj.put("isAcknowledged", purchase.isAcknowledged());
                if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                    purchaseObj.put("isAutoRenewing", purchase.isAutoRenewing());
                }
                purchaseArray.put(purchaseObj);
            }
            data.put("purchases", purchaseArray);
            data.put("success", true);
        } else {
            data.put("success", false);
            data.put("error", billingResult.getDebugMessage());
            data.put("responseCode", billingResult.getResponseCode());
        }
        
        // Enviar evento a JavaScript
        notifyListeners("purchaseUpdated", data);
        
        Log.d(TAG, "Purchase updated: " + billingResult.getResponseCode());
    }
}
