'use client';

import { useState, useEffect } from 'react';
import type { Dictionary } from '@/lib/dictionaries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BellDot } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettingsCardProps {
  dictionary: Dictionary;
}

export default function NotificationSettingsCard({ dictionary }: NotificationSettingsCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mercuryRetrogradeAlert, setMercuryRetrogradeAlert] = useState(false);

  const storageKey = user ? `notificationSettings_${user.uid}` : null;

  useEffect(() => {
    if (storageKey) {
      const storedSettingsRaw = localStorage.getItem(storageKey);
      if (storedSettingsRaw) {
        try {
          const settings = JSON.parse(storedSettingsRaw);
          setMercuryRetrogradeAlert(settings.mercuryRetrogradeAlert || false);
        } catch (e) {
          console.error("Failed to parse notification settings:", e);
        }
      }
    }
  }, [storageKey]);

  const handleToggleChange = (newValue: boolean) => {
    if (storageKey) {
      setMercuryRetrogradeAlert(newValue);
      const newSettings = { mercuryRetrogradeAlert: newValue };
      localStorage.setItem(storageKey, JSON.stringify(newSettings));
      toast({
        title: dictionary['ProfilePage.settingsSavedTitle'] || "Settings Saved",
        description: dictionary['ProfilePage.notificationPrefsUpdated'] || "Your notification preferences have been updated.",
      });
    } else {
      toast({
        title: dictionary['Auth.notLoggedInTitle'] || "Not Logged In",
        description: dictionary['ProfilePage.loginToSaveSettings'] || "You must be logged in to save settings.",
        variant: 'destructive',
      });
    }
  };

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
            checked={mercuryRetrogradeAlert}
            onCheckedChange={handleToggleChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
