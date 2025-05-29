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
  const cId: number | number[] = Number(courseId);

  const handlePayment = async () => {
    setIsProcessing(true);

    if (!session) {
      setCourseData(course);
      router.push("/Checkout");
    } else {
      const result = await makePayments(amount, courseName, cId, session);
      if (result) {
        setCourseIncluded(true);
        toast.info("Redirecting you to Dashboard");
        router.push("/DashBoard");
      } else {
        setIsProcessing(false);
      }
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
        <header className="text-center py-8 flex">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-300">
              Courses &gt; {course.category} &gt; {course.name}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mt-2">
              {course.name}
            </h1>
            <p className="text-lg text-gray-400 mt-3">
              {course.shortDescription}
            </p>
            {/* <div className="flex justify-center items-center gap-3 mt-6">
              <span className="text-orange-400 text-2xl font-bold">
                ★ {course.ratings.average}
              </span>
              <span className="text-gray-300">
                ({course.ratings.totalRatings} Reviews)
              </span>
              <span className="text-gray-300">
                Published By{" "}
                <span className="text-purple-400">
                  {course.authors[0].name}
                </span>
              </span>
            </div> */}
            <div className="flex justify-center gap-4 mt-6">
              {!courseIncluded ? (
                !cartIncluded ? (
                  <button
                    className="border border-gray-400 rounded-md px-4 py-2 hover:bg-gray-800"
                    onClick={addToCart}
                  >
                    {isAdding ? (
                      "Adding..."
                    ) : (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <AiOutlineShoppingCart /> Cart
                      </span>
                    )}
                  </button>
                ) : (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                    disabled
                  >
                    Added to Cart
                  </button>
                )
              ) : null}
              {!courseIncluded ? (
                !wishlistIncluded ? (
                  <button
                    className="border border-gray-400 rounded-md px-4 py-2 hover:bg-gray-800"
                    onClick={addToWishlist}
                  >
                    {isWishing ? (
                      "Adding..."
                    ) : (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <AiOutlineHeart /> Wishlist
                      </span>
                    )}
                  </button>
                ) : (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                    disabled
                  >
                    Wishlisted
                  </button>
                )
              ) : null}
              {!courseIncluded ? (
                <button
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
                  onClick={handlePayment}
                >
                  {isProcessing
                    ? "Processing..."
                    : `Buy Now (₹ ${course.price.current})`}
                </button>
              ) : (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                  disabled
                >
                  Course Purchased
                </button>
              )}
            </div>
          </div>
        </header>

        <section className="bg-light-blue text-center py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <div>
              <h3 className="text-4xl font-bold">{course.duration}</h3>
              <p className="text-gray-300">Hours of Course</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold">{course.modules.length}</h3>
              <p className="text-gray-300">Total Modules</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold">{course.studentsEnrolled}</h3>
              <p className="text-gray-300">Students Enrolled</p>
            </div>
            {/* <div>
              <h3 className="text-4xl font-bold">
                {course.rewards.totalReward}
              </h3>
              <p className="text-gray-300">Total Rewards</p>
            </div> */}
          </div>
        </section>

        <footer className="bg-purple-500 text-center text-white py-4">
          <div className="flex justify-center space-x-8">
            <button
              onClick={() => handleScroll("about-course")}
              className="hover:underline"
            >
              About Course
            </button>
            <button
              onClick={() => handleScroll("course-content")}
              className="hover:underline"
            >
              Course Content
            </button>
            <button
              onClick={() => handleScroll("about-publisher")}
              className="hover:underline"
            >
              About Publisher
            </button>
            <button
              onClick={() => handleScroll("rewards")}
              className="hover:underline"
            >
              Rewards
            </button>
            <button
              onClick={() => handleScroll("faq")}
              className="hover:underline"
            >
              FAQs
            </button>
          </div>
        </footer>
      </div>

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
