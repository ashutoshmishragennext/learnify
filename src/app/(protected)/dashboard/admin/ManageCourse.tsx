/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Trash2, Edit, Users, Clock, DollarSign, Calendar, AlertCircle, Loader2 } from 'lucide-react';

interface Price {
  current: number;
  original: number;
  discountPercentage: number;
  _id: string;
}

interface Author {
  name: string;
  bio: string;
  description: string;
  profileImage: string;
  _id: string;
}

interface SubModule {
  sModuleNumber: number;
  sModuleTitle: string;
  sModuleDuration: number;
  videoLecture: string;
  videoType?: string;
  description?: string;
  attachedPdf?: string;
  _id: string;
}

interface Module {
  moduleNumber: number;
  moduleTitle: string;
  moduleDuration: number;
  subModulePart: number;
  reward: number;
  description?: string;
  subModules: SubModule[];
  _id: string;
}

interface Ratings {
  average: number;
  totalRatings: number;
  _id: string;
}

interface Course {
  _id: string;
  name: string;
  image: string;
  userId: string;
  studentsEnrolled: number;
  shortDescription: string;
  price: Price;
  duration: number;
  requirements: string[];
  prerequisites: string[];
  tags: string[];
  lastUpdated: string;
  courseId: string;
  authors: Author[];
  modules: Module[];
  reviews: string[];
  category: string[];
  certificate: string;
  courseHeading?: string;
  level?: string;
  lifeTimeAccess: string;
  ratings: Ratings;
  totalAssignments: number;
  totalVideoLectures: number;
  __v: number;
}

interface ApiResponse {
  course: Course[];
  courseIncluded: boolean;
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Fetch courses created by user
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/getcoursecreatedbyuser');
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const data: ApiResponse = await response.json();
      setCourses(data.course || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Delete course function
  const deleteCourse = async (courseId: string) => {
    try {
      setDeletingCourseId(courseId);
      
      const response = await fetch('/api/deletecourse', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      // Remove course from state
      setCourses(courses.filter(course => course.courseId !== courseId));
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
    } finally {
      setDeletingCourseId(null);
    }
  };

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading your courses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="flex items-center space-x-2 text-red-600 mb-4">
            <AlertCircle className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Error</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCourses}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">
            Manage and track your created courses
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
                <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {courses.reduce((sum, course) => sum + course.studentsEnrolled, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Avg. Price</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {courses.length > 0 
                    ? formatPrice(courses.reduce((sum, course) => sum + course.price.current, 0) / courses.length)
                    : '₹0'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Avg. Duration</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {courses.length > 0 
                    ? `${(courses.reduce((sum, course) => sum + course.duration, 0) / courses.length).toFixed(1)}h`
                    : '0h'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-6">You haven't created any courses yet.</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                {/* Course Image */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/api/placeholder/400/200';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                      course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.level || 'Not Set'}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex-1">
                      {course.name}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.shortDescription}
                  </p>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{course.studentsEnrolled} students</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{course.duration}h duration</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>{formatPrice(course.price.current)}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(course.lastUpdated)}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(course.price.current)}
                      </span>
                      {course.price.discountPercentage > 0 && (
                        <>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(course.price.original)}
                          </span>
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                            {course.price.discountPercentage}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                      {course.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{course.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                   
                    <button
                      onClick={() => handleDeleteClick(course)}
                      disabled={deletingCourseId === course.courseId}
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      {deletingCourseId === course.courseId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && courseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-2 text-red-600 mb-4">
              <AlertCircle className="h-6 w-6" />
              <h2 className="text-lg font-semibold">Delete Course</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<strong>{courseToDelete.name}</strong>"? 
              This action cannot be undone and will affect {courseToDelete.studentsEnrolled} enrolled students.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCourseToDelete(null);
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteCourse(courseToDelete.courseId)}
                disabled={deletingCourseId === courseToDelete.courseId}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {deletingCourseId === courseToDelete.courseId ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete Course'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}