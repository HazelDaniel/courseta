import type { PoolClient } from "pg";
export interface DBSessionFunctionType {
  (client: PoolClient): void;
}

export interface ConsoleRootOptionType {
  id: number;
  shortcut: string;
  description: string;
}

export type UserRoleType = "student" | "creator";
export type StudentRankType =
  | "novice"
  | "amateur"
  | "senior"
  | "professional"
  | "master"
  | "legendary";

export type AssessmentVariantType = "exam" | "quiz";

export interface StudentViewType {
  studentID: string;
  rank: StudentRankType;
  points: number;
  role: UserRoleType;
  avatarUrl: string;
}

export interface CreatorViewType {
  creatorID: string;
  email: string;
  role: UserRoleType;
  creatorPass: string;
  avatarUrl: string;
}

export interface AdminViewType {
  adminID: string;
  email: string;
  password: string;
}

export interface CourseViewType {
  title: string;
  lessonCount: number;
  thumbnail: string;
  courseID: string;
}

export interface CourseSummaryViewType extends CourseViewType {
  progress: number;
}

export interface CourseDetailViewType extends CourseViewType {
  description: string;
  reviewCount: number;
  creatorID: string;
  studentCount: number;
  courseLength: number;
  updatedAt: string;
  averageRating: number;
}

export interface CourseOutlineViewType {
  detail: CourseDetailViewType;
  outline: CourseOutlineType;
}

export type CourseOutlineType = {
  lessonID: string;
  title: string;
  courseID: string;
  contentCount: number;
  totalDuration: number;
  quizID: string;
  totalPoints: number;
  quizTitle: string;
}[];
export interface AuthStateType {
  subject: string | null;
  adminSubject: string | null;
  status: [boolean, boolean, boolean];
}

export type HandlerAccessControlType =
  | "require-admin"
  | "require-creator"
  | "require-student"
  | "require-user"
  | "none";

export interface HandlerFunctionType {
  (authState: AuthStateType, AC: HandlerAccessControlType): void;
}

export interface UserContractType {
  verify(email: string | null): Promise<object | null>;

  updatePassword(
    userID: string,
    oldPassword: string,
    newPassword: string,
    type: UserRoleType
  ): Promise<void>;

  updateNames(
    userID: string,
    firstName: string | null,
    lastName?: string | null,
    type: UserRoleType
  ): Promise<void>;

  updateEmail(
    userID: string,
    newEmail: string,
    type: UserRoleType
  ): Promise<void>;

  updateAvatar(
    userID: string,
    newAvatar: string,
    type: UserRoleType
  ): Promise<void>;
}
