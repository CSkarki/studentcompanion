export interface User {
  uid: string;
  email: string;
  name: string;
  authProvider: 'firebase' | 'google';
  createdAt: Date;
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  type: 'PDF' | 'DOC' | 'DOCX';
  size: string;
  status: 'processing' | 'complete' | 'failed';
  uploadDate: string;
  summary?: string;
}

export interface HandwrittenNote {
  id: string;
  userId: string;
  name: string;
  extractedText: string;
  status: 'processing' | 'complete' | 'failed';
  date: string;
  confidence: number;
}

export interface Email {
  id: string;
  userId: string;
  subject: string;
  sender: string;
  body: string;
  classification: 'academic' | 'spam' | 'notification';
  source: 'gmail' | 'outlook';
  date: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Invoice {
  id: string;
  userId: string;
  name: string;
  amount: number;
  date: string;
  category: 'Tuition' | 'Books' | 'Housing' | 'Supplies';
  status: 'processing' | 'processed' | 'failed';
  vendor: string;
}

export interface StudyTask {
  id: string;
  userId: string;
  task: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  estimatedTime: string;
  category: string;
}

export interface Flashcard {
  id: string;
  userId: string;
  front: string;
  back: string;
  subject: string;
  created: string;
} 