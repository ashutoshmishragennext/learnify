/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /api/user/insights/route.ts
import connectDB from "@/lib/dbConnect";
import User from "@/app/models/User";
import Course from "@/app/models/Course";
import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";

// Define interfaces for type safety
interface CourseProgress {
  courseId: string;
  overallCompletionPercentage: number;
  completionStatus: boolean;
  lastUpdated: Date;
  dateStarted: Date;
  dateCompleted?: Date;
}

interface UserData {
  email: string;
  coursesBought: string[];
  courseProgress: CourseProgress[];
  cart: any[];
  wishlist: any[];
  createdAt: Date;
  lastActiveAt?: Date;
  updatedAt: Date;
}

interface CourseData {
  courseId: string;
  name: string;
  price?: {
    current: number;
  };
  duration?: number;
  category?: string;
}

interface CategoryStats {
  [key: string]: number;
}

interface RecentCourse {
  courseId: string;
  courseName: string;
  progress: number;
  lastUpdated: Date;
  completionStatus: boolean;
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
  memberSince: Date;
  lastActive: Date;
}

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const user = await User.findOne({ email: session.user.email }) as UserData | null;
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Get courses bought by user
    const userCourses = await Course.find({
      courseId: { $in: user.coursesBought }
    }).select('courseId name price.current duration modules category') as CourseData[];

    // Calculate insights
    const totalCoursesEnrolled = user.coursesBought.length;
    const totalCoursesInProgress = user.courseProgress.filter(cp => !cp.completionStatus).length;
    const totalCoursesCompleted = user.courseProgress.filter(cp => cp.completionStatus).length;
    
    // Calculate total spent
    const totalAmountSpent = userCourses.reduce((sum: number, course) => sum + (course.price?.current || 0), 0);
    
    // Calculate average completion rate
    const avgCompletionRate = user.courseProgress.length > 0 
      ? user.courseProgress.reduce((sum: number, cp) => sum + cp.overallCompletionPercentage, 0) / user.courseProgress.length 
      : 0;

    // Calculate total learning hours
    const totalLearningHours = userCourses.reduce((sum: number, course) => sum + (course.duration || 0), 0);
    
    // Calculate hours completed based on progress
    const hoursCompleted = user.courseProgress.reduce((sum: number, cp) => {
      const course = userCourses.find(c => c.courseId === cp.courseId);
      const courseDuration = course?.duration || 0;
      return sum + (courseDuration * cp.overallCompletionPercentage / 100);
    }, 0);

    // Get category distribution
    const categoryStats: CategoryStats = userCourses.reduce((acc: CategoryStats, course) => {
      const category = course.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Recent activity (courses started recently)
    const recentCourses: RecentCourse[] = user.courseProgress
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 5)
      .map(cp => {
        const course = userCourses.find(c => c.courseId === cp.courseId);
        return {
          courseId: cp.courseId,
          courseName: course?.name || 'Unknown Course',
          progress: cp.overallCompletionPercentage,
          lastUpdated: cp.lastUpdated,
          completionStatus: cp.completionStatus
        };
      });

    // Monthly progress (last 6 months)
    const monthlyProgress: MonthlyProgress[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const coursesStartedInMonth = user.courseProgress.filter(cp => 
        new Date(cp.dateStarted) >= monthDate && new Date(cp.dateStarted) <= monthEnd
      ).length;
      
      const coursesCompletedInMonth = user.courseProgress.filter(cp => 
        cp.dateCompleted && new Date(cp.dateCompleted) >= monthDate && new Date(cp.dateCompleted) <= monthEnd
      ).length;

      monthlyProgress.push({
        month: monthDate.toLocaleString('default', { month: 'short', year: 'numeric' }),
        started: coursesStartedInMonth,
        completed: coursesCompletedInMonth
      });
    }

    const insights: InsightsData = {
      totalCoursesEnrolled,
      totalCoursesInProgress,
      totalCoursesCompleted,
      totalAmountSpent,
      avgCompletionRate: Math.round(avgCompletionRate),
      totalLearningHours: Math.round(totalLearningHours),
      hoursCompleted: Math.round(hoursCompleted),
      categoryStats,
      recentCourses,
      monthlyProgress,
      cartItems: user.cart.length,
      wishlistItems: user.wishlist.length,
      memberSince: user.createdAt,
      lastActive: user.lastActiveAt || user.updatedAt
    };

    return NextResponse.json({ success: true, data: insights });
  } catch (error) {
    console.error("Error fetching user insights:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch insights" }, { status: 500 });
  }
}