import type { NextFunction, Request, Response } from "express";
import { ServerError } from "../../../utils.js";
import {
  CreatorSessionUserType,
  StudentSessionUserType,
} from "../../../types.d";

export const creatorsLocalProtected = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated())
    next(
      new ServerError("only authenticated creators can access this route", 401)
    );
  next();
};

export const creatorIDProtected = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { creator_id: creatorID } = req.params;
  if ((req.user as CreatorSessionUserType).id !== creatorID)
    next(new ServerError("you are not allowed to access this route!", 403));
  next();
};

export const studentsLocalProtected = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated())
    next(
      new ServerError("only authenticated students can access this route", 401)
    );
  next();
};

export const studentIDProtected = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { student_id: studentID } = req.params;
  if ((req.user as StudentSessionUserType).id !== studentID)
    next(new ServerError("you are not allowed to access this route!", 403));
  next();
};
