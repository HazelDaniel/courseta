import { AnnouncementsData } from "../data/announcement-data";
import type { AnnouncementGroupType } from "../types";
import { AnnouncementTabStyled } from "./announcement-tab.styles";

const computeTimeWithMeridian = (dateString: string) => {
  const dateComputed = new Date(dateString);
  const template = `${(dateComputed.getHours() % 12 || 12)
    .toString()
    .padStart(2, "0")}:${dateComputed
    .getMinutes()
    .toString()
    .padStart(2, "0")} ${dateComputed.getHours() > 12 ? "pm" : "am"}`;
  return template;
};


export const AnnouncementTabList: React.FC<{ data: AnnouncementGroupType }> = ({
  data,
}) => {
  const timeDeltaHours: number =
    (new Date().getTime() - new Date(data.announcementDate).getTime()) /
    3600000;

  return (
    <>
      <div className="announcement-tab-separator">
        <h3>
          {timeDeltaHours <= 24
            ? "TODAY"
            : timeDeltaHours <= 48
            ? "YESTERDAY"
            : data.announcementDate}
        </h3>
        <span></span>
      </div>

      <ul className="at-item-list">
        {data.announcements.map((entry, i) => {
          return (
            <li className="announcement-tab-item" key={i}>
              <span className={`ati-badge ${entry.target}`}>
                {" "}
                {entry.target}{" "}
              </span>
              <div className="ati-body">
                <p>{entry.title}</p>
                <div className="ati-expand-cta" tabIndex={0}>
                  <span>
                    <svg>
                      <use xlinkHref="#caret-right"></use>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="ati-time-area">
                {computeTimeWithMeridian(entry.dateDelivered)}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export const AnnouncementTab: React.FC = () => {
  return (
    <AnnouncementTabStyled>
      <div className="at-top">
        <h2>Announcements</h2>
        <button>view all</button>
      </div>
      <div className="at-bottom">
        {AnnouncementsData.map((entry, i) => {
          return <AnnouncementTabList data={entry} key={i} />;
        })}
      </div>
    </AnnouncementTabStyled>
  );
};
