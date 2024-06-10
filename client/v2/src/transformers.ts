import { DBUserType, UserType } from "./types";

export const transformUserProfile: (user: DBUserType) => UserType = (user) => {
  const tmpUser: Partial<UserType> = {};
  tmpUser.avatarURL = user.avatar;
  tmpUser.isLoggedIn = true;
  tmpUser.email = user.email;
  tmpUser.name = user.name;
  tmpUser.role = "student";
  return tmpUser as UserType;
};
