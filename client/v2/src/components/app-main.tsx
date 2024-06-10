import {
  Await,
  useAsyncValue,
  useLoaderData,
  useRouteLoaderData,
} from "react-router-dom";
import { courseData } from "../data/course-list";
import { AuthType, CourseListType, UserType } from "../types";
import { AnnouncementTab } from "./announcement-tab";
import {
  AppMainStyled,
  CurrentCourseSectionStyled,
  RecommendedCourseSectionStyled,
  WelcomeBoardStyled,
} from "./app-main.styles";
import { SmallCourseCard } from "./small-course-card";
import { WideCourseCard } from "./wide-course-card";
import axios from "axios";
import { BASE_URL } from "../config";
import React, { useEffect } from "react";

const WelcomeBoard: React.FC<{ user: UserType }> = ({ user }) => {
  return (
    <WelcomeBoardStyled>
      <div className="wp-left">
        <span>welcome,</span>
        <h2>{user.name}</h2>
      </div>
      <div className="wp-right">
        <img
          src="/illustrations/community-learning.png"
          alt="community learning illustration"
        />
      </div>
    </WelcomeBoardStyled>
  );
};

const CurrentCourseSection: React.FC = () => {
  const courses = useAsyncValue();
  console.log("courses are : ", courses);

  return (
    <CurrentCourseSectionStyled>
      <div className="ccs-top">
        <p className="home-section-title">Current Course</p>
        <button className="home-section-cta">Continue Course</button>
      </div>
      <div className="ccs-bottom">
        <WideCourseCard entry={courseData[1]} />
      </div>
    </CurrentCourseSectionStyled>
  );
};

const RecommendedCourseSection: React.FC<{ courses: CourseListType }> = ({
  courses,
}) => {
  return (
    <RecommendedCourseSectionStyled>
      <div className="rcs-top">
        <p className="home-section-title">Recommended Courses</p>
      </div>
      <div className="rcs-bottom">
        <ul className="list-course-cards">
          {courses.slice(0, 4).map((entry) => {
            return (
              <SmallCourseCard
                entry={entry}
                withCTA={true}
                variant="home"
                key={entry.id}
              />
            );
          })}
        </ul>
      </div>
    </RecommendedCourseSectionStyled>
  );
};

export const AppMain: React.FC = () => {
  const authData: AuthType = useRouteLoaderData("root") as AuthType;
  const { user } = authData;

  const coursesRes = axios.get(`${BASE_URL}/courses/`);

  return (
    <AppMainStyled>
      <div className="app-main-content">
        <WelcomeBoard user={user} />
        <React.Suspense fallback={<div>loading...</div>}>
          <Await
            resolve={coursesRes}
            errorElement={<div>couldn't fetch courses</div>}
          >
            <CurrentCourseSection />
          </Await>
          </React.Suspense>
        <RecommendedCourseSection courses={courseData} />
      </div>

      <AnnouncementTab />
    </AppMainStyled>
  );
};
