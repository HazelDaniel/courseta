import { Quiz } from "../components/quiz";
import {
  CourseAccesssmentAreaStyled,
  CourseDetailsStyled,
  CourseSideTabStyled,
  LessonContentBodyStyled,
} from "./course-details.styles";
import { Logo } from "../components/logo";
import { CourseAccordion } from "../components/course-accordion";
import { CountdownCircle } from "../components/countdown-circle";
import { courseDataDetailed } from "../data/course-list";
import {
  CourseDetailType,
  CourseLessonType,
  LessonAssessmentType,
} from "../types";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";
import type { Location } from "react-router-dom";
import { NotFound } from "./not-found";
import { useCallback, useEffect, useRef, useState } from "react";
import { convertSecondsToHms } from "../utils/conversion";

export const CourseSideTab: React.FC<{ course: CourseDetailType | null }> = ({
  course,
}) => {
  if (!course) {
    return null;
  }

  return (
    <CourseSideTabStyled>
      <Logo />

      <div className="course-side-tab-body">
        <p>{course.title}</p>
        <CourseAccordion variant="details" course={course} />
      </div>
    </CourseSideTabStyled>
  );
};

export const AssessmentForm: React.FC<{
  assessment: LessonAssessmentType;
}> = ({ assessment }) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (formRef.current) {
      formRef.current.reset();
    }
  }, [location.search, formRef]);

  return (
    <form
      ref={formRef}
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        console.log(Object.fromEntries(formData));
        console.log("form submitted");
      }}
    >
      <div className="accessment-wrapper">
        {assessment.questions.length ? (
          assessment.questions.map((entry, idx) => {
            return (
              <Quiz
                value={entry}
                key={idx}
                key_={idx + 1}
                assessmentID={assessment.id}
              />
            );
          })
        ) : (
          <div className="no-content">
            <span>
              <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512"
                xmlSpace="preserve"
              >
                <g>
                  <g>
                    <path
                      d="M507.494,426.066L282.864,53.537c-5.677-9.415-15.87-15.172-26.865-15.172c-10.995,0-21.188,5.756-26.865,15.172
                  L4.506,426.066c-5.842,9.689-6.015,21.774-0.451,31.625c5.564,9.852,16.001,15.944,27.315,15.944h449.259
                  c11.314,0,21.751-6.093,27.315-15.944C513.508,447.839,513.336,435.755,507.494,426.066z M256.167,167.227
                  c12.901,0,23.817,7.278,23.817,20.178c0,39.363-4.631,95.929-4.631,135.292c0,10.255-11.247,14.554-19.186,14.554
                  c-10.584,0-19.516-4.3-19.516-14.554c0-39.363-4.63-95.929-4.63-135.292C232.021,174.505,242.605,167.227,256.167,167.227z
                  M256.498,411.018c-14.554,0-25.471-11.908-25.471-25.47c0-13.893,10.916-25.47,25.471-25.47c13.562,0,25.14,11.577,25.14,25.47
                  C281.638,399.11,270.06,411.018,256.498,411.018z"
                    />
                  </g>
                </g>
              </svg>
            </span>
            no assessment to show!
          </div>
        )}
      </div>

      {assessment.questions.length ? (
        <div className="quiz-cta-area">
          <button className="quiz-d" type="submit">
            SUBMIT
          </button>
        </div>
      ) : null}
    </form>
  );
};

export const AssessmentCountdown: React.FC<{ duration: number }> = ({
  duration,
}) => {
  const [countdownTime, setCountdownTime] = useState(duration);
  const countdownRef = useRef(null);
  const calcCountdownTime = useCallback(() => {
    return convertSecondsToHms(countdownTime);
  }, [countdownTime]);

  const calcDuration = useCallback(() => {
    return convertSecondsToHms(duration);
  }, [duration]);

  return (
    <>
      <CountdownCircle
        duration={20}
        setCountdownTime={setCountdownTime}
        countdownTime={countdownTime}
      />
      <ul className="countdown-elapsed-area">
        <li ref={countdownRef}>
          <span>time left</span>
          {`${calcCountdownTime().hours}hr ${calcCountdownTime().minutes}min ${
            calcCountdownTime().seconds
          }s`}
        </li>
        <li>
          <span>duration</span>
          {`${calcDuration().hours}hr ${calcDuration().minutes}min ${
            calcDuration().seconds
          }s`}
        </li>
      </ul>
    </>
  );
};

export const BackToCourseCTA: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const courseID = params.get("course_id");
  const courseURL = `/courses/${courseID}`;

  return (
    <button
      className="accessment-cta"
      onClick={() => {
        navigate(courseURL);
      }}
    >
      <span>
        <svg>
          <use xlinkHref="#return-back"></use>
        </svg>
      </span>
      back to course
    </button>
  );
};

