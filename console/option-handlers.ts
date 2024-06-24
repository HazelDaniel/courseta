import inquirer from "inquirer";
import type {
  HandlerAccessControlType,
  HandlerFunctionType,
  AuthStateType,
  UserRoleType,
} from "./types";
import { ConsoleLogger } from "./utils.js";
import { StudentModel } from "./models/student.model.js";
import { CreatorModel } from "./models/creator.model.js";
import { CourseModel } from "./models/course.model.js";
import { AdminModel } from "./models/admin.model.js";
import { ReviewModel } from "./models/review.model.js";
import { EnrollmentModel } from "./models/enrollment.model.js";
import { UserModel } from "./models/user.model.js";

export enum AuthPosition {
  ADMIN_AUTH,
  CREATOR_AUTH,
  STUDENT_AUTH,
}

const verifyAccess: (
  authState: AuthStateType,
  ac: HandlerAccessControlType
) => boolean = (authState, ac) => {
  switch (ac) {
    case "none":
      return true;
    case "require-admin":
      return authState.status[AuthPosition.ADMIN_AUTH];
    case "require-creator":
      return authState.status[AuthPosition.CREATOR_AUTH] && !!authState.subject;
    case "require-student":
      return authState.status[AuthPosition.STUDENT_AUTH] && !!authState.subject;
    case "require-user":
      return (
        (authState.status[AuthPosition.STUDENT_AUTH] ||
          authState.status[AuthPosition.CREATOR_AUTH]) &&
        !!authState.subject
      );
  }
};

export const handleAuthenticateStudent: HandlerFunctionType = async (
  authState,
  ac
) => {
  void ac;
  const emailPasswordPrompt = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Enter email :",
    },
    {
      type: "password",
      name: "password",
      message: "Enter password :",
    },
  ]);

  const { email, password } = emailPasswordPrompt;
  if (!email || !password) {
    new ConsoleLogger("fail", "credentials not complete!");
    return;
  }
  try {
    const res = await StudentModel.verify(email);
    if (res && res.password === password) {
      authState.status[AuthPosition.STUDENT_AUTH] = true;
      authState.subject = res.studentID;
      new ConsoleLogger("success", "student authenticated successfully!");
    } else {
      new ConsoleLogger("fail", "student not authenticated!");
      return;
    }
  } catch (err) {
    new ConsoleLogger("fail", "error authenticating student");
    return;
  }
};

export const handleAuthenticateCreator: HandlerFunctionType = async (
  authState,
  ac
) => {
  void ac;
  const emailPasswordPrompt = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Enter email :",
    },
    {
      type: "password",
      name: "password",
      message: "Enter password :",
    },
    {
      type: "password",
      name: "creatorPass",
      message: "Enter passkey :",
    },
  ]);

  const { email, password, creatorPass } = emailPasswordPrompt;
  if (!email || !password) {
    new ConsoleLogger("fail", "credentials not complete!");
    return;
  }
  try {
    const res = await CreatorModel.verify(email);
    if (res && res.password === password && res.creatorPass === creatorPass) {
      authState.status[AuthPosition.CREATOR_AUTH] = true;
      authState.subject = res.creatorID;
      new ConsoleLogger("success", "creator authenticated successfully!");
    } else {
      new ConsoleLogger("fail", "creator not authenticated!");
      return;
    }
  } catch (err) {
    new ConsoleLogger("fail", "error authenticating creator");
    return;
  }
};

