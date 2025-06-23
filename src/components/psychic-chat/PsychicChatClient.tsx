'use client';

import { useState } from 'react';
import { generate } from '@genkit-ai/react';

interface Message {
  type: 'user' | 'ai';
  text: string;
}

export default function PsychicChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    const userMessage: Message = { type: 'user', text: prompt };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setPrompt('');
    setLoading(true);

    try {
      const aiResponse = await generate({
        flow: 'psychicChatFlow', // Assuming 'psychicChatFlow' is registered
        prompt: prompt,
      });

      const aiMessage: Message = { type: 'ai', text: aiResponse.text() };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error generating psychic response:', error);
      const errorMessage: Message = {
        type: 'ai',
        text: 'Sorry, I encountered an error while getting your reading. Please try again.',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${
              message.type === 'user'
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-200 text-gray-800 self-start'
            }`}
          >
            {message.text}
          </div>
        ))}
        {loading && (
          <div className="mb-2 p-2 rounded-lg bg-gray-200 text-gray-800 self-start">
            ...
          </div>
        )}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask me anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          disabled={loading}
        />
        <button
          className="bg-blue-500 text-white rounded-r-lg px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}