// Test endpoint to verify Google Play API initialization
import { NextRequest, NextResponse } from 'next/server';
import { googlePlayAPI } from '@/app/api/billing/google-play-api';

export async function GET(request: NextRequest) {
  try {
    console.log('[test-google-play] Testing Google Play API initialization...');
    
    // Try to use the Google Play API with a dummy call to see if it initializes
    try {
      // This will trigger the initialization
      const result = await googlePlayAPI.verifySubscription('test_subscription_id', 'test_token');
      
      // We expect this to fail with a proper Google API error, not an initialization error
      return NextResponse.json({
        success: true,
        message: 'Google Play API initialized successfully',
        result: result,
      });
    } catch (error: any) {
      // Check if it's an authentication/initialization error vs a normal Google API error
      if (error.message?.includes('Service account file not found') || 
          error.message?.includes('Failed to initialize') ||
          error.message?.includes('auth') ||
          error.code === 'ENOENT') {
        return NextResponse.json({
          success: false,
          error: 'Google Play API initialization failed',
          details: error.message,
        }, { status: 500 });
      } else {
        // This is expected - Google API rejecting our test call, but API is properly initialized
        return NextResponse.json({
          success: true,
          message: 'Google Play API initialized successfully (test call rejected as expected)',
          apiError: error.message,
        });
      }
    }
  } catch (error: any) {
    console.error('[test-google-play] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error.message,
    }, { status: 500 });
  }
}
