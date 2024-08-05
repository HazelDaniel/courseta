import type { NextFunction, Request, Response } from "express";
import { ServerError } from "../../../utils.js";
import { CreatorSessionUserType } from "../../../types.d";

export const localProtected = (
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