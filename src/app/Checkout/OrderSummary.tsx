import { useEffect, useState } from "react";
import { useCourse } from "../Context/CourseContext";

  const OrderSummary = () => {
    const {courseData: course} = useCourse(); 

    const quotes = [
      "Invest in yourself—learning never goes out of style.",
      "Consistency is the key to mastery. Keep learning, keep growing!",
      "Every expert was once a beginner. Take the first step today!",
      "Your future self will thank you for this decision!",
      "Knowledge is power, and you're one step closer to unlocking it!",
      "Small steps every day lead to big changes over time!",
      "Success is built on consistency—keep pushing forward!",
      "The best investment you can make is in your education!"
    ];
    const [randomQuote, setRandomQuote] = useState("");
    useEffect(() => {
        setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      }, []);

    return (
      <div className="p-6 bg-white shadow-lg rounded-lg w-96 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
        
        <div className="mt-4 space-y-2 text-gray-700">
          <div className="mt-5 p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-md">
            <p className="font-semibold text-sm">{randomQuote}</p>
          </div>
          <p className="flex justify-between">
            <span>Original Price:</span>
            <span className="line-through text-gray-500">₹{course?.price.original}</span>
          </p>
          <p className="flex justify-between text-red-600 font-medium">
            <span>Discounts ({course?.price.discountPercentage || 0}% Off):</span>
            <span>₹{course?.price ? (course.price.original - course.price.current) : 0}</span>
          </p>
          <hr className="border-gray-300 my-3" />
          <p className="flex justify-between font-bold text-lg">
            <span>Total 1 course:</span>
            <span className="text-green-600">₹{course?.price.current}</span>
          </p>
        </div>
  
        {/* Promotion Banner */}
        {/* <div className="mt-5 p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-md">
          <p className="font-semibold text-lg">{randomQuote}</p>
        </div> */}
  
      </div>
    );
  };
  
  export default OrderSummary;
  