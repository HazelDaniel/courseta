import type { CourseDetailType, CourseEntryType } from "../types";

export const courseData: CourseEntryType[] = [
  {
    imageUrl: "/images/building-soft-skills.jpg",
    title: "introduction to programming",
    lessonCount: 8,
    progress: 34.2,
    id: 0,
    description: "Learn the basics of programming languages and concepts.",
    duration: 10000,
  },
  {
    imageUrl: "/images/programming-1.jpg",
    title: "introduction to programming 2",
    lessonCount: 12,
    progress: 78.5,
    id: 1,
    description:
      "Build upon your programming foundation in this follow-up course.",
    duration: 28080,
  },
  {
    imageUrl: "/images/sticky-notes-introduction.jpg",
    title: "sticky notes - the correct way",
    lessonCount: 9,
    progress: 62.1,
    id: 9,
    description:
      "Master the art of using sticky notes for optimal organization.",
    duration: 25880,
  },
  {
    imageUrl: "/images/computer-networks.jpg",
    title: "introduction to programming",
    lessonCount: 7,
    progress: 15.4,
    id: 10,
    description: "Explore the fundamentals of programming concepts.",
    duration: 38000,
  },
  {
    imageUrl: "/images/programming-1.jpg",
    title: "introduction to programming",
    lessonCount: 10,
    progress: 92.8,
    id: 11,
    description:
      "Another introduction to programming course, consider this a refresher.",
    duration: 18060,
  },
  {
    imageUrl: "/images/building-soft-skills.jpg",
    title: "introduction to programming",
    lessonCount: 6,
    progress: 48.2,
    id: 12,
    description: "Gain programming knowledge through this introductory course.",
    duration: 18260,
  },
  {
    imageUrl: "/images/computer-networks.jpg",
    title: "introduction to programming. a layman's point of view",
    lessonCount: 8,
    progress: 21.7,
    id: 13,
    description: "Learn programming concepts explained for beginners.",
    duration: 48260,
  },
  {
    imageUrl: "//images/building-soft-skills.jpg",
    title: "introduction to programming",
    lessonCount: 11,
    progress: 67.3,
    id: 14,
    description: "Deepen your understanding of programming fundamentals.",
    duration: 48290,
  },
];

