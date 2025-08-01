"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Psychic } from '@/lib/psychics';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { psychicChat } from '@/ai/flows/psychic-chat-flow';
import type { ChatMessage } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, UserCircle, Gem, Clapperboard, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import { useAdMob } from '@/hooks/use-admob-ads';

const MESSAGE_COST = 1;

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

interface PsychicChatUIProps {
  psychic: Psychic;
  dictionary: Dictionary;
  locale: Locale;
}

const TopicSelector = ({ dictionary, onTopicSelect, psychic }: { dictionary: Dictionary, onTopicSelect: (topicKey: string, topicName: string) => void, psychic: Psychic }) => {
  const topicKeys = [
    'PsychicTopic.loveRelationships',
    'PsychicTopic.careerFinance',
    'PsychicTopic.healthWellbeing',
    'PsychicTopic.spiritualGrowth',
    'PsychicTopic.generalReading',
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <Avatar className="w-24 h-24 mb-4 border-4 border-primary/50 shadow-lg">
        <AvatarImage src={psychic.image} alt={psychic.name} />
        <AvatarFallback>{psychic.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <h2 className="text-xl font-semibold mb-2 font-headline">{psychic.name}</h2>
      <p className="text-sm text-muted-foreground mb-6 italic">"{dictionary[psychic.phrase] || psychic.phrase}"</p>
      
      <h3 className="text-lg font-semibold mb-4 font-body">{dictionary['PsychicChatPage.selectTopicTitle'] || 'Select a Topic to Begin'}</h3>
      <div className="flex flex-wrap justify-center gap-3">
        {topicKeys.map((key) => {
          const topicName = dictionary[key] || key;
          return (
            <Button key={key} variant="outline" onClick={() => onTopicSelect(key, topicName)}>
              {topicName}
            </Button>
          );
        })}
      </div>
    </div>
  );
};


export default function PsychicChatUI({ psychic, dictionary, locale }: PsychicChatUIProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTopic, setSelectedTopic] = useState<{ key: string, name: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { stardust, spendStardust, addStardust } = useCosmicEnergy();
  const { showRewardedAd } = useAdMob();
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const [isFirstMessageSent, setIsFirstMessageSent] = useState(false);

  const topicKeyMapping: { [key: string]: string } = {
    'love': 'PsychicTopic.loveRelationships',
    'career': 'PsychicTopic.careerFinance',
    'personal_growth': 'PsychicTopic.spiritualGrowth',
    'general': 'PsychicTopic.generalReading',
  };

  const handleTopicSelect = useCallback((topicKey: string, topicName: string) => {
    let initialMessage = (dictionary['PsychicChatPage.initialMessage'] || "Hello! I am {psychicName}. Let's discuss \"{topicName}\". How can I help you today?")
      .replace('{psychicName}', psychic.name)
      .replace('{topicName}', topicName);
    
    setMessages([{ text: initialMessage, sender: 'ai' }]);
    setSelectedTopic({ key: topicKey, name: topicName });
  }, [dictionary, psychic.name]);

  useEffect(() => {
    const topicFromQuery = searchParams.get('topic');
    if (topicFromQuery && topicKeyMapping[topicFromQuery]) {
        const topicDictKey = topicKeyMapping[topicFromQuery];
        const topicName = dictionary[topicDictKey] || topicFromQuery;
        if (!selectedTopic) {
            handleTopicSelect(topicDictKey, topicName);
        }
    }
  }, [searchParams, dictionary, selectedTopic, handleTopicSelect]);

  const scrollToBottom = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [messages, isSending]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending || !selectedTopic) return;
    
    if (isFirstMessageSent && stardust < MESSAGE_COST) {
      toast({
        title: "Polvo Estelar Insuficiente",
        description: "Recarga tu polvo estelar para continuar la conversación.",
        variant: "destructive"
      });
      return;
    }

    if (isFirstMessageSent) {
      spendStardust(MESSAGE_COST, 'send_psychic_message');
    }

    const newUserMessage: Message = { text: inputMessage, sender: 'user' };
    const updatedMessagesForUI = [...messages, newUserMessage];
    setMessages(updatedMessagesForUI);
    setInputMessage('');
    setIsSending(true);
    if (!isFirstMessageSent) {
      setIsFirstMessageSent(true);
    }

    const flowMessages: ChatMessage[] = updatedMessagesForUI.map(msg => ({
        role: msg.sender === 'user' ? ('user' as const) : ('model' as const),
        content: msg.text,
    }));

    try {
      const aiResponse = await psychicChat(
        flowMessages,
        locale,
        psychic.id,
        selectedTopic.name, 
        user?.displayName || undefined
      );
      const newAiMessage: Message = { text: aiResponse, sender: 'ai' };
      
      const randomDelay = Math.floor(Math.random() * 2500) + 1500;
      setTimeout(() => {
        setMessages(prev => [...prev, newAiMessage]);
        setIsSending(false);
      }, randomDelay);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: dictionary['Error.genericTitle'] || "Error",
        description: dictionary['PsychicChatPage.sendMessageError'] || 'Error connecting to the psychic.',
        variant: 'destructive',
      });
      setIsSending(false);
    }
  };

  const handleWatchAd = async () => {
    setIsAdPlaying(true);
    try {
      const reward = await showRewardedAd();
      if (reward) {
        const adReward = 1; // 1 Stardust por ver un anuncio
        addStardust(adReward);
        toast({
          title: "¡Recompensa Obtenida!",
          description: `Has ganado ${adReward} de Polvo Estelar.`,
        });
      }
    } catch(err) {
      console.error("Error showing rewarded ad:", err);
      toast({
        title: "Error",
        description: "No se pudo mostrar el anuncio. Inténtalo de nuevo más tarde.",
        variant: "destructive"
      })
    } finally {
      setIsAdPlaying(false);
    }
  }

  const userInitial = user?.displayName?.charAt(0).toUpperCase() || <UserCircle size={18} />;
  const psychicInitial = psychic.name.charAt(0);
  
  const hasEnoughStardust = stardust >= MESSAGE_COST;

  if (!selectedTopic) {
    return <TopicSelector dictionary={dictionary} onTopicSelect={handleTopicSelect} psychic={psychic} />;
  }

  return (
    <Card className="flex flex-col h-full bg-card/70 backdrop-blur-sm border-border/30 shadow-lg rounded-xl overflow-hidden">
      <div className="p-2 border-b border-border/30 text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
           <Gem className="w-4 h-4 text-cyan-400"/>
           <span>{stardust} {dictionary['CosmicEnergy.stardust'] || 'Stardust'}</span>
        </div>
      </div>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1" viewportRef={scrollViewportRef}>
          <div className="p-2 sm:p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn('flex items-end gap-2', message.sender === 'user' ? 'justify-end' : 'justify-start')}
              >
                {message.sender === 'ai' && (
                  <Avatar className="w-8 h-8 border-2 border-primary/50 self-start">
                    <AvatarImage src={psychic.image} alt={psychic.name} />
                    <AvatarFallback className="bg-primary/20 text-primary">{psychicInitial}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs md:max-w-md p-3 rounded-2xl text-sm leading-relaxed',
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-secondary text-secondary-foreground rounded-bl-none'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="w-8 h-8 self-start">
                     <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'}/>
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isSending && (
              <div className="flex items-end gap-2 justify-start">
                 <Avatar className="w-8 h-8 border-2 border-primary/50 self-start">
                    <AvatarImage src={psychic.image} alt={psychic.name} />
                    <AvatarFallback className="bg-primary/20 text-primary">{psychicInitial}</AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-2xl bg-secondary text-secondary-foreground rounded-bl-none">
                  <div className="flex items-center space-x-1">
                    <LoadingSpinner className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <div className="p-2 sm:p-3 border-t border-border/30 bg-background/50">
        { (isFirstMessageSent && !hasEnoughStardust) ? (
          <div className="w-full flex flex-col items-center justify-center gap-2 p-4 text-center bg-destructive/10 rounded-lg">
             <p className="font-semibold text-destructive">¡Polvo Estelar Insuficiente!</p>
             <p className="text-xs text-muted-foreground">Recarga para seguir chateando.</p>
             <div className="flex gap-2 mt-2">
                <Button onClick={handleWatchAd} variant="outline" disabled={isAdPlaying}>
                    <Clapperboard className="mr-2 h-4 w-4"/>
                    {isAdPlaying ? "Cargando..." : "Ver Anuncio (+1 💫)"}
                </Button>
                <Button onClick={() => router.push(`/${locale}/get-stardust`)}>
                    <ShoppingBag className="mr-2 h-4 w-4"/>
                    Obtener Polvo Estelar
                </Button>
             </div>
          </div>
        ) : (
          <div className="flex items-center">
             <Input
              className="flex-grow mr-2 bg-input/50"
              placeholder={dictionary['PsychicChatClient.inputPlaceholder'] || 'Type your message...'}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isSending) {
                  handleSendMessage();
                }
              }}
              disabled={isSending}
            />
            <Button onClick={handleSendMessage} disabled={isSending || !inputMessage.trim()} size="icon">
              {isSending ? <LoadingSpinner className="h-4 w-4" /> : <Send size={18} />}
              <span className="sr-only">{dictionary['PsychicChatClient.sendButton'] || 'Send'}</span>
            </Button>
          </div>
        )}
         {isFirstMessageSent && <p className="text-xs text-center text-muted-foreground mt-1.5">{MESSAGE_COST} 💫 / Mensaje</p>}
      </div>
    </Card>
  );
}
