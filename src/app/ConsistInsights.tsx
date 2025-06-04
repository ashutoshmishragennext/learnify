"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, TrendingUp, Clock, DollarSign, Award, Target, Calendar, User, ShoppingCart, Heart, BarChart3, LucideIcon } from 'lucide-react';

// Define TypeScript interfaces
interface RecentCourse {
  courseId: string;
  courseName: string;
  progress: number;
  lastUpdated: string;
  completionStatus: boolean;
}

interface CategoryStats {
  [key: string]: number;
}

interface MonthlyProgress {
  month: string;
  started: number;
  completed: number;
}

interface InsightsData {
  totalCoursesEnrolled: number;
  totalCoursesInProgress: number;
  totalCoursesCompleted: number;
  totalAmountSpent: number;
  avgCompletionRate: number;
  totalLearningHours: number;
  hoursCompleted: number;
  categoryStats: CategoryStats;
  recentCourses: RecentCourse[];
  monthlyProgress: MonthlyProgress[];
  cartItems: number;
  wishlistItems: number;
  memberSince: string;
  lastActive: string;
}

interface ApiResponse {
  success: boolean;
  data?: InsightsData;
  message?: string;
}

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  onClick?: () => void;
}

interface ProgressBarProps {
  percentage: number;
  color?: string;
}

const UserInsightsDashboard: React.FC = () => {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInsights = async (): Promise<void> => {
      try {
        const response = await fetch('/api/user/insights');
        const result: ApiResponse = await response.json();
        
        if (result.success && result.data) {
          setInsights(result.data);
        } else {
          setError(result.message || 'Failed to load insights');
        }
      } catch (err) {
        setError('Failed to load insights');
        console.error('Error fetching insights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const StatCard: React.FC<StatCardProps> = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle, 
    color = "blue", 
    onClick 
  }) => (
    <div 
      className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-${color}-500 hover:shadow-xl transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600 mt-1`}>{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <Icon className={`w-12 h-12 text-${color}-500 opacity-20`} />
      </div>
    </div>
  );

  const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, color = "blue" }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`bg-${color}-500 h-2 rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No insights data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Learning <span className="text-blue-600">Journey</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Track your progress and discover insights about your learning experience
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            title="Courses Enrolled"
            value={insights.totalCoursesEnrolled}
            subtitle="Total courses purchased"
            color="blue"
            onClick={() => router.push('/dashboard/student/courses')}
          />
          <StatCard
            icon={TrendingUp}
            title="In Progress"
            value={insights.totalCoursesInProgress}
            subtitle="Currently learning"
            color="orange"
            onClick={() => {}}
          />
          <StatCard
            icon={Award}
            title="Completed"
            value={insights.totalCoursesCompleted}
            subtitle="Courses finished"
            color="green"
            onClick={() => {}}
          />
          <StatCard
            icon={Target}
            title="Avg. Progress"
            value={`${insights.avgCompletionRate}%`}
            subtitle="Across all courses"
            color="purple"
            onClick={() => {}}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            title="Total Invested"
            value={`₹${insights.totalAmountSpent.toLocaleString()}`}
            subtitle="In your education"
            color="green"
          />
          <StatCard
            icon={Clock}
            title="Learning Hours"
            value={`${insights.hoursCompleted}h`}
            subtitle={`of ${insights.totalLearningHours}h total`}
            color="blue"
          />
          <StatCard
            icon={ShoppingCart}
            title="Cart Items"
            value={insights.cartItems}
            subtitle="Ready to purchase"
            color="orange"
            onClick={() => router.push('/cart')}
          />
          <StatCard
            icon={Heart}
            title="Wishlist"
            value={insights.wishlistItems}
            subtitle="Courses saved"
            color="red"
            onClick={() => router.push('/Wishlist')}
          />
        </div>

        {/* Charts and Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {insights.recentCourses.map((course) => (
                <div key={course.courseId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 truncate">{course.courseName}</h4>
                    <p className="text-sm text-gray-600">
                      {course.completionStatus ? 'Completed' : `${course.progress}% complete`}
                    </p>
                  </div>
                  <div className="w-24 ml-4">
                    <ProgressBar 
                      percentage={course.progress} 
                      color={course.completionStatus ? 'green' : 'blue'} 
                    />
                  </div>
                </div>
              ))}
              {insights.recentCourses.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Learning Categories</h3>
            <div className="space-y-4">
              {Object.entries(insights.categoryStats).map(([category, count]) => {
                const percentage = (count / insights.totalCoursesEnrolled) * 100;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">{category}</span>
                      <span className="text-sm text-gray-600">{count} courses</span>
                    </div>
                    <ProgressBar percentage={percentage} color="indigo" />
                  </div>
                );
              })}
              {Object.keys(insights.categoryStats).length === 0 && (
                <p className="text-gray-500 text-center py-4">No categories yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Profile Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Calendar className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-semibold">
                {new Date(insights.memberSince).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-center">
              <Clock className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <p className="text-sm text-gray-600">Last Active</p>
              <p className="font-semibold">
                {new Date(insights.lastActive).toLocaleDateString()}
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <p className="text-sm text-gray-600">Learning Streak</p>
              <p className="font-semibold">Active Learner</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Ready to Learn More?</h3>
            <p className="text-blue-100 mb-6">
              Discover new courses and continue your learning journey
            </p>
            <button
              onClick={() => router.push('/dashboard/student/courses')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInsightsDashboard;