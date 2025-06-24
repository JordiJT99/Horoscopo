'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Send, UserCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
  const [selectedTopic, setSelectedTopic] = useState<{ key: string, name: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollViewportRef = useRef<HTMLDivElement>(null);

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

    const newUserMessage: Message = { text: inputMessage, sender: 'user' };
    const updatedMessagesForUI = [...messages, newUserMessage];
    setMessages(updatedMessagesForUI);
    setInputMessage('');
    setIsSending(true);

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
      
      // Artificial delay to simulate typing, now longer and variable
      const randomDelay = Math.floor(Math.random() * 3000) + 3500; // Delay between 2.5 and 4.5 seconds
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
  
  const handleTopicSelect = (topicKey: string, topicName: string) => {
    const initialMessage = (dictionary['PsychicChatPage.initialMessage'] || "Hello! I am {psychicName}. Let's discuss \"{topicName}\". How can I help you today?")
      .replace('{psychicName}', psychic.name)
      .replace('{topicName}', topicName);
    
    setMessages([{ text: initialMessage, sender: 'ai' }]);
    setSelectedTopic({ key: topicKey, name: topicName });
  };
  
  const userInitial = user?.displayName?.charAt(0).toUpperCase() || <UserCircle size={18} />;
  const psychicInitial = psychic.name.charAt(0);

  if (!selectedTopic) {
    return <TopicSelector dictionary={dictionary} onTopicSelect={handleTopicSelect} psychic={psychic} />;
  }

  return (
    <Card className="flex flex-col h-full bg-card/70 backdrop-blur-sm border-border/30 shadow-lg rounded-xl overflow-hidden">
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
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <div className="flex items-center p-2 sm:p-3 border-t border-border/30 bg-background/50">
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
          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={18} />}
          <span className="sr-only">{dictionary['PsychicChatClient.sendButton'] || 'Send'}</span>
        </Button>
      </div>
    </Card>
  );
}