export const courseDataDetailed: CourseDetailType[] = [
  {
    imageUrl: "/images/building-soft-skills.jpg",
    title: "Searching algorithms",
    lessonCount: 8,
    progress: 34.2,
    id: 0,
    description: "Learn the basics of programming languages and concepts.",
    duration: 10000,
    lessons: [
      {
        id: 3,
        title: "Lesson 3: Core Principles - Deepening Your Understanding",
        completed: false,
        duration: 1020808,
        contents: [
          {
            id: 1,
            title: "Exploring the Core Principles of the Subject",
            href: "https://en.wikipedia.org/wiki/Search_algorithm",
          },
        ],
        assessment: {
          id: 3,
          completed: false,
          availablePoints: 150,
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
        id: 10,
        title: "Lesson 10: Putting It All Together - Practical Applications",
        completed: false,
        duration: 1020801,
        contents: [
          {
            id: 10,
            title: "Sorting algorithms - A refresher",
            href: "https://en.wikipedia.org/wiki/Sorting_algorithm#:~:text=In%20computer%20science%2C%20a%20sorting,and%20either%20ascending%20or%20descending.",
          },
        ],
        assessment: {
          id: 10,
          completed: false,
          availablePoints: 120,
          questions: [
            {
              id: "1",
              question:
                "What is the process used to verify transactions and add new blocks to a blockchain?",
              points: 80,
              options: [
                {
                  correct: true,
                  text: "Proof of Work (PoW) is a consensus mechanism that uses miners to solve complex puzzles to validate transactions.",
                  quizID: "1",
                  id: "1",
                },
                {
                  correct: false,
                  text: "Proof of Stake (PoS) relies on validators who stake cryptocurrency to secure the network, not solving puzzles.",
                  quizID: "1",
                  id: "2",
                },
                {
                  correct: false,
                  text: "Smart contracts are self-executing contracts, not directly involved in validating transactions.",
                  quizID: "1",
                  id: "3",
                },
    ],
  },
  {
    id: "2",
    question:
      "What is the main advantage of using a blockchain for data storage?",
    points: 20,
    options: [
      {
        correct: true,
        text: "Decentralization in a blockchain ensures data immutability and tamper-proof records.",
        quizID: "2",
        id: "1",
      },
      {
        correct: false,
        text: "Centralized servers often offer faster transaction processing speeds.",
        quizID: "2",
        id: "2",
      },
      {
        correct: false,
        text: "Cryptocurrencies are a specific application built on blockchain technology.",
        quizID: "2",
        id: "3",
      },
    ],
  },
  {
    id: "3",
    question:
      "What is a smart contract and how does it function on a blockchain?",
    points: 30,
    options: [
      {
        correct: true,
        text: "A smart contract is a self-executing program stored on a blockchain that automatically executes when predetermined conditions are met.",
        quizID: "3",
        id: "1",
      },
      {
        correct: false,
        text: "Miners write and deploy smart contracts, not users.",
        quizID: "3",
        id: "2",
      },
      {
        correct: false,
        text: "Blockchain transactions involve transferring cryptocurrency, smart contracts can manage various data and agreements.",
        quizID: "3",
        id: "3",
      },
      {
        correct: false,
        text: "some test question",
        quizID: "3",
        id: "4",
      },
      {
        correct: false,
        text: "Blockchain transactions involve transferring cryptocurrency, smart contracts can manage various data and agreements.",
        quizID: "3",
        id: "5",
      },
    ],
  },
  {
    id: "4",
    question:
      "What are some potential challenges associated with blockchain technology?",
    points: 40,
    options: [
      {
        correct: true,
        text: "Scalability is a challenge for some blockchains, limiting the number of transactions they can process.",
        quizID: "4",
        id: "1",
      },
      {
        correct: false,
        text: "Security is a major strength of blockchain technology.",
        quizID: "4",
        id: "2",
      },
      {
        correct: false,
        text: "Widespread adoption and real-world use cases are still being explored for blockchain.",
        quizID: "4",
        id: "3",
      }, // Combined two points for readability
    ],
  },
          ],
          lostPoints: 0,
        },
      },
    ],
  },
  {
    imageUrl: "/images/programming-1.jpg",
    title: "introduction to programming 2",
    lessonCount: 12,
    progress: 78.5,
    id: 1,
    description:
      "Build upon your programming foundation in this follow-up course.",
    duration: 28080,
    lessons: [],
  },
  {
    imageUrl: "/images/sticky-notes-introduction.jpg",
    title: "sticky notes - the correct way",
    lessonCount: 9,
    progress: 62.1,
    id: 9,
    description:
      "Master the art of using sticky notes for optimal organization.",
    duration: 25880,
    lessons: [],
  },
  {
    imageUrl: "/images/computer-networks.jpg",
    title: "introduction to programming",
    lessonCount: 7,
    progress: 15.4,
    id: 10,
    description: "Explore the fundamentals of programming concepts.",
    duration: 38000,
    lessons: [],
  },
  {
    imageUrl: "/images/programming-1.jpg",
    title: "introduction to programming",
    lessonCount: 10,
    progress: 92.8,
    id: 11,
    description:
      "Another introduction to programming course, consider this a refresher.",
    duration: 18060,
    lessons: [],
  },
  {
    imageUrl: "/images/building-soft-skills.jpg",
    title: "introduction to programming",
    lessonCount: 6,
    progress: 48.2,
    id: 12,
    description: "Gain programming knowledge through this introductory course.",
    duration: 18260,
    lessons: [],
  },
  {
    imageUrl: "/images/computer-networks.jpg",
    title: "introduction to programming. a layman's point of view",
    lessonCount: 8,
    progress: 21.7,
    id: 13,
    description: "Learn programming concepts explained for beginners.",
    duration: 48260,
    lessons: [],
  },
  {
    imageUrl: "//images/building-soft-skills.jpg",
    title: "introduction to programming",
    lessonCount: 0,
    progress: 67.3,
    id: 14,
    description: "Deepen your understanding of programming fundamentals.",
    duration: 48290,
    lessons: [],
  },
];
