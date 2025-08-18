
'use client';

import { useState } from 'react';
import type { Dictionary } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Shield, Trash2, Mail, FileText, Eye, Database, Globe, Users, Lock, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useCapacitor } from '@/hooks/use-capacitor';

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
  const { openUrl, isCapacitor } = useCapacitor();
  
  const privacyDict = dictionary.PrivacyPolicy || {};

  const handleContactEmail = () => {
    const email = 'jordi.jordi.jordi9@gmail.com';
    const subject = encodeURIComponent(privacyDict.deleteRequest?.emailSubject || "Solicitud de Eliminación de Datos - AstroMística");
    
    if (isCapacitor) {
      // En móvil: mostrar instrucciones claras
      toast({
        title: privacyDict.deleteRequest?.contactTitle || "Contacto para Eliminación de Datos",
        description: `${privacyDict.deleteRequest?.contactInstructions || "Envía un correo a:"} ${email}`,
        duration: 5000,
      });
    } else {
      // En web: abrir cliente de correo
      const mailtoLink = `mailto:${email}?subject=${subject}`;
      window.open(mailtoLink, '_blank');
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
        <CardContent className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 text-sm" dangerouslySetInnerHTML={{ __html: privacyDict.deleteRequest?.warning || "<strong>Warning:</strong> This action will permanently delete your account and all associated data. This process cannot be undone. We will process your request within 30 days."}} />
          </div>
          
          <div className="bg-card/50 border border-primary/30 rounded-lg p-4 space-y-3">
            <h4 className="text-primary font-medium">Contact Information</h4>
            <p className="text-sm text-card-foreground/80">
              To request data deletion, please contact us at:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm font-mono bg-black/30 px-2 py-1 rounded">
                  astromistica.horoscopes@gmail.com
                </span>
              </div>
            </div>
            <p className="text-xs text-card-foreground/60">
              Include your account email and reason for deletion in your message.
            </p>
          </div>
          
          <Button 
            onClick={handleContactEmail}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <Mail className="w-4 h-4 mr-2" />
            {privacyDict.deleteRequest?.contactButton || "Contact Us for Data Deletion"}
          </Button>
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
