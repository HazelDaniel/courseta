export interface AnnouncementItem {
  target: "creators" | "students";
  title: string;
  details?: string;
  dateDelivered: string;
}

export interface AnnouncementGroupType {
  announcementDate: string;
  announcements: AnnouncementItem[];
}

export type RankRange = 1 | 2 | 3 | 4 | 5 | 6;

export interface RankType {
  level: RankRange;
  title: string;
  icon: string;
  xpRange: { max: number; min: number };
}

export interface CourseAttemptType {
  lessonCount: number;
  title: string;
  percentageCompleted: number;
  courseURL: string;
}

export interface UserType {
  avatarURL: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
  role: "creator" | "student";
}

export interface ProfileType {
  user: UserType;
}

export interface StudentProfileType extends ProfileType {
  currentRank: RankRange;
  ranks: {
    value: RankRange;
    dateAttained: string;
  }[];
  attemptedCourses: CourseAttemptType[] | null;
}

export interface QuizOptionType {
  correct: boolean;
  text: string;
  quizID: string;
  id: string;
}
export interface QuizType {
  id: string;
  question: string;
  points: number;
  options: QuizOptionType[];
}

export interface CreatorProfileType extends ProfileType {}

export interface CourseEntryType {
  imageUrl: string;
  title: string;
  lessonCount: number;
  progress: number;
  id: number;
  description: string;
  duration: number; // in seconds
}

export type CourseListType = CourseEntryType[];

export interface CourseFilterOptionType {
  text: string;
  id: number;
}

export interface CourseFilterType {
  selected: number;
  filterName: string;
  filterTitle: string;
  options: CourseFilterOptionType[];
}

type PossibleAccessmentState<T> = T extends "generic"
  ? "passed" | "failed"
  : "passed" | "failed" | "no-attempt";

export interface CourseAssessmentType {
  status: PossibleAccessmentState<"generic">;
  courseID: string;
  dateAttempted: string;
  percentScore?: number;
}
export interface ExamAssessmentType
  extends Omit<CourseAssessmentType, "courseID"> {
  status: PossibleAccessmentState<"exam">;
  examID: number;
}

export interface AssessmentDataType {
  average: {
    exams: number;
    courses: number;
  };
  exams: ExamAssessmentType[];
  courses: CourseAssessmentType[];
}

export interface CourseContentType {
  id: number;
  title: string;
  href: string;
  type?: "video" | "text";
}

export interface LessonAssessmentType {
  id: number;
  completed: boolean;
  questions: QuizType[];
  lostPoints: number;
  availablePoints: number;
}
export interface CourseLessonType {
  id: number;
  title: string;
  completed: boolean;
  contents: CourseContentType[];
  assessment: LessonAssessmentType;
  courseTitle: string;
  duration: number;
}

export interface CourseDetailType extends CourseEntryType {
  lessons: Partial<CourseLessonType>[];
}

export interface AuthType {
  token: string | null;
  user: UserType;
}

export interface DBUserType extends Pick<UserType, "email" | "name"> {
  points: number;
  rank: string;
  avatar: "string";
}
