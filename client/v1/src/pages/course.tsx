import { useParams } from "react-router-dom";
import { CourseBanner } from "../components/course-banner";
import { CourseInfo } from "../components/course-info";
import { courseData, courseDataDetailed } from "../data/course-list";
import { CourseStyled } from "./course.styles";
import type { CourseDetailType } from "../types";
import { NotFound } from "./not-found";

export const Course: React.FC = () => {
  const UrlParams = useParams();
  const courseID = UrlParams["course_id"];
  let course: CourseDetailType | null = null;
  if (courseID) {
    course = courseDataDetailed.filter((course) => course.id === +courseID)[0];
  }

  if (course) {
    return (
      <CourseStyled>
        <CourseBanner course={course} />
        <CourseInfo course={course} />
      </CourseStyled>
    );
  } else {
    return <NotFound />;
  }
};
