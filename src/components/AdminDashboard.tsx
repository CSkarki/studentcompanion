import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, BarChart3, Settings, 
  UserPlus, FileText, Award, Shield,
  TrendingUp, PieChart, AlertCircle
} from 'lucide-react';
import { db } from '../firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { User, Document, StudyTask } from '../types';

interface AdminStats {
  totalStudents: number;
  activeStudents: number;
  totalDocuments: number;
  totalStudyGroups: number;
  averageStudyTime: number;
  completionRate: number;
}

interface AdminDashboardProps {
  user: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 0,
    activeStudents: 0,
    totalDocuments: 0,
    totalStudyGroups: 0,
    averageStudyTime: 0,
    completionRate: 0
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total students
        const studentsSnapshot = await getDocs(collection(db, 'users'));
        const totalStudents = studentsSnapshot.size;

        // Fetch active students (active in last 7 days)
        const activeStudentsSnapshot = await getDocs(
          query(collection(db, 'users'), where('lastActive', '>=', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)))
        );
        const activeStudents = activeStudentsSnapshot.size;

        // Fetch total documents
        const documentsSnapshot = await getDocs(collection(db, 'documents'));
        const totalDocuments = documentsSnapshot.size;

        // Fetch study groups
        const studyGroupsSnapshot = await getDocs(collection(db, 'study-groups'));
        const totalStudyGroups = studyGroupsSnapshot.size;

        // Calculate average study time and completion rate
        const tasksSnapshot = await getDocs(collection(db, 'study-tasks'));
        const tasks = tasksSnapshot.docs.map(doc => doc.data() as StudyTask);
        
        const completedTasks = tasks.filter(task => task.completed).length;
        const completionRate = tasks.length ? (completedTasks / tasks.length) * 100 : 0;

        setStats({
          totalStudents,
          activeStudents,
          totalDocuments,
          totalStudyGroups,
          averageStudyTime: 2.5, // Placeholder - implement actual calculation
          completionRate
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>{stats.activeStudents} active this week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm">Documents Processed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
            </div>
            <FileText className="w-8 h-8 text-green-600" />
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <PieChart className="w-4 h-4 mr-1" />
            <span>Across {stats.totalStudyGroups} study groups</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm">Task Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completionRate.toFixed(1)}%</p>
            </div>
            <Award className="w-8 h-8 text-purple-600" />
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <BarChart3 className="w-4 h-4 mr-1" />
            <span>Average {stats.averageStudyTime} hours/day</span>
          </div>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h2>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Compliance Overview</h2>
          <Shield className="w-6 h-6 text-gray-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-800">Data Protection</p>
            <p className="text-2xl font-bold text-green-900">100%</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm font-medium text-yellow-800">Access Control</p>
            <p className="text-2xl font-bold text-yellow-900">98%</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Audit Logs</p>
            <p className="text-2xl font-bold text-blue-900">100%</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 