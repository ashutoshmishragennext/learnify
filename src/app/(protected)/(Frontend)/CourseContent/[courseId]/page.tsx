/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Footer from "../../Footer/page";
// import ReviewsHome from "../../Reviews/page";
import { useParams, useRouter } from "next/navigation";
import CoursePage from "./About2";
import CourseContentData from "./CourseContentData";
import PublishHome from "./Publisher";
import { useSession } from "next-auth/react";
import Loader from "@/components/ui/Loader";
import { ICourse } from "@/app/models/Course";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import makePayments from "@/lib/makePayments";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { useCourse } from "../../Context/CourseContext";
// import Rewards from "./Rewards";

const CourseContentPage: React.FC = () => {
  // courses part
  const { data: session } = useSession();
  const { courseId } = useParams();
  const { setCourseData } = useCourse();

  const [courseIncluded, setCourseIncluded] = useState(false);
  const [cartIncluded, setCartIncluded] = useState(false);
  const [wishlistIncluded, setWishlistIncluded] = useState(false);
  const [course, setCourse] = useState<ICourse | null>(null); // State to store course data
  const [loading, setLoading] = useState(true); // State to indicate loading
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishing, setIsWishing] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // const response = await fetch(`/api/course/${courseId}`);
        const response = await fetch("/api/course", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseId }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch course data");
        }
        const data = await response.json();
        setCourse(data.course);
        setCourseIncluded(data.courseIncluded);
        setCartIncluded(data.cartIncluded);
        setWishlistIncluded(data.wishlistIncluded);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const addToCart = async () => {
    setIsAdding(true);
    if (!session) {
      console.log("Session not available according to the condition: ",session);
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${currentPath}`);
      return;
    }
    try {
      const response = await fetch("/api/addCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      setIsAdding(false);
      // console.log("Success:", data.message);
      setCartIncluded(true);
      toast.success(data.message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        console.log("Adding Cart has developed some issue.");
      } else {
        console.error("Something went Wrong on client side.");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const addToWishlist = async () => {
    setIsWishing(true);
    if (!session) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${currentPath}`);
      return;
    }
    try {
      const response = await fetch("/api/addWishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      setIsWishing(false);
      // console.log("Success:", data.message);
      setWishlistIncluded(true);
      toast.success(data.message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        console.log("Adding Wishlist has developed some issue.");
      } else {
        console.error("Something went Wrong on client side.");
      }
    } finally {
      setIsWishing(false);
    }
  };

  if (loading) {
    return (
      <div>
        {" "}
        <Loader />{" "}
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>; // Display an error state
  }

  if (!course) {
    return <div>Course not found</div>; // Display if no course is found
  }

  // Payments part
  const amount = course.price.current; // constant amount in INR
  const courseName = course.name;
  const cId: string | string[] = String(courseId);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
  
      if (!session) {
        setCourseData(course);
        router.push("/");
      } else {
        const result = await makePayments(amount, courseName, cId, session);
        console.log("result" ,result);
        
        if (result) {
          setCourseIncluded(true);
          toast.info("Redirecting you to Your Courses");
          router.push("/dashboard/student/courses");
        }
      }
    } catch (error : any) {
        toast.error(error.message);
    }
    finally {
      setIsProcessing(false);
    }
  };

  const handleScroll = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
     <>

    <div className="bg-dark-blue text-white">
      {/* Header */}
      <header className="py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-300">
            Courses &gt; {course.category} &gt; {course.name}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
            {course.name}
          </h1>
          <p className="text-base sm:text-lg text-gray-400 mt-3">
            {course.shortDescription}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            {!courseIncluded && !cartIncluded && (
              <button
                className="border border-gray-400 rounded-md px-4 py-2 hover:bg-gray-800"
                onClick={addToCart}
              >
                {isAdding ? "Adding..." : (
                  <span className="flex items-center gap-2">
                    <AiOutlineShoppingCart /> Cart
                  </span>
                )}
              </button>
            )}
            {!courseIncluded && cartIncluded && (
              <button className="bg-green-500 text-white px-4 py-2 rounded-md" disabled>
                Added to Cart
              </button>
            )}
            {!courseIncluded && !wishlistIncluded && (
              <button
                className="border border-gray-400 rounded-md px-4 py-2 hover:bg-gray-800"
                onClick={addToWishlist}
              >
                {isWishing ? "Adding..." : (
                  <span className="flex items-center gap-2">
                    <AiOutlineHeart /> Wishlist
                  </span>
                )}
              </button>
            )}
            {!courseIncluded && wishlistIncluded && (
              <button className="bg-green-500 text-white px-4 py-2 rounded-md" disabled>
                Wishlisted
              </button>
            )}
            {!courseIncluded ? (
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
                onClick={handlePayment}
              >
                {isProcessing ? "Processing..." : `Buy Now (₹ ${course.price.current})`}
              </button>
            ) : (
              <button className="bg-green-500 text-white px-4 py-2 rounded-md" disabled>
                Course Purchased
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Stats Section */}

      <section className="bg-light-blue text-center py-6 px-2 sm:px-6">
        <div className="max-w-6xl mx-auto flex justify-center items-center gap-4 sm:gap-6 md:gap-6 lg:gap-12 xl:gap-40">
          <div className="flex flex-col items-center min-w-[80px]">
            <h3 className="text-sm sm:text-base md:text-xl lg:text-3xl font-bold">
              {course.duration.toFixed(2)}
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base">
              Hours of Course
            </p>
          </div>
          <div className="flex flex-col items-center min-w-[80px]">
            <h3 className="text-sm sm:text-base md:text-xl lg:text-3xl font-bold">
              {course.modules.length}
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base">
              Total Modules
            </p>
          </div>
          <div className="flex flex-col items-center min-w-[80px]">
            <h3 className="text-sm sm:text-base md:text-xl lg:text-3xl font-bold">
              {course.studentsEnrolled}
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base">
              Students Enrolled
            </p>
          </div>
        </div>
      </section>
      
      {/* Footer Navigation */}
      <footer className="bg-purple-500 text-white py-4 px-4">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm sm:text-base">
          <button onClick={() => handleScroll("about-course")} className="hover:underline">About Course</button>
          <button onClick={() => handleScroll("course-content")} className="hover:underline">Course Content</button>
          <button onClick={() => handleScroll("about-publisher")} className="hover:underline">About Publisher</button>
          <button onClick={() => handleScroll("rewards")} className="hover:underline">Rewards</button>
          <button onClick={() => handleScroll("faq")} className="hover:underline">FAQs</button>
        </div>
      </footer>


    </div>
      
            {/* Sections */}
      <section id="about-course">
        <CoursePage course={course} />
      </section>

      <section id="course-content">
        <CourseContentData course={course} />
      </section>

      <section id="about-publisher">
        <PublishHome course={course} />
      </section>

      <section id="rewards">
        {/* <Rewards course={course} /> */}
      </section>

      <section id="faq">
        {/* <ReviewsHome course={course} /> */}
      </section>

      <Footer />
    </>
  );
};

export default CourseContentPage;
