import { useState } from "react";
import { filterData } from "../data/course-filter";
import { CourseFilterSelect } from "./course-filter-select";
import { CourseFilterStyled } from "./course-filter.styles";

export const CourseFilter: React.FC = () => {
  const [filterVisible, setFilterVisible] = useState<boolean>(false);

  return (
    <CourseFilterStyled>
      <div className="filter-controller-area">
        <h2>filter results</h2>
        <div className="filter-controller-parent">
          <span
            className="filter-icon"
            tabIndex={0}
            onMouseDown={() => {
              setFilterVisible(!filterVisible);
            }}
          >
            <svg>
              <use xlinkHref="#filter"></use>
            </svg>
          </span>
          <span
            className={filterVisible ? "chevron-icon" : "chevron-icon flipped"}
          >
            <svg>
              <use xlinkHref="#caret-up"></use>
            </svg>
          </span>
        </div>
      </div>

      {filterVisible ? (
        <div className="filter-select-area">
          <ul className="filter-select-parent">
            {filterData.map((entry, idx) => {
              return <CourseFilterSelect data={entry} key={idx} />;
            })}
          </ul>
          <button
            className="filter-select-cta"
            onClick={() => {
              setFilterVisible(false);
            }}
          >
            Apply Filter
          </button>
        </div>
      ) : null}
    </CourseFilterStyled>
  );
};
