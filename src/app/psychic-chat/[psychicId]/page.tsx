
'use client';

import { useParams } from 'next/navigation';
import { psychics } from '@/lib/psychics';
import { useState } from 'react';
import { psychicChat } from '@/ai/flows/psychic-chat-flow'; // Assuming this is the correct import path
import { useLocale } from 'next-intl';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}
const PsychicChatPage = () => {
  const params = useParams<{ psychicId: string }>();
  const locale = useLocale();
  const { psychicId } = params;

  const psychic = psychics.find((p) => p.id === psychicId);

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics = [
    'Love & Relationships',
    'Career & Finance',
    'Health & Well-being',
    'Spiritual Growth',
    'General Reading',
  ];
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  if (!psychic) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Psychic not found</h1>
        <p>The psychic you are looking for could not be found.</p>
      </div>
    );
  }

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
  };
  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newUserMessage: Message = { text: inputMessage, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage('');

    try {
      // Assuming psychicChat takes locale, psychicId, topic, and prompt
      const aiResponse = await psychicChat(
        inputMessage,
        locale, // Use the actual locale
        undefined, // Pass username if available
        psychicId,
        selectedTopic! // selectedTopic will not be null here
      );
      const newAiMessage: Message = { text: aiResponse, sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { text: 'Error connecting to the psychic.', sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  const startChat = () => {
    if (selectedTopic) {
      console.log(`Starting chat with ${psychic.name} on topic: ${selectedTopic}`);
      // Add an initial message or just transition to the chat
      setMessages([{ text: `Hello! I am ${psychic.name}. Let's discuss "${selectedTopic}". How can I help you today?`, sender: 'ai' }]);

      setChatStarted(true);
    } else {
      alert('Please select a topic to start the chat.');
    }
  };

  return (
 <div className="container mx-auto px-4 py-8">
 <h1 className="text-2xl font-bold mb-4">Chat with {psychic.name}</h1>
 <p className="text-lg mb-6">Specialty: {psychic.specialty}</p>

 {chatStarted ? (
 // Chat interface goes here. You can pass psychic and selectedTopic as props
 <div className="flex flex-col h-[60vh] border p-4 rounded-md">
 <div className="flex-grow overflow-y-auto mb-4">
 {messages.map((msg, index) => (
 <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
 <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
 {msg.text}
 </span>
 </div>
 ))}
 </div>
 <div className="flex">
 <input
 type="text"
 value={inputMessage}
 onChange={(e) => setInputMessage(e.target.value)}
 className="flex-grow border rounded-l-md p-2 focus:outline-none"
 placeholder="Type your message..."
 />
 <button onClick={handleSendMessage} className="bg-blue-500 text-white rounded-r-md px-4 py-2">Send</button>
 </div>
 ) : (
 <>
 <div className="mb-6">
 <h2 className="text-xl font-semibold mb-3">Select a Topic</h2>
 <div className="flex flex-wrap gap-3">
 {topics.map((topic) => (
 <button
 key={topic}
 className={`px-4 py-2 rounded-full border ${selectedTopic === topic ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-200 text-gray-800 border-gray-300'}`}
 onClick={() => handleTopicSelect(topic)}
 >
 {topic}
 </button>
 ))}
 </div>
 </div>

 <button
 className="px-6 py-3 bg-green-500 text-white font-bold rounded-md disabled:opacity-50"
 onClick={startChat}
 disabled={!selectedTopic}
 >
 Start Chat
 </button>
 </>
 )}
 </div>
  );
};

export default PsychicChatPage;