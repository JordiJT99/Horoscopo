
'use server';

import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import NotificationForm from '@/components/admin/NotificationForm';
import { sendNotificationFlow } from '@/ai/flows/send-notification-flow';
import type { SendNotificationInput } from '@/ai/flows/send-notification-flow';
import SectionTitle from '@/components/shared/SectionTitle';
import { BellRing } from 'lucide-react';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({ locale }));
}

interface AdminNotificationsPageProps {
  params: {
    locale: Locale;
  };
}

// The 'locale' parameter now comes first, to allow binding it.
export async function handleSendNotification(locale: Locale, formData: FormData) {
  'use server';

  const input: SendNotificationInput = {
    title: formData.get('title') as string,
    body: formData.get('body') as string,
    path: formData.get('path') as string,
    locale: locale,
  };

  try {
    const result = await sendNotificationFlow(input);
    if (result.error) {
      throw new Error(result.error);
    }
    const successMessage =
      (await getDictionary(locale)).Admin?.toastSuccessMessage ||
      `Successfully sent {successCount} notifications. {failureCount} failed.`;
    return {
      success: true,
      message: successMessage
        .replace('{successCount}', result.successCount.toString())
        .replace('{failureCount}', result.failureCount.toString()),
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to send notifications: ${error.message}`,
    };
  }
}

export default async function AdminNotificationsPage({ params }: AdminNotificationsPageProps) {
  const dictionary = await getDictionary(params.locale);

  // We bind the `locale` parameter to our Server Action here.
  // This creates a new function that only needs `formData`, which is safe to pass to a Client Component.
  const sendNotificationWithLocale = handleSendNotification.bind(null, params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary.Admin?.title || 'Admin Panel'}
        subtitle={dictionary.Admin?.subtitle || 'Send Push Notifications'}
        icon={BellRing}
        className="mb-8"
      />
      <NotificationForm
        dictionary={dictionary}
        action={sendNotificationWithLocale}
      />
    </main>
  );
}
