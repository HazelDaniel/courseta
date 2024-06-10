import { useEffect, useRef } from "react";
import { CountdownCircleStyled } from "../components/countdown-circle.styles";
import { Pagination } from "../components/pagination";
import type { CourseEntryType } from "../types";
import { UserCoursesStyled } from "./user-courses.styles";
import { SmallCourseCard } from "../components/small-course-card";
import { CourseFilter } from "../components/course-filter";
import { useLoaderData } from "react-router-dom";
import { NoContent } from "../components/no-content";

void Pagination;

export const StaticProgress: React.FC<{ entry: CourseEntryType }> = ({
  entry,
}) => {
  const progressRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!progressRef || !textRef) return;
    const progressEl = progressRef.current as SVGCircleElement;

    const percentage = progressEl.getAttribute("data-value")!;
    const color = progressEl.getAttribute("data-stroke");
    const radius = progressEl.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const stroke = circumference - (circumference * +percentage) / 100;

    progressEl.style.setProperty("--stroke-dashoffset", stroke.toString());
    progressEl.style.setProperty(
      "--stroke-dasharray",
      circumference.toString()
    );
    progressEl.style.setProperty("--stroke", color);
  }, [progressRef]);

  return (
    <CountdownCircleStyled className="course-entry-progress">
      <div className="skill">
        <svg>
          <circle cx="15" cy="15" r="50%"></circle>
          <circle
            className="progress"
            cx="15"
            cy="15"
            r="50%"
            data-value={entry.progress}
            data-stroke="var(--countdown-circle-stroke-here)"
            ref={progressRef}
          ></circle>
        </svg>
        <span
          className="data-progress"
          data-value={entry.progress}
          ref={textRef}
        >
          {Math.round(entry.progress)}%
        </span>
      </div>
    </CountdownCircleStyled>
  );
};

export const UserCourses: React.FC<{
  isGeneric: boolean;
}> = ({ isGeneric }) => {
  const courses: CourseEntryType[] = useLoaderData() as CourseEntryType[];
  void isGeneric;

  return (
    <UserCoursesStyled>
      <div className="courses-top">
        <h2>{isGeneric ? "All Courses" : "My Courses"}</h2>
        {isGeneric ? <CourseFilter /> : null}
      </div>
      <div className="courses-bottom">
        <ul className="courses-list-container">
          {courses.length ? (
            courses.map((entry) => {
              return (
                <SmallCourseCard
                  entry={entry}
                  withCTA={isGeneric}
                  variant="others"
                  key={entry.id}
                />
              );
            })
          ) : (
            <NoContent text="No courses to show" />
          )}
        </ul>

        {/* <div className="courses-pagination-area">
          <Pagination itemsPerPage={5} key={1}/>
        </div> */}
      </div>
    </UserCoursesStyled>
  );
};
