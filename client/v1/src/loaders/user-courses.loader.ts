import { json } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import { courseData } from "../data/course-list";

export const userCoursesLoader: (
  args: LoaderFunctionArgs
) => Promise<Response> = async (args) => {
  try {
    const { request } = args;
    const searchParams = new URL(request.url).searchParams;
    const searchTerm: string | null = searchParams.get("search");

    if (searchTerm) {
      return json(
        courseData.filter((course) => {
          return course.title.includes(searchTerm);
        })
      );
    }
    return json(courseData);
  } catch (err) {
    console.log("we hit this error route", err);
    throw new Response("not found", { status: 404 });
  }
};
