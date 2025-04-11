import { Link } from "react-router-dom";

export default function MainMenu() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-700">Learning Platform</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link to="/Courses" className="bg-white border border-gray-200 rounded-xl p-6 shadow hover:shadow-md transition text-center">
          <h2 className="text-2xl font-semibold text-green-700 mb-2">🚀 Start Learning</h2>
          <p className="text-gray-600">Choose a course and begin your journey!</p>
        </Link>

        <Link to="/Editor" className="bg-white border border-dashed border-blue-400 rounded-xl p-6 shadow hover:shadow-md transition text-center">
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">🛠 Lesson Editor</h2>
          <p className="text-gray-600">Create and edit your own lessons.</p>
        </Link>
      </div>
    </div>
  );
}