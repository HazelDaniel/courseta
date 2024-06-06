import type { CourseLessonType } from "../types";

export const courseLessons: Partial<CourseLessonType>[] = [
  {
    id: 1,
    title: "Lesson 1: Introduction - Welcome and Course Overview",
    completed: false,
    duration: 1000008,
    contents: [
      {
        id: 1,
        title: "Welcome to the Course!",
        href: "/introduction",
      },
    ],
    assessment: {
      id: 1,
      completed: false,
      availablePoints: 200,
      questions: [
        {
          id: "1",
          question: "What is the main objective of this course?",
          points: 1,
          options: [
            {
              id: "1",
              text: "To gain a strong foundation in...",
              correct: true,
              quizID: "1",
            },
            {
              id: "2",
              text: "To simply become familiar with...",
              correct: false,
              quizID: "1",
            },
            {
              id: "3",
              text: "To casually explore...",
              correct: false,
              quizID: "1",
            },
          ],
        },
      ],
      lostPoints: 0,
    },
  },
  {
    id: 2,
    title: "Lesson 2: Foundational Concepts - Building the Blocks",
    completed: true,
    duration: 1000808,
    contents: [
      {
        id: 2,
        title: "Key Concepts Explained in Detail",
        href: "/foundational-concepts",
      },
    ],
    assessment: {
      id: 2,
      completed: true,
      availablePoints: 250,
      questions: [
        // Add questions following the same structure here
      ],
      lostPoints: 2,
    },
  },
  {
    id: 3,
    title: "Lesson 3: Core Principles - Deepening Your Understanding",
    completed: false,
    duration: 1020808,
    contents: [
      {
        id: 1,
        title: "Exploring the Core Principles of the Subject",
        href: "/core-principles",
      },
    ],
    assessment: {
      id: 3,
      completed: false,
      availablePoints: 150,
      questions: [
        // Add questions following the same structure here
      ],
      lostPoints: 0,
    },
  },
  {
    id: 10,
    title: "Lesson 10: Putting It All Together - Practical Applications",
    completed: false,
    duration: 1020801,
    contents: [
      {
        id: 1,
        title: "Applying Your Knowledge Through Practical Exercises",
        href: "/practical-applications",
      },
    ],
    assessment: {
      id: 10,
      completed: false,
      availablePoints: 120,
      questions: [
        // Add questions following the same structure here
      ],
      lostPoints: 0,
    },
  },
];
