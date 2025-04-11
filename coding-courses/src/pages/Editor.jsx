import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Editor() {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([]);
  const navigate = useNavigate();

  const addStep = () => {
    setSteps([
      ...steps,
      {
        title: "",
        description: "",
        explanation: "",
        starterCode: "",
        tests: [{ expectedOutput: "" }],
      },
    ]);
  };

  const removeStep = () => {
    setSteps(steps.slice(0, -1));
  };

  const updateStep = (i, key, value) => {
    const newSteps = [...steps];
    newSteps[i][key] = value;
    setSteps(newSteps);
  };

  const downloadJSON = () => {
    const blob = new Blob(
      [JSON.stringify({ title, steps }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lesson.json";
    a.click();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🛠 Lesson Editor</h1>

      <input
        type="text"
        className="border px-3 py-2 rounded w-full mb-4"
        placeholder="Lesson Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="flex gap-2 mb-4">
        <button
          onClick={addStep}
          className="min-w-[180px] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Step
        </button>

        {steps.length > 0 && (
          <button
            onClick={removeStep}
            className="min-w-[180px] bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            🗑 Remove Step
          </button>
        )}
      </div>

      {steps.map((step, i) => (
        <div key={i} className="mb-4 border p-4 rounded bg-white">
          <input
            className="w-full border px-3 py-2 mb-2"
            placeholder="Step Title"
            value={step.title}
            onChange={(e) => updateStep(i, "title", e.target.value)}
          />
          <textarea
            className="w-full border px-3 py-2 mb-2"
            placeholder="Task Description"
            value={step.description}
            onChange={(e) => updateStep(i, "description", e.target.value)}
          />
          <textarea
            className="w-full border px-3 py-2 mb-2"
            placeholder="Hint / Explanation"
            value={step.explanation}
            onChange={(e) => updateStep(i, "explanation", e.target.value)}
          />
          <textarea
            className="w-full border px-3 py-2 mb-2"
            placeholder="Starter Code"
            value={step.starterCode}
            onChange={(e) => updateStep(i, "starterCode", e.target.value)}
          />
          <input
            className="w-full border px-3 py-2"
            placeholder="Expected Output"
            value={step.tests[0].expectedOutput}
            onChange={(e) => {
              const newSteps = [...steps];
              newSteps[i].tests[0].expectedOutput = e.target.value;
              setSteps(newSteps);
            }}
          />
        </div>
      ))}

      <div className="mt-4 flex flex-col items-left">
        <button
          onClick={downloadJSON}
          className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-2"
        >
          💾 Download JSON
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full max-w-xs bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          🏠 Back to Main Menu
        </button>
      </div>
    </div>
  );
}