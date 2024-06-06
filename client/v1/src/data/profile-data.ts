import type { StudentProfileType } from "../types";

export const userProfile: StudentProfileType = {
  user: {
    avatarURL: "/illustrations/avatar1.jpg",
    email: "john@doe.domain.com",
    name: "John Doe",
    isLoggedIn: false,
    role: "student",
  },
  currentRank: 3,
  ranks: [
    {
      value: 1,
      dateAttained: "2024-04-23T13:04:01.608Z",
    },
    {
      value: 2,
      dateAttained: "2024-05-23T13:04:01.608Z",
    },
    {
      value: 3,
      dateAttained: "2024-02-23T20:04:01.608Z",
    },
  ],
  attemptedCourses: [
    {
      courseURL: "",
      lessonCount: 20,
      percentageCompleted: 48,
      title: "introduction to programming",
    },
    {
      courseURL: "",
      lessonCount: 30,
      percentageCompleted: 48,
      title: "building soft skills",
    },
    {
      courseURL: "",
      lessonCount: 30,
      percentageCompleted: 48,
      title: "building soft skills",
    },
  ],
};