export const handleAuthenticateUser: HandlerFunctionType = async (
  authState,
  ac
) => {
  if (!!authState.subject) {
    new ConsoleLogger("info", "already authenticated"); // if an explicit user auth has already been performed
    return;
  }
  const userTypePrompt = await inquirer.prompt([
    {
      type: "input",
      name: "response",
      message:
        "WHAT TYPE OF USER ARE YOU?\n\
        1.  => student\n\
        2.  => creator\n\
        3.  => go back [<-]\n\
        \ninput your choice:",
    },
  ]);

  let { response: userTypeResponse } = userTypePrompt;
  userTypeResponse = userTypeResponse?.trim();

  switch (userTypeResponse) {
    case "1":
      await handleAuthenticateStudent(authState, ac);
      break;
    case "2":
      await handleAuthenticateCreator(authState, ac);
      break;
    case "3":
      return;
    default:
      new ConsoleLogger("info", "no valid option picked");
      return;
  }
};

export const handleCreateStudent: HandlerFunctionType = async (
  authState,
  ac
) => {
  if (!verifyAccess(authState, ac)) {
    new ConsoleLogger("fail", "this action is only accessible to admins");
    return;
  }

  const studentCreationPrompt = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Enter email :",
    },
    {
      type: "input",
      name: "firstName",
      message: "Enter first name :",
    },
    {
      type: "input",
      name: "lastName",
      message: "Enter last name :",
    },
    {
      type: "password",
      name: "password",
      message: "Enter password :",
    },
    {
      type: "input",
      name: "avatarUrl",
      message: "Enter avatar url :",
    },
  ]);

  const { email, firstName, lastName, password, avatarUrl } =
    studentCreationPrompt;
  try {
    const pendingStudent = new StudentModel(
      email,
      password,
      firstName,
      lastName,
      avatarUrl
    );
    await pendingStudent.save();
    new ConsoleLogger(
      "success",
      `student (${pendingStudent.studentID}) created successfully!`
    );
  } catch (err) {
    new ConsoleLogger("error", `error creating student. reason: ${err}`);
    return;
  }
};

export const handleCreateCreator: HandlerFunctionType = async (
  authState,
  ac
) => {
  if (!verifyAccess(authState, ac)) {
    new ConsoleLogger("fail", "this action is only accessible to admins");
    return;
  }

  const studentCreationPrompt = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Enter email :",
    },
    {
      type: "input",
      name: "firstName",
      message: "Enter first name :",
    },
    {
      type: "input",
      name: "lastName",
      message: "Enter last name :",
    },
    {
      type: "password",
      name: "password",
      message: "Enter password :",
    },
    {
      type: "input",
      name: "avatarUrl",
      message: "Enter avatar url :",
    },
  ]);

  const { email, firstName, lastName, password, avatarUrl } =
    studentCreationPrompt;
  try {
    const pendingCreator = new CreatorModel(
      email,
      password,
      firstName,
      lastName,
      avatarUrl
    );
    await pendingCreator.save();
    new ConsoleLogger(
      "success",
      `creator (${pendingCreator.creatorID}) created successfully!`
    );
  } catch (err) {
    new ConsoleLogger("error", `error creating creator. reason: ${err}`);
    return;
  }
};

export const handleCreateUser: HandlerFunctionType = async (authState, ac) => {
  if (!verifyAccess(authState, ac)) {
    new ConsoleLogger("fail", "this action is only accessible to admins");
    return;
  }

  const userCreationPrompt = await inquirer.prompt([
    {
      type: "input",
      name: "response",
      message:
        "WHAT TYPE OF USER DO YOU WANT TO CREATE?\n\
        1.  => student\n\
        2.  => creator\n\
        3.  => go back [<-]\n\
        \ninput your choice:",
    },
  ]);

  let { response: userCreationResponse } = userCreationPrompt;
  userCreationResponse = userCreationResponse?.trim();

  switch (userCreationResponse) {
    case "1":
      await handleCreateStudent(authState, ac);
      break;
    case "2":
      await handleCreateCreator(authState, ac);
      break;
    case "3":
      return;
    default:
      new ConsoleLogger("info", "no valid option picked");
      return;
  }
};

