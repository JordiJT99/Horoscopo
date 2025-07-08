'use client';

import { useState } from 'react';
import type { Dictionary } from '@/lib/dictionaries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';

interface NotificationFormProps {
  dictionary: Dictionary;
  action: (formData: FormData) => Promise<{ success: boolean; message: string }>;
}

export default function NotificationForm({ dictionary, action }: NotificationFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget; // Store a reference to the form
    setIsLoading(true);
    
    const formData = new FormData(form);
    const result = await action(formData);
    
    setIsLoading(false);
    
    toast({
      title: result.success ? (dictionary.Admin?.toastSuccessTitle || 'Success') : (dictionary.Admin?.toastErrorTitle || 'Error'),
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });

    if (result.success) {
      form.reset(); // Reset the form using the stored reference
    }
  };

  return (
    <Card className="max-w-xl mx-auto bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>{dictionary.Admin?.formTitle || 'Compose Notification'}</CardTitle>
        <CardDescription>{dictionary.Admin?.formDescription || 'This message will be sent to all subscribed users.'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">{dictionary.Admin?.labelTitle || 'Title'}</Label>
            <Input id="title" name="title" required placeholder={dictionary.Admin?.placeholderTitle || 'e.g., Your daily horoscope is ready!'} />
          </div>
          <div>
            <Label htmlFor="body">{dictionary.Admin?.labelBody || 'Body'}</Label>
            <Input id="body" name="body" required placeholder={dictionary.Admin?.placeholderBody || 'Tap to see what the stars have in store for you.'} />
          </div>
          <div>
            <Label htmlFor="path">{dictionary.Admin?.labelPath || 'Path'}</Label>
            <Input id="path" name="path" required defaultValue="/" placeholder={dictionary.Admin?.placeholderPath || 'e.g., /tarot-reading'} />
            <p className="text-xs text-muted-foreground mt-1">{dictionary.Admin?.pathDescription || 'The relative path to open (e.g., /tarot-reading). Use / for the homepage.'}</p>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                {dictionary.Admin?.buttonSending || 'Sending...'}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {dictionary.Admin?.buttonSend || 'Send Notification'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
