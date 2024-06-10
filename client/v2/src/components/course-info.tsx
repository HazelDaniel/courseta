import { useCallback } from "react";
import type { CourseDetailType } from "../types";
import { CourseAccordion } from "./course-accordion";
import { CourseInfoStyled } from "./course-info.styles";
import { CourseStatInfo } from "./course-stat-info";
import { convertSecondsToHms } from "../utils/conversion";

export const CourseInfo: React.FC<{ course: CourseDetailType }> = ({
  course,
}) => {
  const courseDurationString = useCallback(() => {
    const { hours, minutes, seconds } = convertSecondsToHms(course.duration);
    return `${hours}hr ${minutes}min ${seconds}s`;
  }, [course.duration]);

  return (
    <CourseInfoStyled>
      <h2 className="course-desc-title">About this course</h2>
      <p className="course-desc">
        {course.description || "No description provided for this course"}
      </p>

      <div className="course-info-area">
        <div className="area-left">
          <ul className="horizontal-file-tab">
            <li>
              <a href="" className="active">
                <span>outline</span>
              </a>
            </li>
            <li>
              <a href="">
                <span>Reviews (980)</span>
              </a>
            </li>
          </ul>

          <div className="course-outline-area">
            <div className="coa-top">
              <div className="coa-top-left">
                <div>
                  <span>
                    <svg>
                      <use xlinkHref="#star-stroked"></use>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="coa-top-right">
                <h2>Course Outline</h2>
                <div className="course-outline-stat-div">
                  <p>{course.lessonCount} lessons</p> <span></span>
                  <p>{courseDurationString()} Total length</p>
                </div>
              </div>
            </div>

            <div className="coa-bottom">
              <CourseAccordion variant="outline" course={course} />
            </div>
          </div>
        </div>
        <CourseStatInfo />
      </div>
    </CourseInfoStyled>
  );
};