export const handleCreateCourse: HandlerFunctionType = async (
  authState,
  ac
) => {
  const isAdminVerified = authState.adminSubject;
  const isCreatorAuthentic = verifyAccess(authState, ac);

  if (!isCreatorAuthentic && !isAdminVerified) {
    new ConsoleLogger("fail", "this action is only accessible to creators");
    return;
  }

  const courseCreationPrompt: {
    title: string;
    description: string;
    thumbnail: string;
    tags: string;
  } = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Enter course title :",
    },
    {
      type: "input",
      name: "description",
      message: "Enter course description :",
    },
    {
      type: "input",
      name: "thumbnail",
      message: "Enter course thumbnail :",
    },
    {
      type: "input",
      name: "tags",
      message: "Enter keywords (space separated) :",
    },
  ]);

  const { title, description, thumbnail, tags } = courseCreationPrompt;
  const pendingCourse = new CourseModel(
    title,
    description,
    thumbnail,
    "",
    tags
  );

  try {
    if (isCreatorAuthentic) {
      pendingCourse.creatorID = authState.subject as string;
      await pendingCourse.save();
      new ConsoleLogger(
        "success",
        `course (${pendingCourse.courseID}) created successfully!`
      );
      return;
    }

    const { isSuperUser: isAdminSuperUser } = await AdminModel.isSuperUser(
      authState.adminSubject
    );

    if (!isAdminSuperUser) {
      new ConsoleLogger("fail", `this admin can't create courses!`);
      return;
    }

    pendingCourse.creatorID = authState.adminSubject as string;
    await pendingCourse.save();
    new ConsoleLogger(
      "success",
      `course (${pendingCourse.courseID}) created successfully!`
    );
    return;
  } catch (err) {
    new ConsoleLogger("error", `error creating course. reason: ${err}`);
    return;
  }
};

export const handleViewCourse: HandlerFunctionType = async (authState, ac) => {
  if (!verifyAccess(authState, ac)) {
    new ConsoleLogger(
      "fail",
      "this action is only accessible to console users"
    );
    return;
  }

  const courseCreationPrompt: {
    courseID: string;
  } = await inquirer.prompt([
    {
      type: "input",
      name: "courseID",
      message: "Enter course id :",
    },
  ]);

  const { courseID } = courseCreationPrompt;

  try {
    const resCourse = await CourseModel.search(courseID);
    CourseModel.display(resCourse);

    return;
  } catch (err) {
    new ConsoleLogger("error", `error getting course view. reason: ${err}`);
    return;
  }
};

export const handleListCourses: HandlerFunctionType = async (authState, ac) => {
  if (!verifyAccess(authState, ac)) {
    new ConsoleLogger(
      "fail",
      "this action is only accessible to console users"
    );
    return;
  }

  await CourseModel.displayAll(CourseModel.all());
  return;
};

export const handleListStudents: HandlerFunctionType = async (
  authState,
  ac
) => {
  if (!verifyAccess(authState, ac)) {
    new ConsoleLogger(
      "fail",
      "this action is only accessible to console users"
    );
    return;
  }

  await StudentModel.displayAll();
  return;
};

export const handleCourseReview: HandlerFunctionType = async (
  authState,
  ac
) => {
  if (!verifyAccess(authState, ac)) {
    new ConsoleLogger("fail", "this action is only accessible to students");
    return;
  }

  const reviewCreationPrompt: {
    courseID: string;
    rating: number;
    reviewText: string;
  } = await inquirer.prompt([
    {
      type: "input",
      name: "courseID",
      message: "Enter course (id) to review :",
    },
    {
      type: "number",
      name: "rating",
      message: "Enter rating (decimals are allowed) :",
    },
    {
      type: "input",
      name: "reviewText",
      message: "Enter review comment :",
    },
  ]);

  const { courseID, rating, reviewText } = reviewCreationPrompt;

  const pendingReview = new ReviewModel(
    authState.subject as string,
    courseID,
    rating,
    reviewText
  );

  try {
    await pendingReview.save();
    new ConsoleLogger("success", "course reviewed successfully!");
  } catch (err) {
    new ConsoleLogger("fail", "course review failed.");
  }
  return;
};

