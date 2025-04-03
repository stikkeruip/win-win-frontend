import CourseCard from "@/components/course-card"
import { courses } from "@/lib/data"

export default function Training() {
  return (
    <div className="bg-white py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="text-[#FFA94D]">Training</span> <span className="text-[#74C0FC]">Courses</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Explore our multilingual courses designed to enhance your skills and knowledge
          </p>
        </div>

        {/* Course filters - placeholder for now */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-gray-50 p-4">
          <div className="text-lg font-medium">Filter Courses</div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100">
              All Courses
            </button>
            <button className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100">
              English
            </button>
            <button className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100">
              Spanish
            </button>
            <button className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100">
              French
            </button>
          </div>
        </div>

        {/* Course grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  )
}

