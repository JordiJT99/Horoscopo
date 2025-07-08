
'use server';

import { ai } from '@/ai/genkit';
import { defineFlow } from 'genkit/flow';
import { z } from 'zod';
import { adminDb, adminMessaging } from '@/lib/firebase-admin';
import type { CollectionReference, DocumentData } from 'firebase-admin/firestore';

const SendNotificationInputSchema = z.object({
  title: z.string().describe('The title of the notification.'),
  body: z.string().describe('The main content (body) of the notification.'),
  locale: z.enum(['es', 'en', 'de', 'fr']).default('es').describe('The locale to build the link path.'),
  path: z.string().default('/').describe('The path to open when the notification is clicked (e.g., /daily-horoscope).'),
});
export type SendNotificationInput = z.infer<typeof SendNotificationInputSchema>;

export const sendNotificationFlow = ai.defineFlow(
  {
    name: 'sendNotificationFlow',
    inputSchema: SendNotificationInputSchema,
    outputSchema: z.object({
      successCount: z.number(),
      failureCount: z.number(),
      error: z.string().optional(),
    }),
  },
  async (input) => {
    if (!adminDb || !adminMessaging) {
      const errorMsg = 'Firebase Admin SDK not initialized. Cannot send notifications.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    let tokens: string[];
    try {
        const tokensSnapshot = await (adminDb.collection('fcmTokens') as CollectionReference<DocumentData>).get();
        if (tokensSnapshot.empty) {
            console.log("No FCM tokens found in the database. No notifications will be sent.");
            return { successCount: 0, failureCount: 0 };
        }
        const allTokens = tokensSnapshot.docs.map(doc => doc.data().token).filter(Boolean);
        tokens = [...new Set(allTokens)]; // Remove duplicates
        console.log(`Found ${tokens.length} unique tokens to send notifications to.`);

    } catch (e: any) {
        console.error("Error fetching FCM tokens:", e);
        return { successCount: 0, failureCount: 0, error: `Failed to fetch tokens: ${e.message}` };
    }

    if (tokens.length === 0) {
      return { successCount: 0, failureCount: 0 };
    }

    const message = {
      notification: {
        title: input.title,
        body: input.body,
      },
      webpush: {
        notification: {
          icon: '/custom_assets/logo_192.png',
        },
        fcm_options: {
          link: `/${input.locale}${input.path}`,
        },
      },
      tokens: tokens,
    };

    try {
        const response = await adminMessaging.sendEachForMulticast(message);
        console.log(`Notifications sent: ${response.successCount} success, ${response.failureCount} failure.`);

        if (response.failureCount > 0) {
            // Optional: Logic to clean up invalid tokens
        }
        
        return {
            successCount: response.successCount,
            failureCount: response.failureCount,
        };
    } catch (e: any) {
        console.error("Error sending multicast message:", e);
        return { successCount: 0, failureCount: tokens.length, error: `Failed to send messages: ${e.message}` };
    }
  }
);