export const handleCourseEnroll: HandlerFunctionType = async (
  authState,
  ac
) => {
  if (!verifyAccess(authState, ac)) {
    new ConsoleLogger("fail", "this action is only accessible to students");
    return;
  }

  const reviewCreationPrompt: {
    courseID: string;
  } = await inquirer.prompt([
    {
      type: "number",
      name: "courseID",
      message: "Enter course (id) to enroll :",
    },
  ]);

  const { courseID } = reviewCreationPrompt;
  const pendingEnrollment = new EnrollmentModel(
    authState.subject as string,
    courseID
  );

  try {
    await pendingEnrollment.save();
    new ConsoleLogger("success", "course enrolled successfully!");
  } catch (err) {
    new ConsoleLogger("fail", "course enrollment failed.");
  }
  return;
};

export const handleCourseUnenroll: HandlerFunctionType = async (
  authState,
  ac
) => {
  if (!verifyAccess(authState, ac)) {
    new ConsoleLogger("fail", "this action is only accessible to students");
    return;
  }

  const unenrollCreationPrompt: {
    courseID: string;
  } = await inquirer.prompt([
    {
      type: "number",
      name: "courseID",
      message: "Enter course (id) to unenroll from :",
    },
  ]);

  const { courseID } = unenrollCreationPrompt;

  try {
    await EnrollmentModel.delete(authState.subject as string, courseID);
    new ConsoleLogger("success", "course unenrolled successfully!");
  } catch (err) {
    new ConsoleLogger("fail", "course un-enrollment failed.");
  }
  return;
};

export const handleListStudentCourses: HandlerFunctionType = async (
  authState,
  ac
) => {
  if (!verifyAccess(authState, ac)) {
    new ConsoleLogger("fail", "this action is only accessible to students");
    return;
  }

  await EnrollmentModel.displayAll(authState.subject as string);
};

export const handleUserInfoUpdate: HandlerFunctionType = async (
  authState,
  ac
) => {
  if (!verifyAccess(authState, ac)) {
    new ConsoleLogger(
      "fail",
      "this action is only accessible to platform users"
    );
    return;
  }

  const userTypePrompt: {
    userType: string;
  } = await inquirer.prompt([
    {
      type: "input",
      name: "userType",
      message:
        "WHAT TYPE OF USER ARE YOU?\n\
      1.  => student\n\
      2.  => creator\n\
      3.  => go back [<-]\n\
      \ninput your choice:",
    },
  ]);

  const { userType } = userTypePrompt;

  switch (userType) {
    case "1":
      await handleStudentOrCreatorInfoUpdate(authState, "student");
      break;
    case "2":
      await handleStudentOrCreatorInfoUpdate(authState, "creator");
      break;
    case "3":
      return;
    default:
      new ConsoleLogger("info", "no valid option picked");
      return;
  }
};

