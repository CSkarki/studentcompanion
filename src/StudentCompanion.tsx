import React, { useState, useEffect } from 'react';
import { 
  Upload, FileText, Brain, Camera, Mail, DollarSign, Calendar, 
  Users, Mic, Home, Search, Bell, User, Settings, ChevronRight,
  BookOpen, MessageSquare, BarChart3, Clock, CheckCircle,
  AlertCircle, Plus, Eye, Download, Trash2, Filter, Send,
  Smartphone, Globe, Shield, CreditCard, Zap, Target,
  PlayCircle, PauseCircle, Volume2, VolumeX, RefreshCw,
  Share, Star, Award, TrendingUp, PieChart, Archive
} from 'lucide-react';

// Add interfaces for type safety
interface UserType {
  name: string;
  email: string;
  year: string;
  university: string;
}

interface DocumentType {
  id: number;
  name: string;
  type: string;
  size: string;
  status: string;
  uploadDate: string;
  summary: string;
}

interface EmailType {
  id: number;
  subject: string;
  sender: string;
  classification: string;
  date: string;
  body: string;
  priority: string;
}

interface HandwrittenNoteType {
  id: number;
  name: string;
  extractedText: string;
  status: string;
  date: string;
  confidence: number;
}

interface StudyTaskType {
  id: number;
  task: string;
  dueDate: string;
  priority: string;
  completed: boolean;
  estimatedTime: string;
  category: string;
}

interface InvoiceType {
  id: number;
  name: string;
  amount: number;
  date: string;
  category: string;
  status: string;
  vendor: string;
}

interface FlashcardType {
  id: number;
  front: string;
  back: string;
  subject: string;
  created: string;
}

interface NavigationItem {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}

