import type {
  AssessmentDataType,
  CourseAssessmentType,
  ExamAssessmentType,
} from "../types";

export const courseAssessments: CourseAssessmentType[] = [
  {
    status: "passed",
    courseID: "1",
    dateAttempted: "2024-05-20",
    percentScore: 85.5,
  },
  {
    status: "failed",
    courseID: "1",
    dateAttempted: "2024-05-25",
    percentScore: 67.2,
  },
  {
    status: "passed",
    courseID: "3",
    dateAttempted: "",
    percentScore: 0,
  },
];

export const examAssessments: ExamAssessmentType[] = [
  {
    status: "passed",
    dateAttempted: "2024-05-15",
    percentScore: 92.1,
    examID: 12380,
  },
  {
    status: "failed",
    dateAttempted: "2024-05-22",
    percentScore: 78.9,
    examID: 12810,
  },
  {
    status: "no-attempt",
    dateAttempted: "",
    percentScore: 98.7,
    examID: 10850,
  },
  {
    status: "failed",
    dateAttempted: "2024-05-18",
    percentScore: 62.4,
    examID: 10810,
  },
  {
    status: "passed",
    dateAttempted: "2024-05-21",
    percentScore: 89.3,
    examID: 32810,
  },
];

export const assessmentData: AssessmentDataType = {
  average: {
    courses: 40,
    exams: 80.4,
  },
  courses: courseAssessments,
  exams: examAssessments,
}
