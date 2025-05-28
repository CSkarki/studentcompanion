import React, { useState, useEffect, useRef } from 'react';
import { Users, Send, Loader2, Paperclip, Image as ImageIcon } from 'lucide-react';
import { db, storage } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User } from '../types';

interface ChatMessage {
  id: string;
  content: string;
  sender: User;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
}

interface FileAttachment {
  type: 'image' | 'file';
  url: string;
  name: string;
}

interface StudyGroupChatProps {
  user: User;
  groupId: string;
}

export const StudyGroupChat: React.FC<StudyGroupChatProps> = ({ user, groupId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, `study-groups/${groupId}/messages`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [groupId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (file: File): Promise<FileAttachment | null> => {
    try {
      const storageRef = ref(storage, `chat-files/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      return {
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url,
        name: file.name
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const handleSend = async (attachments?: ChatMessage['attachments']) => {
    if (!input.trim() && !attachments?.length) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: user,
      timestamp: new Date(),
      attachments
    };

    setMessages(prev => [...prev, message]);
    setInput('');
    setIsLoading(true);

    try {
      await addDoc(collection(db, `study-groups/${groupId}/messages`), {
        ...message,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const uploadPromises = Array.from(files).map(file => handleFileUpload(file));
    const attachments = await Promise.all(uploadPromises);
    const validAttachments = attachments.filter((a): a is FileAttachment => a !== null);

    if (validAttachments.length) {
      await handleSend(validAttachments);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      <div className="p-4 border-b flex items-center space-x-2">
        <Users className="w-5 h-5 text-blue-600" />
        <span className="font-medium">Study Group Chat</span>
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender.uid === user.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender.uid === user.uid
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-xs opacity-75 mb-1">{message.sender.name}</p>
              <p className="whitespace-pre-line">{message.content}</p>
              {message.attachments?.map((attachment, index) => (
                <div key={index} className="mt-2">
                  {attachment.type === 'image' ? (
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="max-w-full rounded-lg"
                    />
                  ) : (
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-sm underline"
                    >
                      <Paperclip className="w-4 h-4" />
                      <span>{attachment.name}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ImageIcon className="w-5 h-5" />
            )}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
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