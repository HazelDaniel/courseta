import React, { useMemo } from "react";
import {
  CreatorProfileBottomStyled,
  GenericProfileStyled,
  RankListStyled,
  StudentProfileBottomStyled,
} from "./profile.styles";
import { RankCompleteIcon } from "../components/rank-complete-icon";
import { CreatorProfileType, StudentProfileType } from "../types";
import { rankData } from "../data/user-rank";
import { WideCourseCard } from "../components/wide-course-card";
import { extractDMYFromDateString } from "../utils/conversion";
import { Outlet } from "react-router-dom";
import { courseData } from "../data/course-list";

export const RankList: React.FC<{
  userProfile: StudentProfileType;
}> = ({ userProfile }) => {
  const userRanks = useMemo(
    () => userProfile.ranks.sort((a, b) => a.value - b.value),
    [userProfile]
  );

  return (
    <RankListStyled className="ranks">
      {rankData.map((entry, index) => {
        const completed = userRanks.length - 1 >= index;
        return (
          <li key={index}>
            <span className="complete-indicator">
              <RankCompleteIcon completed={completed} />
            </span>

            <div className="rank-details">
              <img
                src={rankData[index].icon}
                alt="the png image depicting a rank in a gamified e-learning platform"
                className="rank-icon"
              />
              <p className="rank-title">{entry.title}</p>
              <h3 className="rank-date">{`${
                userRanks.length && completed
                  ? extractDMYFromDateString(userRanks[index].dateAttained)
                  : ""
              }`}</h3>
            </div>
            <div className="rank-badge">
              <p>
                ({entry.xpRange.min} - {entry.xpRange.max}) XP
              </p>
            </div>
          </li>
        );
      })}
    </RankListStyled>
  );
};

export const GenericProfile: React.FC<{
  userProfile: StudentProfileType | CreatorProfileType;
}> = ({ userProfile }) => {
  console.log(
    `${rankData[(userProfile as StudentProfileType).currentRank - 1].icon}`
  );
  return (
    <GenericProfileStyled>
      <section className="profile-top">
        <div className="profile-info-area">
          <div className="profile-info-image-wrapper">
            <img
              src="/illustrations/avatar1.jpg"
              alt="the avatar image of the user"
            />
            <span className="profile-role-badge">{userProfile.user.role}</span>
          </div>
          <form className="profile-credentials-editable">
            <div className="input-wrapper">
              <label htmlFor="profile-name-editable">name</label>
              <input
                type="text"
                name="profile_name_update"
                id="profile-name-editable"
                defaultValue={userProfile.user.name}
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="profile-email-editable">email</label>
              <input
                type="email"
                name="profile_email_update"
                id="profile-email-editable"
                defaultValue={userProfile.user.email}
              />
            </div>

            {(() =>
              userProfile.user.role === "student" ? (
                <div className="profile-rank-display-area">
                  <span>Rank</span>
                  <div className="profile-rank-display">
                    <span>
                      <img
                        src={`${
                          rankData[
                            (userProfile as StudentProfileType).currentRank - 1
                          ].icon
                        }`}
                        alt="an icon displaying a student rank badge"
                      />
                    </span>
                    <p>{`${
                      rankData[
                        (userProfile as StudentProfileType).currentRank - 1
                      ].title
                    }`}</p>
                  </div>
                </div>
              ) : null)()}

            <button type="submit">save changes</button>
          </form>
        </div>

        {(() =>
          userProfile.user.role === "student" ? (
            <div className="student-profile-ranks-area profile-aside-details">
              <h2>completed ranks</h2>
              <div className="ranks-wrapper">
                <RankList userProfile={userProfile as StudentProfileType} />
              </div>
            </div>
          ) : null)()}
      </section>

      {(() =>
        userProfile.user.role === "student" ? (
          <StudentProfileBottom />
        ) : userProfile.user.role === "creator" ? (
          <CreatorProfileBottom />
        ) : null)()}
    </GenericProfileStyled>
  );
};

export const StudentProfileBottom: React.FC = () => {
  console.log("rendering student profile bottom");
  return (
    <StudentProfileBottomStyled>
      <div className="profile-bottom-title-div">
        <p>Attempted Courses</p>
        <button>view all courses</button>
      </div>

      <div className="attempted-courses-area">
        <ul>

          {courseData.map((entry) => {
            return <li>
              <WideCourseCard entry={entry}/>
            </li>
          })}

        </ul>
      </div>
    </StudentProfileBottomStyled>
  );
};

export const CreatorProfileBottom: React.FC = () => {
  return <CreatorProfileBottomStyled></CreatorProfileBottomStyled>;
};

// [PROTECTED]
export const Profile: React.FC = () => {
  return <Outlet/>
};
