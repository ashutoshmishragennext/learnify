import React from "react";

interface Benefit {
  id: number;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    id: 1,
    title: "Flexible Learning Schedule",
    description:
      "Fit your coursework around your existing commitments and obligations.",
  },
  {
    id: 2,
    title: "Expert Instruction",
    description:
      "Learn from industry experts who have hands-on experience in design and development.",
  },
  {
    id: 3,
    title: "Diverse Course Offerings",
    description:
      "Explore a wide range of design and development courses covering various topics.",
  },
  {
    id: 4,
    title: "Updated Curriculum",
    description:
      "Access courses with up-to-date content reflecting the latest trends and industry practices.",
  },
  {
    id: 5,
    title: "Practical Projects and Assignments",
    description:
      "Develop a portfolio showcasing your skills and abilities to potential employers.",
  },
  {
    id: 6,
    title: "Interactive Learning Environment",
    description:
      "Collaborate with fellow learners, exchanging ideas and feedback to enhance your understanding.",
  },
];

const BenefitsSection: React.FC = () => {
  return (
    <div className="py-8 mb-6 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        {/* Title Section */}
        <h2 className="text-3xl text-left font-bold text-purple-700">Benefits</h2>
        <p className="text-gray-600 text-left mt-4">
          Lorem ipsum dolor sit amet consectetur. Tempus tincidunt etiam eget
          elit id imperdiet et. Cras eu sit dignissim lorem nibh et. Ac cum eget
          habitasse in velit fringilla feugiat senectus in.
        </p>
      
      </div>

      {/* Benefits Grid */}
      <div className="container mx-auto px-6 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit) => (
          <div
            key={benefit.id}
            className="flex flex-col items-center text-center"
          >
            {/* Number */}
            <div className="text-purple-600 text-4xl font-bold">{`0${benefit.id}`}</div>
            {/* Title */}
            <h3 className="text-xl text-left mx-2 font-semibold text-gray-800 mt-4">
              {benefit.title}
            </h3>
            {/* Description */}
            <p className="text-gray-600 mx-2 text-left mt-2">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsSection;
