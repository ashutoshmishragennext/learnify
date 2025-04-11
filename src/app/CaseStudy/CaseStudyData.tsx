import React from "react";

interface Requirement {
  title: string;
  details: string[];
}

interface Step {
  category: string;
  items: string[];
}

interface Deliverable {
  description: string;
}

interface Evaluation {
  criteria: string[];
}

interface CaseStudyProps {
  title: string;
  reward: string;
  objective: string;
  scenario: string;
  requirements: Requirement[];
  steps: Step[];
  deliverables: Deliverable[];
  evaluation: Evaluation;
  uploadAction: () => void; // Callback for the upload button
}

const CaseStudy: React.FC<CaseStudyProps> = ({
  title,
  reward,
  objective,
  scenario,
  requirements,
  steps,
  deliverables,
  evaluation,
  uploadAction,
}) => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <header className="bg-purple-600 text-white py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold">{title}</h1>
          <span className="bg-white text-purple-600 py-1 px-3 rounded-full text-sm font-semibold">
            {reward}
          </span>
        </header>

        {/* Objective */}
        <main className="p-6">
          <h2 className="text-lg font-bold text-purple-600 mb-4">Objective</h2>
          <p className="text-gray-700 mb-6">{objective}</p>

          {/* Scenario */}
          <section className="mb-6">
            <h3 className="text-lg font-bold text-purple-600">Scenario</h3>
            <p className="text-gray-700 mt-2">{scenario}</p>
          </section>

          {/* Requirements */}
          <section className="mb-6">
            <h3 className="text-lg font-bold text-purple-600">Requirements</h3>
            <ul className="list-decimal ml-6 mt-2 space-y-4 text-gray-700">
              {requirements.map((req, index) => (
                <li key={index}>
                  <strong>{req.title}:</strong>
                  <ul className="list-disc ml-6 mt-2">
                    {req.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>

          {/* Steps */}
          <section className="mb-6">
            <h3 className="text-lg font-bold text-purple-600">
              Steps to Complete the Case Study
            </h3>
            {steps.map((step, index) => (
              <div key={index} className="mt-4">
                <h4 className="font-semibold text-gray-700">{step.category}</h4>
                <ul className="list-disc ml-6 mt-2 text-gray-700">
                  {step.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Deliverables */}
          <section className="mb-6">
            <h3 className="text-lg font-bold text-purple-600">Deliverables</h3>
            <ul className="list-disc ml-6 mt-2 text-gray-700">
              {deliverables.map((deliverable, index) => (
                <li key={index}>{deliverable.description}</li>
              ))}
            </ul>
          </section>

          {/* Evaluation */}
          <section>
            <h3 className="text-lg font-bold text-purple-600">Evaluation Criteria</h3>
            <ul className="list-disc ml-6 mt-2 text-gray-700">
              {evaluation.criteria.map((criterion, index) => (
                <li key={index}>{criterion}</li>
              ))}
            </ul>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 py-4 px-6 text-center">
          <button
            onClick={uploadAction}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
          >
            Upload
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CaseStudy;
