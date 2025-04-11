// import Image from 'next/image';
// import React from 'react';

// interface ReviewCardProps {
//   name: string;
//   imageUrl: string;
//   review: string;
//   rating: number; // between 0 and 5
// }

// const ReviewCard: React.FC<ReviewCardProps> = ({ name, imageUrl, review, rating }) => {
//   const renderStars = () => {
//     return Array.from({ length: 5 }, (_, index) => (
//       <span
//         key={index}
//         className={`text-xl sm:text-2xl ${
//           index < rating ? 'text-yellow-300' : 'text-gray-400'
//         }`}
//       >
//         ★
//       </span>
//     ));
//   };

//   return (
//     <div className="flex flex-col sm:flex-row items-center sm:items-start border border-purple-800 rounded-lg p-4 shadow-sm bg-white w-full max-w-lg mx-auto">
//       {/* Profile Image */}
//       <Image
//         src={imageUrl}
//         alt={`${name}'s profile`}
//         width={48}
//         height={48}
//         className="w-16 h-16 sm:w-12 sm:h-12 rounded-full object-cover mb-3 sm:mb-0 sm:mr-4"
//       />

//       {/* Review Content */}
//       <div className="text-center sm:text-left w-full">
//         {/* Name & Stars */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-between space-y-2 sm:space-y-0">
//           <h4 className="font-semibold text-lg sm:text-xl text-purple-600">{name}</h4>
//           <div className="flex">{renderStars()}</div>
//         </div>

//         {/* Divider */}
//         <hr className="border border-purple-600 my-2 sm:my-1" />

//         {/* Review Text */}
//         <p className="text-gray-600 text-sm sm:text-base font-bold">{review}</p>
//       </div>
//     </div>
//   );
// };

// export default ReviewCard;





import Image from 'next/image';
import React from 'react';

interface ReviewCardProps {
  name: string;
  imageUrl: string;
  review: string;
  rating: number; // between 0 and 5
}

const ReviewCard: React.FC<ReviewCardProps> = ({ name, imageUrl, review, rating }) => {
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-xl sm:text-2xl ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start bg-gradient-to-r from-purple-100 to-white rounded-xl p-6 w-full max-w-lg mx-auto transition-transform transform hover:scale-105">
      {/* Profile Image */}
      <Image
        src={imageUrl}
        alt={`${name}'s profile`}
        width={48}
        height={48}
        className="w-16 h-16 sm:w-14 sm:h-14 rounded-full object-cover border-4 border-purple-400"
      />

      {/* Review Content */}
      <div className="text-center sm:text-left w-full sm:ml-4">
        {/* Name & Stars */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <h4 className="font-semibold text-lg sm:text-xl text-purple-700">{name}</h4>
          <div className="flex">{renderStars()}</div>
        </div>

        {/* Review Text */}
        <p className="text-gray-700 text-sm sm:text-base mt-2 italic">{review}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
