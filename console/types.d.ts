export interface DBSessionFunctionType {
  (client: PoolClient): void;
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

export enum AuthPosition {ADMIN_AUTH, USER_AUTH};

export interface StudentViewType {
  id: string;
  rank: StudentRankType;
  points: number;
  role: UserRoleType;
  avatarUrl: string;
}