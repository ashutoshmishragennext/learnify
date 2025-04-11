import React from "react";
import { SkewLoader } from "react-spinners";

const Loader: React.FC = () => {
  return (
    // <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-100 bg-opacity-50 backdrop-blur-sm">
    //   <div className="relative flex justify-center items-center">
    //     <div className="absolute w-14 h-14 border-4 border-transparent border-t-purple-500 border-r-purple-500 rounded-full animate-spin"></div>
    //     <div className="w-10 h-10 border-4 border-transparent border-t-purple-500 border-l-purple-500 rounded-full animate-spin-slow"></div>
    //   </div>
    // </div>
    // <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center z-50">
    //       <SkewLoader color="#bc26bc" size={35} />
    // </div>
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-transparent backdrop-blur-sm">
      <SkewLoader color="#bc26bc" size={35} />
    </div>

  );
};

export default Loader;
