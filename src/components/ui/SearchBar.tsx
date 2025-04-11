// "use client";

// import { useState, useRef, useEffect } from "react";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { BeatLoader, SkewLoader } from "react-spinners";
// import Loader from "./Loader";

// interface SearchResult {
//   _id: string;
//   name: string;
//   image: string;
//   courseId: number;
// }

// const SearchBar: React.FC = () => {
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [results, setResults] = useState<SearchResult[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
//   const searchContainerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         searchContainerRef.current &&
//         !searchContainerRef.current.contains(event.target as Node)
//       ) {
//         setResults([]); // Hide results if clicked outside
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const query = event.target.value;
//     setSearchTerm(query);

//     if (query.length >= 0) {
//       try {
//         setIsLoading(true);
//         const response = await fetch("/api/Search", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ query }),
//         });
//         if (!response.ok) throw new Error("Failed to fetch search results");

//         const data = await response.json();
//         setResults(data.data);
//       } catch (error) {
//         console.error("Search error:", error);
//         setResults([]);
//       } finally {
//         setIsLoading(false);
//       }
//     } else {
//       setResults([]);
//     }
//   };

//   const redirectToCourse = (courseId: number) => {
//     setIsRedirecting(true);
//     router.push(`/CourseContent/${courseId}`);
//   };

//   return (
//     <div ref={searchContainerRef} className="relative w-full max-w-[500px]">
//       <div className="flex items-center bg-white text-gray-700 rounded-full px-3 py-2 mx-4 flex-grow">
//         <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 mr-2" />
//         <input
//           type="text"
//           placeholder="Search for Anything..."
//           className="w-full bg-transparent text-sm focus:outline-none"
//           value={searchTerm}
//           onChange={handleSearch}
//         />
//       </div>

//       {/* Loader when fetching search results */}
//       {isLoading && (
//         <div className="absolute z-10 mt-2 bg-white shadow-lg rounded-lg w-full flex justify-center p-3">
//           <BeatLoader color="#bc26bc" size={10} />
//         </div>
//       )}

//       {/* Display search results */}
//       {results.length > 0 && !isLoading && (
//         <ul className="absolute z-10 mt-2 bg-white shadow-lg rounded-lg w-full max-h-60 overflow-y-auto">
//           {results.map((item) => (
//             <li
//               key={item._id}
//               onClick={() => redirectToCourse(item.courseId)}
//               className="p-2 border-b text-gray-800 cursor-pointer hover:bg-gray-100 flex items-center space-x-3"
//             >
//               <Image
//                 src={item.image}
//                 alt={item.name}
//                 width={100}
//                 height={100}
//                 className="object-cover"
//               />
//               <span>{item.name}</span>
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* Full Page Loader when redirecting */}
//       {isRedirecting && (
//         <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center z-50">
//           <SkewLoader color="#bc26bc" size={35} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchBar;


"use client";

import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BeatLoader, SkewLoader } from "react-spinners";
// import Loader from "./Loader";

interface SearchResult {
  _id: string;
  name: string;
  image: string;
  courseId: number;
}

const SearchBar: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false); // Track focus state
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setResults([]); // Hide results if clicked outside
        setIsFocused(false); // Remove focus
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (query.length >= 0) {
      try {
        setIsLoading(true);
        const response = await fetch("/api/Search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });
        if (!response.ok) throw new Error("Failed to fetch search results");

        const data = await response.json();
        setResults(data.data);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  const redirectToCourse = (courseId: number) => {
    setIsRedirecting(true);
    router.push(`/CourseContent/${courseId}`);
  };

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-[500px]">
      <div
        className="flex items-center bg-white text-gray-700 rounded-full px-3 py-2 mx-4 flex-grow"
        onClick={() => setIsFocused(true)}
      >
        {/* Toggle between back arrow and search icon */}
        {isFocused ? (
          <ArrowLeftIcon
            className="h-5 w-5 text-gray-500 cursor-pointer"
            onClick={() => {
              setIsFocused(false);
              setSearchTerm(""); // Clear search
              setResults([]); // Hide results
            }}
          />
        ) : (
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 mr-2" />
        )}

        <input
          type="text"
          placeholder="Search for Anything..."
          className="w-full bg-transparent text-sm focus:outline-none"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
        />
      </div>

      {/* Loader when fetching search results */}
      {isLoading && (
        <div className="absolute z-10 mt-2 bg-white shadow-lg rounded-lg w-full flex justify-center p-3">
          <BeatLoader color="#bc26bc" size={10} />
        </div>
      )}

      {/* Display search results */}
      {results.length > 0 && !isLoading && (
        <ul className="absolute z-10 mt-2 bg-white shadow-lg rounded-lg w-full max-h-60 overflow-y-auto">
          {results.map((item) => (
            <li
              key={item._id}
              onClick={() => redirectToCourse(item.courseId)}
              className="p-2 border-b text-gray-800 cursor-pointer hover:bg-gray-100 flex items-center space-x-3"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className="object-cover"
              />
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Full Page Loader when redirecting */}
      {isRedirecting && (
        <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center z-50">
          <SkewLoader color="#bc26bc" size={35} />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