export const AssessmentBody: React.FC<{
  isLinkedResource: boolean;
  assessment: LessonAssessmentType | null;
}> = ({ isLinkedResource, assessment }) => {
  const params = useParams();
  let assessmentID: number;

  void params;

  if (!assessment && isLinkedResource) return <NotFound />;
  if (!isLinkedResource) {
    // assessmentID = +(params["assessment_id"] as string);
    assessment = courseDataDetailed[0].lessons[0]
      .assessment as LessonAssessmentType;
  }

  return (
    <>
      <div className="accessment-cta-area">
        <button className="accessment-cta">
          <span>
            <svg>
              <use xlinkHref="#share"></use>
            </svg>
          </span>
          share
        </button>

        {isLinkedResource ? <BackToCourseCTA /> : null}
      </div>

      {!isLinkedResource ? (
        <div className="accessment-countdown-area">
          <div className="countdown-area-left">
            <p>{!isLinkedResource ? `Examination` : "Quiz"}</p>
          </div>
          <div className="countdown-area-right">
            <AssessmentCountdown duration={100} />
          </div>
        </div>
      ) : null}

      <div className="accessment-description-area">
        <p>
          {!isLinkedResource ? (
            <i>This exam tests your foundation in the previous courses taken</i>
          ) : (
            <i>
              This quiz tests your basic understanding of the current lesson
            </i>
          )}
        </p>
      </div>
      <AssessmentForm assessment={assessment as LessonAssessmentType} />
    </>
  );
};

export const LessonContentBody: React.FC<{
  contentID?: number;
  lesson: CourseLessonType;
}> = ({ contentID = 0, lesson }) => {
  const location = useLocation();
  const locationHashArray = location.hash.split("#");
  contentID =
    (locationHashArray.length >= 2 ? +locationHashArray[1] : null) ?? contentID;
  const content = lesson.contents.filter(
    (content) => content.id === contentID
  )[0];

  if (content) {
    return (
      <LessonContentBodyStyled>
        <h1>{lesson.courseTitle}</h1>
        <h2>Resource</h2>
        <div className="resource-header-div">
          <span>title: </span>
          <p>{`${content.title}`}</p>
        </div>
        <iframe src={content.href} frameBorder="0"></iframe>
      </LessonContentBodyStyled>
    );
  } else {
    return <NotFound />;
  }
};

type Combinable =
  | [true, { lessonID: string; courseID: string }]
  | [false, null];

const getLinkedResourceKeys: (
  location: Location,
  paramsURL: URLSearchParams
) => Combinable = (location, paramsURL) => {
  const locationArray = location.pathname.split("/");
  const courseIDKey = paramsURL.get("course_id");
  const lessonIDKey = paramsURL.get("lesson_id");
  if (
    (location.pathname.startsWith("/assessments/") &&
      courseIDKey?.length &&
      lessonIDKey?.length) ||
    (locationArray.length === 5 &&
      locationArray[1] === "courses" &&
      locationArray[3] === "lessons")
  ) {
    return [
      true,
      {
        courseID: (courseIDKey || locationArray[2]) as string,
        lessonID: (lessonIDKey || locationArray[4]) as string,
      },
    ] as Combinable;
  }
  return [false, null] as Combinable;
};

// const useGetCurrentRouteLoader = () => {
//   const assessmentRootData = useRouteLoaderData("assessment-root");
//   const lessonRootData = useRouteLoaderData("lesson-root");

//   return { rootData: assessmentRootData || lessonRootData };
// };

export const CourseDetails: React.FC = () => {
  const location = useLocation();
  const paramsURL = new URLSearchParams(location.search);
  let lesson: CourseLessonType | null = null; // get the lesson id, course id from the url either through params or search
  let course: CourseDetailType | null = null;

  const [isLinkedResource, linkedKeyObject] = getLinkedResourceKeys(
    location,
    paramsURL
  );

  console.log("course detail rendering");

  if (linkedKeyObject) {
    course = courseDataDetailed.filter(
      (course) => course.id === +linkedKeyObject.courseID
    )[0] as CourseDetailType;
    console.log(" course is ", course);
    if (course) {
      lesson = course.lessons.filter(
        (lesson) => lesson.id === +linkedKeyObject.lessonID
      )[0] as CourseLessonType;
      if (lesson) {
        lesson = { ...lesson, courseTitle: course.title };
      } else {
        lesson = null;
      }
    }
  }

  const isOfAssessmentType = location.pathname.startsWith("/assessments");

  return (
    <CourseDetailsStyled>
      <CourseSideTab course={course} />

      <CourseAccesssmentAreaStyled className="course-accessment-area">
        {isOfAssessmentType ? (
          <AssessmentBody
            isLinkedResource={isLinkedResource}
            assessment={lesson?.assessment || null}
          />
        ) : lesson ? (
          <LessonContentBody lesson={lesson} />
        ) : (
          <NotFound />
        )}
      </CourseAccesssmentAreaStyled>
    </CourseDetailsStyled>
  );
};
