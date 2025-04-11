"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import ProfileSection from "./ProfileSection";
import makePayments from "@/lib/makePayments";
import { TrashIcon } from "@heroicons/react/24/solid";
import formatStudents from "@/lib/formatStudents";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Session } from "next-auth";

interface ICourse {
  _id: string;
  name: string;
  image: string;
  shortDescription: string;
  studentsEnrolled: number;
  price: { current: number; original: number };
  courseId: number;
}

const CartPage : React.FC<{ session?: Session | null }> = ({ session }) => {
  const [cart, setCart] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingCourse, setRemovingCourse] = useState<number | null>(null);
  const [processingCourse, setProcessingCourse] = useState<number | null>(null);
  const [isBuyingAll, setIsBuyingAll] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCartCourses = async () => {
      try {
        const response = await fetch("/api/cartCourses");
        if (!response.ok) throw new Error("Error fetching courses");
        const data: ICourse[] = await response.json();
        setCart(data);
      } catch (error) {
        console.error("Error fetching cart data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCartCourses();
  }, []);

  const handlePayment = async (
    amount: number,
    courseName: string,
    courseId: number[] | number
  ) => {
    setProcessingCourse(Array.isArray(courseId) ? null : courseId);
    if (Array.isArray(courseId)) {
      setIsBuyingAll(true);
    }
    try {
      const result = await makePayments(amount, courseName, courseId, session);

      if(result){
      const idsToRemove = Array.isArray(courseId) ? courseId : [courseId];
      const updatedCart = cart.filter(
        (item) => !idsToRemove.includes(item.courseId)
      );
      setCart(updatedCart);
      toast.info("Redirecting to Dashboard!");
      router.push("/DashBoard");
    }
    else{
      setProcessingCourse(null);
    }
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsBuyingAll(false);
      setProcessingCourse(null);
    }
  };

  const handleRemove = async (courseId: number) => {
    try {
      setRemovingCourse(courseId);
      const response = await fetch("/api/removeCartCourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      if (!response.ok) throw new Error("Failed to remove course");
  
      setCart((prevCart) =>
        prevCart.filter((item) => item.courseId !== courseId)
      );
      toast.success("Course removed from cart.");
    } catch (error) {
      console.error("Error removing course:", error);
    } finally {
      setRemovingCourse(null);
    }
  };
  

  if (loading) return <Loader />;
  const totalAmount = cart.reduce((sum, item) => sum + item.price.current, 0);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <div className="md:w-1/4 w-full p-6 bg-white shadow-lg flex flex-col items-center">
        <ProfileSection session={session} />
      </div>

      {/* Cart Section */}
      <div className="w-3/4 p-2">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
          Shopping Cart
        </h2>

        {cart.length === 0 ? (
          <p className="text-lg font-semibold text-gray-600">
            Your cart is empty
          </p>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="relative flex items-center gap-6 bg-white p-6 rounded-lg shadow-md border-l-8 border-purple-500 hover:shadow-lg transition transform hover:-translate-y-1 duration-300"
              >
                <button
                  onClick={() => handleRemove(item.courseId)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition w-6 h-6 flex items-center justify-center"
                >
                  {removingCourse === item.courseId ? (
                    <ClipLoader size={20} color="red" />
                  ) : (
                    <TrashIcon className="w-6 h-6" />
                  )}
                </button>

                {/* Course Image */}
                <div className="w-32 h-32 overflow-hidden rounded-lg shadow-md">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.shortDescription}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Enrolled: +{formatStudents(item.studentsEnrolled)} students
                  </p>
                </div>

                {/* Pricing & Actions */}
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">
                    ₹{item.price.current}
                  </p>
                  <p className="text-sm text-gray-500 line-through">
                    ₹{item.price.original}
                  </p>
                  <button
                    onClick={() =>
                      handlePayment(
                        item.price.current,
                        item.name,
                        item.courseId
                      )
                    }
                    className={`mt-3 px-5 py-2 text-white rounded-lg transition shadow-md ${
                      processingCourse === item.courseId
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-500 to-indigo-600  hover:bg-green-700"
                    }`}
                    disabled={processingCourse === item.courseId}
                  >
                    {processingCourse === item.courseId
                      ? "Processing..."
                      : "Pay Now"}
                  </button>

                  {/* {isRemoving ? (
                    <ClipLoader size={30} color="red" />
                  ) : (
                    <button
                      onClick={() => handleRemove(item.courseId)}
                      className="px-2 text-red-500 hover:text-red-700 transition"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="mt-8 p-6 bg-white shadow-md rounded-lg flex justify-between items-center border-t-4 border-blue-500">
            <h3 className="text-2xl font-bold text-gray-800">
              Total: ₹{totalAmount}
            </h3>
            <button
              onClick={() =>
                handlePayment(
                  totalAmount,
                  "Total Cart Payment",
                  cart.map((course) => course.courseId)
                )
              }
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600  text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              {isBuyingAll ? "Processing..." : "Checkout"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
