import Image from "next/image";
import Link from "next/link";
import { ICourse } from "../models/Course";

interface ImageCardProps {
  course: ICourse;
}

const ImageCard: React.FC<ImageCardProps> = ({ course }) => {
  return (
    <Link href={`/LectureScreen/${course.courseId}`} passHref>
      <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition duration-300">
        <div className="relative w-full h-40 mb-4">
          <Image
            src={course.image}
            alt={course.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <h4 className="text-lg font-semibold">{course.name}</h4>
        <p className="text-gray-600">{course.shortDescription}</p>
        <p className="text-sm text-gray-500 mt-2">{course.category}</p>
      </div>
    </Link>
  );
};

export default ImageCard;
