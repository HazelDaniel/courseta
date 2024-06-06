import { CourseBannerStyled } from "./course-banner.styles";
import type { CourseEntryType } from "../types";
import { useCallback } from "react";
import { convertSecondsToHms } from "../utils/conversion";

export const CourseBanner: React.FC<{ course: CourseEntryType }> = ({
  course,
}) => {
  const courseDurationString = useCallback(() => {
    const { hours, minutes, seconds } = convertSecondsToHms(course.duration);
    return `${hours}hr ${minutes}min ${seconds}s`;
  }, [course.duration]);

  return (
    <CourseBannerStyled>
      <img
        src={course.imageUrl}
        alt="the course banner image"
        className="banner-image"
      />
      <h3 className="course-creator-name-text">Courseta Edtech's</h3>
      <h2 className="course-banner-title">{course.title}</h2>
      <div className="course-banner-stat-div">
        <div className="stat-part">
          <span>
            <svg>
              <use xlinkHref="#levels"></use>
            </svg>
          </span>
          <p>Beginners</p>
        </div>

        <div className="stat-part">
          <span>
            <svg>
              <use xlinkHref="#clock"></use>
            </svg>
          </span>
          <p>{courseDurationString()}</p>
        </div>

        <div className="stat-part">
          <span>
            <svg>
              <use xlinkHref="#star-filled"></use>
            </svg>
          </span>
          <p>
            4.2 {"\u0009"} {"\u0009"} (244)
          </p>
        </div>
      </div>
      <button className="course-banner-cta">enroll</button>
    </CourseBannerStyled>
  );
};
