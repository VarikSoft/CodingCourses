import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

export default function Lesson() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(() => {
    const stored = localStorage.getItem(`completedSteps-${id}`);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  useEffect(() => {
    fetch(`/lessons/${id}.json`)
      .then((res) => res.json())
      .then((data) => {
        setLesson(data);
        setCode(data.steps[0].starterCode);
        setStepIndex(0);
        setOutput("");
      });
  }, [id]);

  const runCode = async () => {
    if (!lesson) return;
    const source_code = code;
    const expected = lesson.steps[stepIndex].tests[0].expectedOutput;

    setLoading(true);
    setOutput("⏳ Running...");

    const res = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "50d237e559msh30dda0a387172c1p16deb2jsn31c35015daf0", // This key is provided for demo use only and may expire at any time.
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
      },
      body: JSON.stringify({ language_id: 71, source_code })
    });

    const data = await res.json();
    const result = data.stdout?.trim() || data.stderr || "Execution error";
    setLoading(false);

    if (result === expected) {
      const updated = new Set(completedSteps);
      updated.add(stepIndex);
      setCompletedSteps(updated);
      localStorage.setItem(`completedSteps-${id}`, JSON.stringify([...updated]));
      setOutput(`✅ Correct!\n\nOutput: ${result}`);
    } else {
      setOutput(`❌ Incorrect\n\nExpected: ${expected}\nReceived: ${result}`);
    }
  };

  if (!lesson) return <div className="p-4">Loading...</div>;

  const step = lesson.steps[stepIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top bar */}
      <div className="bg-white p-4 border-b shadow flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-700">{lesson.title}</h1>
        <Link
          to="/"
          className="text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded hover:bg-blue-100"
        >
          🏠 Back to Main Menu
        </Link>
      </div>

      {/* Roadmap */}
      <div className="bg-white p-4 border-b flex gap-2 overflow-x-auto shadow-sm">
        {lesson.steps.map((s, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded-full font-medium transition border text-sm whitespace-nowrap ${
              i === stepIndex
                ? "bg-blue-600 text-white"
                : completedSteps.has(i)
                ? "bg-green-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => {
              setStepIndex(i);
              setCode(lesson.steps[i].starterCode);
              setOutput("");
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Task Section */}
        <div className="w-1/2 lg:w-1/3 p-6 bg-white overflow-y-auto border-r">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">📘 Task</h2>
          <p className="text-gray-700 mb-6 whitespace-pre-line leading-relaxed">{step.description}</p>
          <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded shadow-sm">
            <p className="font-semibold mb-1">💡 Explanation:</p>
            <p className="text-sm leading-relaxed">{step.explanation}</p>
          </div>
        </div>

        {/* Code Editor & Output */}
        <div className="w-1/2 lg:w-2/3 p-6 bg-gray-50 flex flex-col">
          <div className="rounded border shadow overflow-hidden">
            <Editor
              height="300px"
              defaultLanguage="python"
              value={code}
              onChange={(value) => setCode(value)}
              theme="vs-dark"
              options={{ fontSize: 14, minimap: { enabled: false } }}
            />
          </div>

          <div className="mt-4 flex justify-start">
            <button
              onClick={runCode}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow text-sm"
              disabled={loading}
            >
              ▶️ {loading ? "Running..." : "Run Code"}
            </button>
          </div>

          <div className="mt-4 bg-black text-white p-4 rounded font-mono h-40 overflow-y-auto text-sm shadow-inner whitespace-pre-wrap">
            {output || "👉 Output will appear here"}
          </div>
        </div>
      </div>
    </div>
  );
}
