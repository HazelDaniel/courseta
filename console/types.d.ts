import type { PoolClient } from "pg";
import { CourseLessonType2 } from "./client.types";

export type ServerInternalErrorCodeType = "ERR_NO_MATCH" | "ERR_";
export interface ConfigOption {
  hashingOptions: {
    iterations: number;
    keyLength: number;
    digest: string;
    saltByteCount: number;
    encoding: BufferEncoding;
  };
  serverOptions: {
    imageServerBaseUrl: string;
  };
}

export interface DBSessionFunctionType {
  (client: PoolClient): void;
}

export interface ConsoleRootOptionType {
  id: number;
  shortcut: string;
  description: string;
}

interface SessionUserType extends Express.User {
  email: string;
  id: string;
  role: "student" | "creator";
}
export interface CreatorSessionUserType extends SessionUserType {}

export interface StudentSessionUserType extends SessionUserType {}

export type UserRoleType = "student" | "creator";
export type StudentRankType =
  | "novice"
  | "amateur"
  | "senior"
  | "professional"
  | "master"
  | "legendary";

export type AssessmentVariantType = "exam" | "quiz";
export type lessonVariantType = "text" | "video";

export interface ImageMetaType {
  updated_at: string;
  created_at: string;
  id?: string;
  mime_type?: string;
}

export interface StoreImageType {
  imageID: string;
  imageUrl: string;
  createdAt: string;
}

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

export interface CreatorSummaryViewType
  extends Omit<CreatorViewType, "role", "creatorPass"> {
  firstName: string;
  lastName: string;
  averageCourseRating: number;
  courseCount: number;
  studentCount: number;
  courseReviewCount: number;
}

export interface AdminViewType {
  adminID: string;
  email: string;
  password: string;
}

export interface CourseViewType {
  title: string;
  lessonCount: number;
  avatar: string;
  avatarMeta: ImageMetaType;
  courseID: number;
}

export interface StudentCourseViewType extends CourseViewType {
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

export interface CreatorCourseViewType
  extends Omit<CourseViewType, "lessonCount"> {
  avatar: string;
  avatarMeta: ImageMetaType;
  createdAt: string;
  updatedAt: string;
  studentCount: number;
  archived: boolean;
  tags: string[];
}

export interface CreatorCourseEditViewType
  extends Omit<CourseViewType, "lessonCount" | "courseID"> {
  description: string;
  tags: string[];
}

export interface CourseOutlineViewType {
  detail: CourseDetailViewType;
  lessons: CourseOutlineType;
}

export type CourseOutlineType = CourseLessonType2[];
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


export interface BufferLike {
  type: "Buffer";
  data: number[];
}

export interface ServerPayloadType<T> {
  payload?: T;
  message: string | null;
  user?: {
    role: UserRoleType;
    email: string;
    id: string;
  }
}

export interface CreatorAuthResponseType {
  id: string;
  creatorPass: string;
  password: string;
  salt: string;
  role: UserRoleType;
}

export interface StudentAuthResponseType {
  id: string;
  password: string;
  salt: string;
  role: UserRoleType;
}

interface UserAttributeUpdateType {
  userID: string;
  newAvatar?: string;
  oldPassword?: string;
  newPassword?: string;
  firstName?: string;
  lastName?: string;
}

export interface CreatorAttributeUpdateType extends UserAttributeUpdateType {
  avatarMeta?: ImageMetaType;
}

export interface StudentAttributeUpdateType extends UserAttributeUpdateType {
  avatarMeta?: ImageMetaType;
}
