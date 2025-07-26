'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Shield, Trash2, Mail, FileText, Eye, Database, Globe, Users, Lock, AlertTriangle } from 'lucide-react';

export default function PrivacyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    reason: '',
    additionalInfo: ''
  });

  const handleDeleteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simular envío - aquí implementarías la lógica real
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud de eliminación ha sido recibida. Te contactaremos dentro de 30 días.",
      });
      
      setFormData({ email: '', reason: '', additionalInfo: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la solicitud. Intenta de nuevo.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="text-center bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
          <CardHeader>
            <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit mb-4">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline text-primary">
              Política de Privacidad
            </CardTitle>
            <CardDescription className="text-lg text-card-foreground/80">
              Tu privacidad es importante para nosotros. Aquí te explicamos cómo protegemos tus datos.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Información que recopilamos */}
        <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Database className="w-6 w-6" />
              Información que Recopilamos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">📊 Datos de Uso</h4>
                <ul className="text-sm space-y-1">
                  <li>• Signos zodiacales consultados</li>
                  <li>• Frecuencia de uso de la aplicación</li>
                  <li>• Preferencias de horóscopos</li>
                  <li>• Interacciones con contenido</li>
                </ul>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">👤 Información Personal</h4>
                <ul className="text-sm space-y-1">
                  <li>• Email (opcional)</li>
                  <li>• Datos de perfil astronómico</li>
                  <li>• Preferencias de configuración</li>
                  <li>• Historial de consultas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Uso de los datos */}
        <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Eye className="w-6 w-6" />
              Cómo Usamos tus Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Personalización</h4>
                <p className="text-sm mt-1">
                  Adaptamos el contenido a tus preferencias astrológicas
                </p>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Mejoras</h4>
                <p className="text-sm mt-1">
                  Analizamos el uso para mejorar nuestros servicios
                </p>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Seguridad</h4>
                <p className="text-sm mt-1">
                  Protegemos tu cuenta y prevenimos el uso indebido
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AdMob y Publicidad */}
        <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <AlertTriangle className="w-6 w-6" />
              Publicidad y AdMob
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <h4 className="font-semibold mb-2">📱 Google AdMob</h4>
              <p className="text-sm mb-2">
                Utilizamos Google AdMob para mostrar anuncios en nuestra aplicación móvil. AdMob puede recopilar y usar información para:
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Mostrar anuncios relevantes basados en tus intereses</li>
                <li>• Analizar el rendimiento de los anuncios</li>
                <li>• Proporcionar funciones de medición</li>
              </ul>
            </div>
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h4 className="font-semibold mb-2">⚙️ Control de Anuncios</h4>
              <p className="text-sm">
                Puedes gestionar tus preferencias de anuncios en la configuración de Google en tu dispositivo. 
                También puedes optar por no recibir anuncios personalizados según tus intereses.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de eliminación de datos */}
        <Card className="bg-card/70 backdrop-blur-sm border-red-500/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Eliminar mi cuenta y datos
            </CardTitle>
            <CardDescription>
              Solicita la eliminación completa de tu cuenta y todos los datos asociados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDeleteRequest} className="space-y-4">
              <div>
                <Label htmlFor="email">Email de la cuenta</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu-email@ejemplo.com"
                  required
                  className="bg-black/30 border-primary/50"
                />
              </div>
              
              <div>
                <Label htmlFor="reason">Motivo de eliminación</Label>
                <select
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  className="w-full p-2 bg-black/30 border border-primary/50 rounded-md"
                >
                  <option value="">Selecciona un motivo</option>
                  <option value="no_longer_using">Ya no uso la aplicación</option>
                  <option value="privacy_concerns">Preocupaciones de privacidad</option>
                  <option value="found_alternative">Encontré una alternativa</option>
                  <option value="technical_issues">Problemas técnicos</option>
                  <option value="other">Otro motivo</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="additionalInfo">Información adicional (opcional)</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  placeholder="Proporciona detalles adicionales si lo deseas..."
                  className="bg-black/30 border-primary/50"
                  rows={4}
                />
              </div>
              
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 text-sm">
                  <strong>Advertencia:</strong><br />
                  Esta acción eliminará permanentemente tu cuenta y todos los datos asociados. 
                  Este proceso no se puede deshacer. Procesaremos tu solicitud dentro de 30 días.
                </p>
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? (
                  <>Enviando solicitud...</>
                ) : (
                  <><Trash2 className="w-4 h-4 mr-2" />Solicitar eliminación de datos</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contacto */}
        <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Mail className="w-5 h-5" />
              Contacto para Privacidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Si tienes preguntas sobre tu privacidad o el manejo de datos, puedes contactarnos:</p>
            <div className="space-y-2">
              <p><strong>Email:</strong> <a href="mailto:jordi.jordi.jordi9@gmail.com" className="text-primary hover:underline">jordi.jordi.jordi9@gmail.com</a></p>
              <p><strong>Tiempo de respuesta:</strong> Dentro de 48 horas</p>
              <p><strong>Eliminación de datos:</strong> Procesada dentro de 30 días</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
