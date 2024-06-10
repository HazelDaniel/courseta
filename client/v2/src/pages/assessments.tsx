import type {
  AssessmentDataType,
  CourseAssessmentType,
  ExamAssessmentType,
} from "../types";
import {
  AssessmentAreaStyled,
  AssessmentItemStyled,
  AssessmentStyled,
} from "./assessments.styles";

export const AssessmentCard: React.FC<{
  entry: CourseAssessmentType | ExamAssessmentType;
}> = ({ entry }) => {
  return (
    <AssessmentItemStyled className="course-assessment">
      <span
        className={`assessment-badge ${entry.status}`}
        title="assessment status"
      >
        {entry.status}
      </span>
      <div className="assessment-card-items">
        {!("examID" in entry) ? (
          <div className="card-item">
            <span className="bullet"></span>
            <a href={`/courses/${entry.courseID}`}>course link</a>
          </div>
        ) : (
          <div className="card-item">
            <span className="bullet"></span> <p>Exam ID</p>{" "}
            <span>{entry.examID}</span>
          </div>
        )}

        <div className="card-item">
          <span className="bullet"></span> <p>date completed</p>{" "}
          <span>{entry.dateAttempted || "N/A"}</span>
        </div>
        <div className="card-item">
          <span className="bullet"></span> <p>score</p>{" "}
          <span>{entry.percentScore}%</span>
        </div>
      </div>
    </AssessmentItemStyled>
  );
};

const AssessmentListArea: React.FC<{
  data: AssessmentDataType;
  type: "exams" | "courses";
}> = ({ data, type }) => {
  const { average } = data;
  return (
    <AssessmentAreaStyled className="assessments-area">
      <p className="assessment-type-title">
        {type === "courses" ? "Course Assessments" : "exams"}
      </p>

      <div className="average-score-area">
        <h2>Average score</h2>
        <div className="average-score-progress-area">
          <div>
            <span className="progress-parent">
              <span
                className="progress"
                style={{ width: `${average[type]}%` }}
              ></span>
            </span>
          </div>
          <p className="average-score-count">{average[type]}%</p>
        </div>
      </div>
      <ul className="course-assessments-list">
        {data[type].map((entry, idx) => {
          return <AssessmentCard entry={entry} key={idx} />;
        })}
      </ul>
    </AssessmentAreaStyled>
  );
};

export const Assessments: React.FC<{ data: AssessmentDataType }> = ({
  data,
}) => {
  return (
    <AssessmentStyled>
      <p className="section-title">All Assessments</p>
      <div className="assessments-container">
        <AssessmentListArea data={data} type="courses" />
        <AssessmentListArea data={data} type="exams" />
      </div>
    </AssessmentStyled>
  );
};
