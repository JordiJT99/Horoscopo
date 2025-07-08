
'use client';

import { useState, useEffect } from 'react';
import type { Dictionary } from '@/lib/dictionaries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BellDot } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { requestNotificationPermission, deleteCurrentToken } from '@/lib/firebase-messaging';

interface NotificationSettingsCardProps {
  dictionary: Dictionary;
}

export default function NotificationSettingsCard({ dictionary }: NotificationSettingsCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Check current browser permission state on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      // If permission is already granted, reflect this in the UI
      if (Notification.permission === 'granted') {
          setNotificationsEnabled(true);
      }
    }
  }, []);

  const handleToggleChange = async (enabled: boolean) => {
    if (!user) {
      toast({
        title: dictionary['Auth.notLoggedInTitle'] || "Not Logged In",
        description: dictionary['ProfilePage.loginToSaveSettings'] || "You must be logged in to save settings.",
        variant: 'destructive',
      });
      return;
    }

    if (enabled) {
      // User wants to enable notifications
      try {
        const hasPermission = await requestNotificationPermission();
        if (hasPermission) {
          setNotificationsEnabled(true);
          setPermission('granted');
          toast({
            title: dictionary['Toast.notificationsEnabledTitle'] || "Notifications Enabled",
            description: dictionary['Toast.notificationsEnabledDesc'] || "You will now receive updates from AstroVibes!",
          });
        } else {
          // Permission was denied or dismissed
          setNotificationsEnabled(false);
          setPermission(Notification.permission);
          toast({
            title: dictionary['Toast.notificationsDeniedTitle'] || "Permission Denied",
            description: dictionary['Toast.notificationsDeniedDesc'] || "Please enable notifications in your browser settings to receive updates.",
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        setNotificationsEnabled(false);
        toast({ title: dictionary['Error.genericTitle'], description: (error as Error).message, variant: 'destructive' });
      }
    } else {
      // User wants to disable notifications
      try {
        await deleteCurrentToken(user.uid);
        setNotificationsEnabled(false);
        toast({
            title: dictionary['Toast.notificationsDisabledTitle'] || "Notifications Disabled",
            description: dictionary['Toast.notificationsDisabledDesc'] || "You will no longer receive notifications on this device.",
        });
      } catch(error) {
        console.error("Error deleting token: ", error);
        // Even if token deletion fails, update UI to reflect user's choice
        setNotificationsEnabled(false);
      }
    }
  };
  
  const isPermissionBlocked = permission === 'denied';

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BellDot className="h-5 w-5 text-primary" />
          {dictionary['ProfilePage.notificationsTitle'] || "Notifications"}
        </CardTitle>
        <CardDescription className="text-xs">
          {dictionary['ProfilePage.notificationsDescription'] || "Manage your app alerts."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="mercury-retrograde-switch" className="flex-1">
            {dictionary['ProfilePage.mercuryRetrogradeLabel'] || "Alert for Mercury Retrograde"}
          </Label>
          <Switch
            id="mercury-retrograde-switch"
            checked={notificationsEnabled && !isPermissionBlocked}
            onCheckedChange={handleToggleChange}
            disabled={isPermissionBlocked}
          />
        </div>
        {isPermissionBlocked && (
            <p className="text-xs text-destructive mt-2">
                {dictionary['Toast.notificationsBlockedDesc'] || "Notifications are blocked in your browser. You must enable them in your browser's settings."}
            </p>
        )}
      </CardContent>
    </Card>
  );
}
