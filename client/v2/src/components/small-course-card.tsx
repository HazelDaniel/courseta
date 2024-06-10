import { Link, useNavigate } from "react-router-dom";
import { StaticProgress } from "../pages/user-courses";
import type { CourseEntryType } from "../types";
import { SmallCourseCardStyled } from "./small-course-card.styles";

export const SmallCourseCard: React.FC<{
  entry: CourseEntryType;
  withCTA: boolean;
  variant: "home" | "others";
}> = ({ entry, withCTA, variant }) => {
  const navigate = useNavigate();
  return (
    <SmallCourseCardStyled className={`course-card-wrapper ${variant}`}>
      <div className="course-card-small">
        <div className="top">
          <img
            src={entry.imageUrl}
            alt="image representing a course card in a list of courses"
          />
          {!withCTA ? <Link to={`/courses/${entry.id}`}></Link> : null}
        </div>
        <div className="bottom">
          <p className="card-bottom-text">{entry.title}</p>
          {!withCTA ? (
            <div className="course-circle-progress-wrapper">
              <StaticProgress entry={entry} />
            </div>
          ) : null}
          <div className="course-info-cta-area">
            <p>{entry.lessonCount} lessons</p>
            {withCTA ? (
              <button
                onClick={() => {
                  navigate(`/courses/${entry.id}`);
                }}
              >
                View course
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </SmallCourseCardStyled>
  );
};
