

import React, { useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaCommentDots, FaUserCircle } from "react-icons/fa";

interface Review {
  user: string;
  comment: string;
  rating: number;
  date: string;
}

const staticReviews: Review[] = [
  { user: "Kunal Tyagi", comment: "Great course! Learned a lot about Next.js.", rating: 5, date: "March 20, 2025" },
  { user: "Harsh Gaur", comment: "The content was good, but some parts were unclear.", rating: 4, date: "March 15, 2025" },
  { user: "Prakash", comment: "Not very helpful for beginners. Needed more examples.", rating: 3, date: "March 10, 2024" },
];

const Reviews: React.FC = () => {
  const [feedback, setFeedback] = useState<{ likes: number; dislikes: number; userFeedback: "like" | "dislike" | null }[]>(
    staticReviews.map(() => ({ likes: 0, dislikes: 0, userFeedback: null }))
  );

  const [comments, setComments] = useState<{ [key: number]: string[] }>(
    staticReviews.reduce((acc, _, index) => ({ ...acc, [index]: [] }), {})
  );

  const [newComment, setNewComment] = useState<{ [key: number]: string }>(
    staticReviews.reduce((acc, _, index) => ({ ...acc, [index]: "" }), {})
  );

  const [showCommentBox, setShowCommentBox] = useState<{ [key: number]: boolean }>(
    staticReviews.reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
  );

  const handleLike = (index: number) => {
    setFeedback((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              likes: item.userFeedback === "like" ? item.likes - 1 : item.likes + 1,
              dislikes: item.userFeedback === "dislike" ? item.dislikes - 1 : item.dislikes,
              userFeedback: item.userFeedback === "like" ? null : "like",
            }
          : item
      )
    );
  };

  const handleDislike = (index: number) => {
    setFeedback((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              likes: item.userFeedback === "like" ? item.likes - 1 : item.likes,
              dislikes: item.userFeedback === "dislike" ? item.dislikes - 1 : item.dislikes + 1,
              userFeedback: item.userFeedback === "dislike" ? null : "dislike",
            }
          : item
      )
    );
  };

  const handleAddComment = (index: number) => {
    if (!newComment[index].trim()) return;

    setComments((prev) => ({
      ...prev,
      [index]: [...prev[index], newComment[index]],
    }));

    setNewComment((prev) => ({
      ...prev,
      [index]: "",
    }));

    setShowCommentBox((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  return (
    <div className="mt-5 space-y-6">
      {staticReviews.length > 0 ? (
        staticReviews.map((review, index) => (
          <div key={index} className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
            {/* User info + Star rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-500 text-white text-lg font-bold">
                  {review.user.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{review.user}</h3>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-500 text-xl">★</span>
                ))}
                {Array.from({ length: 5 - review.rating }).map((_, i) => (
                  <span key={i} className="text-gray-300 text-xl">★</span>
                ))}
              </div>
            </div>

            {/* Review Comment */}
            <p className="text-gray-700 mt-3 text-[15px]">{review.comment}</p>

            {/* Like, Dislike, and Comment Icons */}
            <div className="mt-3 flex justify-end items-center space-x-4">
              <button
                onClick={() => handleLike(index)}
                className={`flex items-center space-x-1 text-gray-600 hover:text-blue-500 ${feedback[index].userFeedback === "like" ? "text-purple-600" : ""}`}
              >
                <FaThumbsUp className="text-xl" />
                <span className="text-sm font-medium">{feedback[index].likes}</span>
              </button>
              <button
                onClick={() => handleDislike(index)}
                className={`flex items-center space-x-1 text-gray-600 hover:text-red-500 ${feedback[index].userFeedback === "dislike" ? "text-red-600" : ""}`}
              >
                <FaThumbsDown className="text-xl" />
                <span className="text-sm font-medium">{feedback[index].dislikes}</span>
              </button>
              <button
                onClick={() => setShowCommentBox((prev) => ({ ...prev, [index]: !prev[index] }))}
                className="flex items-center space-x-1 text-gray-600 hover:text-purple-500"
              >
                <FaCommentDots className="text-xl text-purple-500" />
              </button>
            </div>

            {/* Comment Input Box */}
            {showCommentBox[index] && (
              <div className="mt-3 flex items-center space-x-2">
                <input
                  type="text"
                  value={newComment[index]}
                  onChange={(e) => setNewComment((prev) => ({ ...prev, [index]: e.target.value }))}
                  placeholder="Write a comment..."
                  className="border p-2 w-full rounded-lg"
                />
                <button
                  onClick={() => handleAddComment(index)}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  Submit
                </button>
              </div>
            )}

            {/* Display Comments */}
            <div className="mt-3">
              {comments[index].length > 0 && (
                <div className="bg-gray-100 p-3 rounded-lg space-y-2">
                  {comments[index].map((comment, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <FaUserCircle className="text-gray-600 text-xl" />
                      <p className="text-gray-700 text-sm">{comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No reviews available for this course.</p>
      )}
    </div>
  );
};

export default Reviews;


