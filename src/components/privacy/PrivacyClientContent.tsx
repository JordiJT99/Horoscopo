
'use client';

import { useState } from 'react';
import type { Dictionary } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Shield, Trash2, Mail, FileText, Eye, Database, Globe, Users, Lock, AlertTriangle } from 'lucide-react';

interface PrivacyClientContentProps {
    dictionary: Dictionary;
}

export default function PrivacyClientContent({ dictionary }: PrivacyClientContentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    reason: '',
    additionalInfo: ''
  });
  
  const privacyDict = dictionary.PrivacyPolicy || {};

  const handleDeleteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simular envío - aquí implementarías la lógica real
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: privacyDict.toast?.requestSentTitle || "Request Sent",
        description: privacyDict.toast?.requestSentDescription || "Your deletion request has been received. We will contact you within 30 days.",
      });
      
      setFormData({ email: '', reason: '', additionalInfo: '' });
    } catch (error) {
      toast({
        title: privacyDict.toast?.errorTitle || "Error",
        description: privacyDict.toast?.errorDescription || "Could not send request. Please try again.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Database className="w-6 w-6" />
            {privacyDict.informationWeCollect?.title || "Information We Collect"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-card-foreground/80">{privacyDict.informationWeCollect?.content || "We collect info to provide and improve our services."}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Eye className="w-6 w-6" />
            {privacyDict.howWeUseInformation?.title || "How We Use Your Information"}
          </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-card-foreground/80">{privacyDict.howWeUseInformation?.content || "Your information is used to personalize your experience and improve the app."}</p>
        </CardContent>
      </Card>

      <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <AlertTriangle className="w-6 w-6" />
            {privacyDict.advertising?.title || "Advertising and AdMob"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <p className="text-sm text-card-foreground/80">{privacyDict.advertising?.content || "We use AdMob to show ads, which may collect data to personalize them."}</p>
        </CardContent>
      </Card>

      <Card className="bg-card/70 backdrop-blur-sm border-red-500/30 shadow-xl">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            {privacyDict.deleteRequest?.title || "Delete My Account and Data"}
          </CardTitle>
          <CardDescription>
            {privacyDict.deleteRequest?.description || "Request the complete deletion of your account and all associated data."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDeleteRequest} className="space-y-4">
            <div>
              <Label htmlFor="email">{privacyDict.deleteRequest?.emailLabel || "Account Email"}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your-email@example.com"
                required
                className="bg-black/30 border-primary/50"
              />
            </div>
            
            <div>
              <Label htmlFor="reason">{privacyDict.deleteRequest?.reasonLabel || "Reason for Deletion"}</Label>
              <select
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
                className="w-full p-2 bg-black/30 border border-primary/50 rounded-md"
              >
                <option value="">{privacyDict.deleteRequest?.reasonSelect || "Select a reason"}</option>
                <option value="no_longer_using">{privacyDict.deleteRequest?.reasonOptions?.no_longer_using || "No longer using the app"}</option>
                <option value="privacy_concerns">{privacyDict.deleteRequest?.reasonOptions?.privacy_concerns || "Privacy concerns"}</option>
                <option value="found_alternative">{privacyDict.deleteRequest?.reasonOptions?.found_alternative || "Found an alternative"}</option>
                <option value="technical_issues">{privacyDict.deleteRequest?.reasonOptions?.technical_issues || "Technical issues"}</option>
                <option value="other">{privacyDict.deleteRequest?.reasonOptions?.other || "Other"}</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="additionalInfo">{privacyDict.deleteRequest?.additionalInfoLabel || "Additional Info (Optional)"}</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                placeholder={privacyDict.deleteRequest?.additionalInfoPlaceholder || "Provide more details if you wish..."}
                className="bg-black/30 border-primary/50"
                rows={4}
              />
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 text-sm" dangerouslySetInnerHTML={{ __html: privacyDict.deleteRequest?.warning || "<strong>Warning:</strong> This action will permanently delete your account and all associated data. This process cannot be undone. We will process your request within 30 days."}} />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>{privacyDict.deleteRequest?.submittingButton || "Sending request..."}</>
              ) : (
                <><Trash2 className="w-4 h-4 mr-2" />{privacyDict.deleteRequest?.submitButton || "Request Data Deletion"}</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Mail className="w-5 h-5" />
            {privacyDict.contactUs?.title || "Contact for Privacy"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{privacyDict.contactUs?.description || "If you have questions about your privacy or data handling, you can contact us:"}</p>
          <div className="space-y-2">
            <p><strong>Email:</strong> <a href="mailto:jordi.jordi.jordi9@gmail.com" className="text-primary hover:underline">jordi.jordi.jordi9@gmail.com</a></p>
            <p><strong>{privacyDict.contactUs?.responseTimeLabel || "Response time:"}</strong> {privacyDict.contactUs?.responseTimeValue || "Within 48 hours"}</p>
            <p><strong>{privacyDict.contactUs?.deletionTimeLabel || "Data deletion:"}</strong> {privacyDict.contactUs?.deletionTimeValue || "Processed within 30 days"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
