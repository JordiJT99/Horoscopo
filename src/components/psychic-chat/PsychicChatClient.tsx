'use client';

import { useEffect, useRef, useState } from 'react';
import { psychicChat } from '@/ai/flows/psychic-chat-flow';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, UserCircle } from 'lucide-react';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { useAuth } from '@/context/AuthContext';

interface Message {
  type: 'user' | 'ai';
  text: string;
}

interface PsychicChatClientProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function PsychicChatClient({ dictionary, locale }: PsychicChatClientProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (scrollAreaRef.current) {
        const scrollEl = scrollAreaRef.current.querySelector('div'); // The viewport
        if(scrollEl) {
            scrollEl.scrollTop = scrollEl.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    const userMessage: Message = { type: 'user', text: prompt };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setLoading(true);
    const currentPrompt = prompt;
    setPrompt('');

    try {
      const userName = user?.displayName || undefined;
      // Pass prompt, locale, and now userName as arguments
      const aiResponse = await psychicChat(currentPrompt, locale, userName);
      const aiMessage: Message = { type: 'ai', text: aiResponse };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error generating psychic response:', error);
      const errorMessage: Message = {
        type: 'ai',
        text: dictionary['Error.genericTitle'] || 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const userInitial = user?.displayName?.charAt(0).toUpperCase() || <UserCircle size={18} />;

  return (
    <Card className="flex flex-col h-full bg-card/70 backdrop-blur-sm border-border/30 shadow-lg rounded-xl">
      <CardContent className="flex flex-col flex-grow p-4">
        <ScrollArea ref={scrollAreaRef} className="flex-grow pr-4 -mr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'ai' && (
                  <Avatar className="w-8 h-8 border-2 border-primary/50">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      <Sparkles size={18} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-lg'
                      : 'bg-secondary text-secondary-foreground rounded-bl-lg'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
                {message.type === 'user' && (
                    <Avatar className="w-8 h-8">
                        <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3">
                 <Avatar className="w-8 h-8 border-2 border-primary/50">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    <Sparkles size={18} />
                  </AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-2xl bg-secondary text-secondary-foreground rounded-bl-lg">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex mt-4 pt-4 border-t border-border/30">
          <Input
            className="flex-grow mr-2 bg-input/50"
            placeholder={dictionary['PsychicChatClient.inputPlaceholder'] || "Ask me anything..."}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleSendMessage();
              }
            }}
            disabled={loading}
          />
          <Button onClick={handleSendMessage} disabled={loading || !prompt.trim()}>
            <Send size={18} />
            <span className="sr-only">{dictionary['PsychicChatClient.sendButton'] || "Send"}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
