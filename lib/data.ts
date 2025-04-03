import type { Course } from "./types"

export const courses: Course[] = [
  {
    id: "intro-to-programming",
    title: "Introduction to Programming",
    description: "Learn the fundamentals of programming with this beginner-friendly course.",
    languages: ["English", "Spanish", "French"],
    level: "Beginner",
    duration: "4 weeks",
  },
  {
    id: "web-development",
    title: "Web Development Fundamentals",
    description: "Master HTML, CSS, and JavaScript to build modern websites.",
    languages: ["English", "Spanish"],
    level: "Intermediate",
    duration: "6 weeks",
  },
  {
    id: "data-science",
    title: "Data Science Essentials",
    description: "Explore data analysis, visualization, and machine learning basics.",
    languages: ["English", "French"],
    level: "Intermediate",
    duration: "8 weeks",
  },
  {
    id: "mobile-app-dev",
    title: "Mobile App Development",
    description: "Create cross-platform mobile applications using React Native.",
    languages: ["English"],
    level: "Advanced",
    duration: "10 weeks",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing Strategies",
    description: "Learn effective digital marketing techniques for the modern web.",
    languages: ["English", "Spanish", "French"],
    level: "Beginner",
    duration: "5 weeks",
  },
  {
    id: "graphic-design",
    title: "Graphic Design Principles",
    description: "Master the fundamentals of visual design and communication.",
    languages: ["English", "Spanish"],
    level: "Beginner",
    duration: "6 weeks",
  },
]

