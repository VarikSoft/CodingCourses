import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/lessons/index.json")
      .then((res) => res.json())
      .then((data) => setLessons(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-center">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">Choose a Course</h1>

      <div className="max-w-xl mx-auto flex flex-col gap-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white border rounded-xl shadow p-6 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => navigate(`/lesson/${lesson.id}`)}
          >
            <h2 className="text-xl font-semibold text-blue-700">{lesson.title}</h2>
            <p className="text-gray-600 mt-2">{lesson.description}</p>
          </div>
        ))}
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow"
        >
          🏠 Back to Main Menu
        </button>
        <button
          onClick={() => navigate("/editor")}
          className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full shadow"
        >
          ✏️ Go to Lesson Editor
        </button>
      </div>
    </div>
  );
}