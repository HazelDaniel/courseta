import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import {
  CourseCreationPayloadType,
  ImageCreationPayloadType,
} from "../../../../client.types";
import { CourseModel } from "../../../../models/v1/course.model.js";
import { ServerError } from "../../../../utils.js";
import v2Config, { API_VERSION } from "../../config.js";
import GlobalRouteCache from "express-pubsubcache";

export const createCourse = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const creatorID = req.params.creator_id;
  const courseCreationPayload: CourseCreationPayloadType =
    req.body as CourseCreationPayloadType;
  const courseTitle = courseCreationPayload.info?.title;
  const courseDescription = courseCreationPayload.info?.description;
  const [courseThumbnail, courseImage] = courseCreationPayload.images as [
    string,
    string
  ];
  const tags = courseCreationPayload.info?.tags as string;
  const generatedImageID = randomUUID();
  const pendingCourse = new CourseModel(
    courseTitle || "",
    courseDescription || "",
    courseThumbnail,
    creatorID,
    tags,
    undefined,
    undefined,
    undefined,
    generatedImageID
  );
  let imageUploadRequest: any = null;
  const imageUploadpayload: ImageCreationPayloadType = {
    id: generatedImageID,
    imageUrl: courseImage,
  };
  if (!!courseImage)
    imageUploadRequest = await fetch(
      `${v2Config.serverOptions.imageServerBaseUrl}/api/v2/images`,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: "",
        },
        method: "post",
        body: JSON.stringify(imageUploadpayload),
      }
    );

  if (!imageUploadRequest || (imageUploadRequest && imageUploadRequest.ok)) {
    const courseID = await pendingCourse.save(creatorID);
    const resPayload: ServerPayloadType<number> = {
      payload: courseID,
      message: "course creation success!",
      ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
    };

    res.status(201).json(resPayload);

    const { creator_id } = req.params;
    const affectedRoutes = [
      `/api/${API_VERSION}/creators/${creator_id}/me`,
      `/api/${API_VERSION}/courses/:course_id/creator/summary`,
    ];
    for (const route of affectedRoutes) {
      GlobalRouteCache.pub(route);
    }
    return;
  } else {
    if (
      imageUploadRequest.status - 400 < 99 &&
      imageUploadRequest.status >= 400
    )
      throw new ServerError("could not upload image!. check inputs ", 400);
    else
      throw new ServerError(
        "something went wrong uploading the image. please try again.",
        imageUploadRequest.status
      );
  }
};
