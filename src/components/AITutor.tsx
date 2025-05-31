import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { User } from '../types';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  context?: {
    documentId?: string;
    subject?: string;
    topic?: string;
  };
}

interface AITutorProps {
  user: User;
  currentDocument?: string;
}

export const AITutor: React.FC<AITutorProps> = ({ user, currentDocument }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome! I am your AI Tutor. Use the tools below to get summaries, extract tables, generate quizzes, or visualize workflows. Ask a question or select an option.',
      sender: 'ai',
      timestamp: new Date(),
    },
    {
      id: '2',
      content: 'Sample Q: Can you summarize the process of mitosis?',
      sender: 'user',
      timestamp: new Date(),
    },
    {
      id: '3',
      content: 'Summary: Mitosis is a process where a single cell divides into two identical daughter cells. Stages: Prophase, Metaphase, Anaphase, Telophase.',
      sender: 'ai',
      timestamp: new Date(),
    },
    {
      id: '4',
      content: 'Sample Q: Show me a workflow diagram for the water cycle.',
      sender: 'user',
      timestamp: new Date(),
    },
    {
      id: '5',
      content: '[Workflow Diagram Placeholder: Water Cycle]',
      sender: 'ai',
      timestamp: new Date(),
    },
    {
      id: '6',
      content: 'Sample Q: Extract the table of elements from my Chemistry notes.',
      sender: 'user',
      timestamp: new Date(),
    },
    {
      id: '7',
      content: '[Table Extract Placeholder: Periodic Table]',
      sender: 'ai',
      timestamp: new Date(),
    },
    {
      id: '8',
      content: 'Sample Q: Generate a quiz on World War II.',
      sender: 'user',
      timestamp: new Date(),
    },
    {
      id: '9',
      content: '[Quiz Placeholder: 1. When did WWII start? 2. Name two Allied Powers.]',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<'summarize' | 'table' | 'quiz' | 'workflow' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, `users/${user.uid}/tutor-chats`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      context: currentDocument ? { documentId: currentDocument } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Add user message to Firestore
      await addDoc(collection(db, `users/${user.uid}/tutor-chats`), userMessage);

      // Simulate AI response (replace with actual AI API call)
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I am analyzing your question. This is a simulated response. In production, this would connect to an AI service.',
        sender: 'ai',
        timestamp: new Date(),
        context: userMessage.context
      };

      await addDoc(collection(db, `users/${user.uid}/tutor-chats`), aiResponse);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      <div className="p-4 border-b flex items-center space-x-2">
        <Brain className="w-5 h-5 text-blue-600" />
        <span className="font-medium">AI Tutor</span>
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
      </div>

      {/* Tool Buttons */}
      <div className="flex flex-wrap gap-2 p-4 border-b bg-gray-50">
        <button
          className={`px-3 py-2 rounded text-sm ${activeTool === 'summarize' ? 'bg-blue-200 text-blue-900 font-bold ring-2 ring-blue-400' : 'bg-blue-100 text-blue-800'}`}
          onClick={() => setActiveTool('summarize')}
        >Summarize</button>
        <button
          className={`px-3 py-2 rounded text-sm ${activeTool === 'table' ? 'bg-green-200 text-green-900 font-bold ring-2 ring-green-400' : 'bg-green-100 text-green-800'}`}
          onClick={() => setActiveTool('table')}
        >Extract Table</button>
        <button
          className={`px-3 py-2 rounded text-sm ${activeTool === 'quiz' ? 'bg-purple-200 text-purple-900 font-bold ring-2 ring-purple-400' : 'bg-purple-100 text-purple-800'}`}
          onClick={() => setActiveTool('quiz')}
        >Generate Quiz</button>
        <button
          className={`px-3 py-2 rounded text-sm ${activeTool === 'workflow' ? 'bg-yellow-200 text-yellow-900 font-bold ring-2 ring-yellow-400' : 'bg-yellow-100 text-yellow-800'}`}
          onClick={() => setActiveTool('workflow')}
        >Show Workflow</button>
      </div>

      {/* Tool Output Area */}
      <div className="p-4 border-b min-h-[120px] flex items-center justify-center bg-gray-100">
        {activeTool === 'summarize' && (
          <div className="text-blue-900 text-base">
            <strong>Summary:</strong> Mitosis is a process where a single cell divides into two identical daughter cells. Stages: Prophase, Metaphase, Anaphase, Telophase.
          </div>
        )}
        {activeTool === 'table' && (
          <table className="min-w-[250px] bg-white border rounded shadow text-sm">
            <thead>
              <tr className="bg-green-100">
                <th className="px-2 py-1 border">Element</th>
                <th className="px-2 py-1 border">Symbol</th>
                <th className="px-2 py-1 border">Atomic #</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border px-2">Hydrogen</td><td className="border px-2">H</td><td className="border px-2">1</td></tr>
              <tr><td className="border px-2">Oxygen</td><td className="border px-2">O</td><td className="border px-2">8</td></tr>
              <tr><td className="border px-2">Carbon</td><td className="border px-2">C</td><td className="border px-2">6</td></tr>
            </tbody>
          </table>
        )}
        {activeTool === 'quiz' && (
          <div className="text-purple-900 text-base space-y-2">
            <div><strong>Quiz:</strong></div>
            <div>1. When did WWII start?</div>
            <div>2. Name two Allied Powers.</div>
            <div>3. What is the main function of mitochondria?</div>
          </div>
        )}
        {activeTool === 'workflow' && (
          <svg width="320" height="120" viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="60" width="60" height="30" rx="8" fill="#dbeafe" />
            <text x="40" y="80" textAnchor="middle" fontSize="13" fill="#2563eb">Evaporation</text>
            <rect x="130" y="10" width="60" height="30" rx="8" fill="#fef9c3" />
            <text x="160" y="30" textAnchor="middle" fontSize="13" fill="#ca8a04">Condensation</text>
            <rect x="250" y="60" width="60" height="30" rx="8" fill="#bbf7d0" />
            <text x="280" y="80" textAnchor="middle" fontSize="13" fill="#16a34a">Precipitation</text>
            <rect x="130" y="80" width="60" height="30" rx="8" fill="#fca5a5" />
            <text x="160" y="100" textAnchor="middle" fontSize="13" fill="#b91c1c">Collection</text>
            <polygon points="70,75 130,25 130,40 70,90" fill="#e0e7ff" opacity="0.5" />
            <polygon points="190,25 250,75 250,90 190,40" fill="#fef3c7" opacity="0.5" />
            <polygon points="190,95 250,75 250,90 190,110" fill="#bbf7d0" opacity="0.3" />
            <polygon points="70,90 130,110 130,95 70,75" fill="#fca5a5" opacity="0.3" />
            <text x="100" y="60" fontSize="11" fill="#64748b">↑</text>
            <text x="220" y="60" fontSize="11" fill="#64748b">↓</text>
          </svg>
        )}
        {!activeTool && <span className="text-gray-400">Select a tool above to see it in action.</span>}
      </div>

      {/* Q&A and Workflow Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xl px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-line">{message.content}</p>
              {message.context?.documentId && (
                <p className="text-xs opacity-75 mt-1">
                  Context: Document {message.context.documentId}
                </p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input for custom questions */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your AI tutor anything..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}; 