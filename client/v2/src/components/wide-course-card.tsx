import { CSSProperties } from "styled-components";
import type { CourseEntryType } from "../types";
import { WideCourseCardStyled } from "./wide-course-card.styles";
import { Link } from "react-router-dom";

export const WideCourseCard: React.FC<{
  entry: CourseEntryType;
}> = ({ entry }) => {
  return (
    <WideCourseCardStyled className="course-card">
      <div className="card-left">
        <img
          src={entry.imageUrl}
          alt="a thumbnail image of a course on an edtech platform"
        />
        <Link to={`/courses/${entry.id}`}></Link>
      </div>
      <div className="card-right">
        <h3>{entry.lessonCount} lessons</h3>
        <p className="card-title">{entry.title}</p>
        <div className="card-progress-area">
          <div className="card-progress-bar">
            <span
              className="card-progress"
              style={
                { "--progress-here": `${entry.progress}%` } as CSSProperties
              }
            ></span>
          </div>
          <span className="card-progress-count">
            {Math.round(entry.progress)}%
          </span>
        </div>
      </div>
    </WideCourseCardStyled>
  );
};