export const handleStudentOrCreatorInfoUpdate = async (
  authState: AuthStateType,
  type: UserRoleType
) => {
  const userInfoPrompt: {
    updateOption: string;
  } = await inquirer.prompt([
    {
      type: "input",
      name: "updateOption",
      message:
        "AVAILABLE UPDATE OPTIONS :\n\
      1.  => profile image\n\
      2.  => email\n\
      3.  => names (first and/or last)\n\
      4.  => password\n\
      5.  => go back [<-]\n\
      \ninput your choice:",
    },
  ]);

  const { updateOption } = userInfoPrompt;

  try {
    switch (updateOption) {
      case "1":
        const avatarResponse = await handleAvatarUpdateFetch();
        const newAvatar = avatarResponse?.newAvatar;
        await StudentModel.updateAvatar(
          authState.subject as string,
          newAvatar,
          "student"
        );
        break;
      case "2":
        const emailResponse = await handleEmailUpdateFetch();
        const email = emailResponse?.email;
        await UserModel.updateEmail(authState.subject as string, email, type);
        break;
      case "3":
        const namesResponse = await handleNamesUpdateFetch();
        const firstName = namesResponse?.firstName || null;
        const lastName = namesResponse?.lastName || null;
        await UserModel.updateNames(
          authState.subject as string,
          firstName,
          lastName,
          type
        );
        break;
      case "4":
        const passwordsResponse = await handlePasswordUpdateFetch();
        const oldPassword = passwordsResponse?.oldPassword;
        const newPassword = passwordsResponse?.newPassword;
        await UserModel.updatePassword(
          authState.subject as string,
          oldPassword,
          newPassword,
          type
        );
        break;
      case "5":
        return;
      default:
        new ConsoleLogger("info", "no valid option picked");
        return;
    }
    new ConsoleLogger("success", "user info update success!");
  } catch (err) {
    new ConsoleLogger(
      "fail",
      `user info update failed! reason: ${
        (err as Error).message || (err as string)
      }`
    );
  }
  return;
};

export const handleAvatarUpdateFetch: () => Promise<{
  newAvatar: string;
}> = async () => {
  return new Promise(async (resolve, reject) => {
    const avatarPrompt: {
      newAvatar: string;
    } = await inquirer.prompt([
      {
        type: "input",
        name: "newAvatar",
        message: "profile image url :",
      },
    ]);

    try {
      resolve(avatarPrompt);
    } catch (err) {
      reject(new Error("error getting email!"));
    }
  });
};

export const handleEmailUpdateFetch: () => Promise<{
  email: string;
}> = async () => {
  return new Promise(async (resolve, reject) => {
    const namesPrompt: {
      email: string;
    } = await inquirer.prompt([
      {
        type: "input",
        name: "email",
        message: "email :",
      },
    ]);

    try {
      resolve(namesPrompt);
    } catch (err) {
      reject(new Error("error getting email!"));
    }
  });
};

export const handleNamesUpdateFetch: () => Promise<{
  firstName: string;
  lastName: string;
}> = async () => {
  return new Promise(async (resolve, reject) => {
    const namesPrompt: {
      firstName: string;
      lastName: string;
    } = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "first name (hit enter to keep) :",
      },
      {
        type: "input",
        name: "lastName",
        message: "last name (hit enter to keep) :",
      },
    ]);

    try {
      resolve(namesPrompt);
    } catch (err) {
      reject(new Error("error getting names!"));
    }
  });
};

export const handlePasswordUpdateFetch: () => Promise<{
  oldPassword: string;
  newPassword: string;
}> = async () => {
  return new Promise(async (resolve, reject) => {
    const passwordPrompt: {
      oldPassword: string;
      newPassword: string;
    } = await inquirer.prompt([
      {
        type: "password",
        name: "oldPassword",
        message: "old password :",
      },
      {
        type: "password",
        name: "newPassword",
        message: "new password :",
      },
    ]);

    try {
      resolve(passwordPrompt);
    } catch (err) {
      reject(new Error("error getting passwords!"));
    }
  });
};

export const handleListStudentRecommendedCourses: HandlerFunctionType = async (
  authState,
  ac
) => {
  if (!verifyAccess(authState, ac)) {
    new ConsoleLogger("fail", "this action is only accessible to students");
    return;
  }

  await CourseModel.displayAll(
    CourseModel.allRecommended(authState.subject as string)
  );
  return;
};

export const handleListStudentRecentUnfinished: HandlerFunctionType = async (
  authState,
  ac
) => {
  if (!verifyAccess(authState, ac)) {
    new ConsoleLogger("fail", "this action is only accessible to students");
    return;
  }

  await CourseModel.displayAll(
    CourseModel.allRecentUnfinished(authState.subject as string)
  );
  return;
};
