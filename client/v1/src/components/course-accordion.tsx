import { useCallback } from "react";
import { CourseDetailType, CourseLessonType } from "../types";
import { CourseContentIcon } from "./course-content-icon";
import { convertSecondsToHms } from "../utils/conversion";
import { Link, useLocation, useParams } from "react-router-dom";
import { NoContent } from "./no-content";

const CourseLessonLayout: React.FC<{
  lesson: CourseLessonType;
  variant: "outline" | "details";
}> = ({ lesson, variant }) => {
  const lessonDurationString = useCallback(() => {
    const { hours, minutes, seconds } = convertSecondsToHms(lesson.duration);
    return `${hours}hr ${minutes}min ${seconds}s`;
  }, [lesson.duration]);
  const params = useParams();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const courseIDParam = params["course_id"];
  const courseID = courseIDParam || search.get("course_id");
  const lessonIDParam = params["lesson_id"] || search.get("lesson_id") || "";

  return (
    <>
      <div className="accordion-head first">
        <p>{lesson.title}</p>
        <div className="head-right">
          {variant !== "details" ? (
            <div className="duration-details">
              <p>{lesson.contents.length} contents</p>
              <span></span>
              <p>{`${lessonDurationString()}`}</p>
            </div>
          ) : null}
          <span
            className={
              variant === "details"
                ? "accordion-controller shrinked"
                : "accordion-controller"
            }
          >
            <svg
              viewBox="0 0 16 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.304691 8.6704C0.109588 8.47622 0 8.21301 0 7.93858C0 7.66415 0.109588 7.40094 0.304691 7.20677L7.25031 0.302861C7.44566 0.108929 7.71046 -4.47518e-07 7.98655 -4.47518e-07C8.26264 -4.47518e-07 8.52744 0.108929 8.72278 0.302861L15.6684 7.20677C15.7708 7.30158 15.8529 7.4159 15.9098 7.54294C15.9668 7.66997 15.9974 7.8071 15.9998 7.94614C16.0023 8.08519 15.9766 8.22331 15.9242 8.35226C15.8718 8.48121 15.7938 8.59835 15.6949 8.69668C15.5959 8.79502 15.4781 8.87254 15.3483 8.92463C15.2186 8.97671 15.0797 9.00229 14.9398 8.99984C14.7999 8.99739 14.6619 8.96695 14.5341 8.91035C14.4063 8.85375 14.2913 8.77214 14.1959 8.6704L7.98655 2.4983L1.77716 8.6704C1.58182 8.86433 1.31702 8.97326 1.04093 8.97326C0.764837 8.97326 0.500037 8.86433 0.304691 8.6704Z"
                fill="var(--text-color)"
              />
            </svg>
          </span>
        </div>
      </div>
      <ul className="accordion-content-list">
        {lesson.contents.map((content) => {
          return (
            // <></> don't forget that there's an active class functionality on the li item
            <li
              className={
                +lessonIDParam === lesson.id
                  ? "accordion-content active"
                  : "accordion-content"
              }
              key={content.id}
            >
              <span className="content-icon-wrapper">
                <CourseContentIcon type={content.type || "text"} />
              </span>
              <Link
                className="accordion-content-text"
                to={`/courses/${courseID}/lessons/${lesson.id}#${content.id}`}
              >
                {content.title}
              </Link>
            </li>
          );
        })}

        {!lesson.assessment.completed ? (
          <li
            className={
              +lessonIDParam === lesson.id
                ? "accordion-content active"
                : "accordion-content"
            }
          >
            <span className="content-icon-wrapper">
              <CourseContentIcon type="quiz" />
            </span>
            <Link
              className="accordion-content-text"
              to={`/assessments/${lesson.assessment.id}?course_id=${courseID}&lesson_id=${lesson.id}`}
            >
              {`Quiz: ${lesson.title}`}
            </Link>
            <div className="accordion-content-badge">
              <p>{lesson.assessment.availablePoints}xp</p>
              <svg
                viewBox="0 0 12 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.5 14C0.367392 14 0.240215 13.9473 0.146447 13.8536C0.0526785 13.7598 0 13.6326 0 13.5V1.12906C3.57728e-05 0.998057 0.0343858 0.869347 0.0996304 0.755744C0.164875 0.642142 0.258738 0.547611 0.371875 0.481562C0.75 0.261875 1.51188 0 3 0C4.16281 0 5.46344 0.459688 6.61094 0.865C7.535 1.19156 8.40781 1.5 9 1.5C9.76233 1.49769 10.5166 1.34366 11.2188 1.04688C11.3043 1.01078 11.3974 0.996406 11.4898 1.00503C11.5822 1.01366 11.671 1.04502 11.7484 1.09632C11.8257 1.14762 11.8892 1.21726 11.9331 1.29904C11.977 1.38082 12 1.47218 12 1.565V8.42C11.9999 8.5415 11.9643 8.66033 11.8977 8.76196C11.8311 8.86358 11.7364 8.94359 11.625 8.99219C11.3528 9.11125 10.3591 9.5 9 9.5C8.24563 9.5 7.30062 9.27688 6.30031 9.04031C5.17594 8.77469 4.01344 8.5 3 8.5C1.84781 8.5 1.25813 8.67437 1 8.78469V13.5C1 13.6326 0.947321 13.7598 0.853553 13.8536C0.759785 13.9473 0.632608 14 0.5 14Z"
                  fill="#2D6B10"
                />
              </svg>
            </div>
          </li>
        ) : null}
      </ul>
    </>
  );
};

export const CourseAccordion: React.FC<{
  variant: "outline" | "details";
  course: CourseDetailType;
}> = ({ variant, course }) => {
  return (
    <div
      className={`course-outline-accordion${
        variant === "details" ? " details" : ""
      }`}
    >
      {course.lessons.length >= 1 && course.lessonCount >= 1 ? (
        course.lessons.map((lesson) => {
          lesson = { ...lesson, courseTitle: course.title };
          return (
            <CourseLessonLayout
              lesson={lesson as CourseLessonType}
              variant={variant}
              key={lesson.id}
            />
          );
        })
      ) : (
        <NoContent text="No Lessons For This Course" />
      )}
    </div>
  );
};