const StudentCompanionApp = () => {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Sample data
  const [documents] = useState<DocumentType[]>([
    { id: 1, name: 'Biology Chapter 12.pdf', type: 'PDF', size: '2.4 MB', status: 'complete', uploadDate: '2024-05-20', summary: 'Cell division and mitosis processes' },
    { id: 2, name: 'Math Assignment 3.docx', type: 'DOCX', size: '1.2 MB', status: 'processing', uploadDate: '2024-05-25', summary: '' },
    { id: 3, name: 'History Notes.pdf', type: 'PDF', size: '3.1 MB', status: 'complete', uploadDate: '2024-05-18', summary: 'World War II timeline and key events' },
    { id: 4, name: 'Chemistry Lab Report.pdf', type: 'PDF', size: '1.8 MB', status: 'complete', uploadDate: '2024-05-22', summary: 'Acid-base titration experiment results' }
  ]);

  const [emails] = useState<EmailType[]>([
    { id: 1, subject: 'Assignment Due Tomorrow', sender: 'prof.smith@university.edu', classification: 'academic', date: '2024-05-25', body: 'Reminder about your biology assignment...', priority: 'high' },
    { id: 2, subject: 'Study Group Meeting', sender: 'study.group@students.edu', classification: 'academic', date: '2024-05-24', body: 'Meeting at library tomorrow at 3 PM...', priority: 'medium' },
    { id: 3, subject: 'Campus Newsletter', sender: 'newsletter@university.edu', classification: 'notification', date: '2024-05-23', body: 'This week on campus...', priority: 'low' },
    { id: 4, subject: 'Exam Schedule Update', sender: 'registrar@university.edu', classification: 'academic', date: '2024-05-22', body: 'Updated final exam schedule...', priority: 'high' }
  ]);

  const [handwrittenNotes] = useState<HandwrittenNoteType[]>([
    { id: 1, name: 'Chemistry Lab Notes', extractedText: 'H2SO4 + 2NaOH → Na2SO4 + 2H2O\nBalanced equation for acid-base reaction\nObservations: Color change from clear to pink', status: 'complete', date: '2024-05-24', confidence: 95 },
    { id: 2, name: 'Physics Formulas', extractedText: 'F = ma\nKinetic Energy = 1/2mv²\nPotential Energy = mgh\nWork = Force × Distance', status: 'complete', date: '2024-05-23', confidence: 98 },
    { id: 3, name: 'History Timeline', extractedText: '1939: WWII begins\n1941: Pearl Harbor attack\n1944: D-Day invasion\n1945: War ends', status: 'complete', date: '2024-05-21', confidence: 92 }
  ]);

  const [studyPlanner, setStudyPlanner] = useState<StudyTaskType[]>([
    { id: 1, task: 'Review Biology Chapter 12', dueDate: '2024-05-26', priority: 'high', completed: false, estimatedTime: '2 hours', category: 'Biology' },
    { id: 2, task: 'Complete Math Problem Set', dueDate: '2024-05-27', priority: 'medium', completed: true, estimatedTime: '1.5 hours', category: 'Mathematics' },
    { id: 3, task: 'Prepare History Presentation', dueDate: '2024-05-28', priority: 'high', completed: false, estimatedTime: '3 hours', category: 'History' },
    { id: 4, task: 'Chemistry Lab Report Review', dueDate: '2024-05-29', priority: 'medium', completed: false, estimatedTime: '1 hour', category: 'Chemistry' }
  ]);

  const [invoices] = useState<InvoiceType[]>([
    { id: 1, name: 'Spring Semester Tuition', amount: 15420.00, date: '2024-01-15', category: 'Tuition', status: 'processed', vendor: 'University Finance Office' },
    { id: 2, name: 'Textbook Purchase', amount: 245.99, date: '2024-02-03', category: 'Books', status: 'processed', vendor: 'Campus Bookstore' },
    { id: 3, name: 'Dorm Room Fee', amount: 3200.00, date: '2024-01-10', category: 'Housing', status: 'processed', vendor: 'Housing Department' },
    { id: 4, name: 'Lab Equipment', amount: 89.50, date: '2024-03-15', category: 'Supplies', status: 'processing', vendor: 'Science Supply Co.' }
  ]);

  const [flashcards] = useState<FlashcardType[]>([
    { id: 1, front: 'What is mitosis?', back: 'Cell division process that results in two identical diploid cells', subject: 'Biology', created: '2024-05-20' },
    { id: 2, front: 'F = ma represents?', back: 'Newton\'s Second Law of Motion - Force equals mass times acceleration', subject: 'Physics', created: '2024-05-23' },
    { id: 3, front: 'When did WWII end?', back: '1945 - Victory in Europe Day (May 8) and Victory over Japan Day (August 15)', subject: 'History', created: '2024-05-21' }
  ]);

  const navigationItems: NavigationItem[] = [
    {
      Icon: Home,
      label: 'Home',
      active: activeTab === 'home',
      onClick: () => setActiveTab('home')
    },
    {
      Icon: BookOpen,
      label: 'Notes',
      active: activeTab === 'notes',
      onClick: () => setActiveTab('notes')
    },
    {
      Icon: MessageSquare,
      label: 'Chat',
      active: activeTab === 'chat',
      onClick: () => setActiveTab('chat')
    },
    {
      Icon: Brain,
      label: 'AI Tutor',
      active: activeTab === 'ai-tutor',
      onClick: () => setActiveTab('ai-tutor')
    }
  ];

  useEffect(() => {
    // Simulate authentication check
    setTimeout(() => {
      setIsAuthenticated(true);
      setUser({ name: 'Alex Johnson', email: 'alex.johnson@student.edu', year: 'Junior', university: 'State University' });
    }, 1000);
  }, []);

  // Navigation Component
  const Navigation = () => (
    <div className="bg-white border-r border-gray-200 w-64 h-screen fixed left-0 top-0 overflow-y-auto z-10">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">Student Companion</h1>
            <p className="text-xs text-gray-500">AI Study Assistant</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item: NavigationItem) => (
            <NavItem key={item.label} {...item} />
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.year}</p>
          </div>
          <Settings className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
      </div>
    </div>
  );

  const NavItem = ({ Icon, label, active, onClick }: NavigationItem) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 p-2 rounded-lg ${
        active ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  // Authentication Components
  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Student Companion</h1>
          <p className="text-gray-600 mt-2">Your AI-powered study assistant</p>
        </div>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">Don't have an account? <span className="text-blue-600 cursor-pointer">Sign up</span></p>
        </div>
      </div>
    </div>
  );

  // Dashboard Component
  const Dashboard = () => (
    <div className="ml-64 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Here's what's happening with your studies today.</p>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100">
            <Bell className="w-5 h-5 text-blue-600" />
          </button>
          <button className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100">
            <Settings className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Documents</p>
              <p className="text-2xl font-bold text-blue-900">{documents.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Completed Tasks</p>
              <p className="text-2xl font-bold text-green-900">{studyPlanner.filter(t => t.completed).length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Notes Processed</p>
              <p className="text-2xl font-bold text-purple-900">{handwrittenNotes.length}</p>
            </div>
            <Camera className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Academic Emails</p>
              <p className="text-2xl font-bold text-orange-900">{emails.filter(e => e.classification === 'academic').length}</p>
            </div>
            <Mail className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setCurrentScreen('documents')}
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Upload className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900">Upload Document</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('notes')}
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Camera className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900">Scan Notes</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('emails')}
            className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <Mail className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-900">Check Emails</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('planner')}
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Calendar className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900">Study Planner</span>
          </button>
        </div>
      </div>

      {/* Recent Activity & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Biology Chapter 12.pdf processed</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Camera className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Physics formulas extracted from notes</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-orange-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">4 new academic emails classified</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h2>
          <div className="space-y-3">
            {studyPlanner.filter(task => !task.completed).slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{task.task}</p>
                  <p className="text-xs text-gray-500">Due: {task.dueDate} • {task.estimatedTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Document Center Component
  const DocumentCenter = () => (
    <div className="ml-64 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Document Center</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Documents</h3>
        <p className="text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Choose Files
        </button>
        <p className="text-xs text-gray-500 mt-2">Supports PDF, DOC, DOCX files up to 10MB</p>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Your Documents</h2>
        </div>
        <div className="divide-y">
          {documents.map(doc => (
            <div key={doc.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-gray-600">{doc.size} • {doc.uploadDate}</p>
                    {doc.summary && <p className="text-sm text-gray-500 mt-1">{doc.summary}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'complete' ? 'bg-green-100 text-green-800' : 
                    doc.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {doc.status}
                  </span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('chat')}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // AI Chat Interface Component
  const AIChat = () => {
    const [messages, setMessages] = useState([
      { id: 1, type: 'ai', content: 'Hello! I can help you with questions about your uploaded documents. What would you like to know?' },
      { id: 2, type: 'user', content: 'Can you summarize the Biology Chapter 12 document?' },
      { id: 3, type: 'ai', content: 'Based on your Biology Chapter 12 document, here\'s a summary:\n\nThe chapter focuses on cell division, specifically mitosis. Key topics include:\n• The cell cycle phases (G1, S, G2, M)\n• Mitosis stages: prophase, metaphase, anaphase, telophase\n• Chromosome behavior during division\n• Cell cycle checkpoints and regulation\n\nWould you like me to explain any specific part in more detail?' },
      { id: 4, type: 'user', content: 'What are the main differences between mitosis and meiosis?' },
      { id: 5, type: 'ai', content: 'Great question! Here are the key differences between mitosis and meiosis:\n\n**Mitosis:**\n• Produces 2 identical diploid cells\n• Used for growth and repair\n• One division cycle\n• Maintains chromosome number\n\n**Meiosis:**\n• Produces 4 genetically different haploid gametes\n• Used for sexual reproduction\n• Two division cycles (meiosis I & II)\n• Reduces chromosome number by half\n• Includes crossing over for genetic variation\n\nThis information comes from your uploaded Biology materials. Need more details on any aspect?' }
    ]);
    const [newMessage, setNewMessage] = useState('');

    const sendMessage = () => {
      if (!newMessage.trim()) return;
      
      setMessages([...messages, 
        { id: messages.length + 1, type: 'user', content: newMessage },
        { id: messages.length + 2, type: 'ai', content: 'I\'m processing your question about the documents. This is a demo response showing how the AI would analyze your uploaded materials and provide contextual answers.' }
      ]);
      setNewMessage('');
    };

    return (
      <div className="ml-64 p-6 h-screen flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">AI Study Assistant</h1>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm">Summarize</button>
            <button className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm">Extract Tables</button>
            <button className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm">Generate Quiz</button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm border flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">AI Assistant</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything about your documents..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Handwritten Notes Component
  const HandwrittenNotes = () => (
    <div className="ml-64 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Handwritten Notes</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Camera className="w-4 h-4" />
            <span>Scan Notes</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer">
        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Scan Handwritten Notes</h3>
        <p className="text-gray-600 mb-4">Take a photo or upload an image of your notes</p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Start Camera
        </button>
        <p className="text-xs text-gray-500 mt-2">Supports JPG, PNG files up to 10MB</p>
      </div>

      {/* Notes List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Your Notes</h2>
        </div>
        <div className="divide-y">
          {handwrittenNotes.map(note => (
            <div key={note.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Camera className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{note.name}</h3>
                    <p className="text-sm text-gray-600">{note.date} • {note.confidence}% confidence</p>
                    <p className="text-sm text-gray-500 mt-1">{note.extractedText}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setCurrentScreen('chat')}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Main App Render
  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <LoginScreen />
      ) : (
        <>
          <Navigation />
          {currentScreen === 'dashboard' && <Dashboard />}
          {currentScreen === 'documents' && <DocumentCenter />}
          {currentScreen === 'chat' && <AIChat />}
          {currentScreen === 'notes' && <HandwrittenNotes />}
        </>
      )}
    </div>
  );
};

export default StudentCompanionApp;