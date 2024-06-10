import { useState } from "react";
import { CourseFilterType } from "../types";
import { CourseFilterSelectStyled } from "./course-filter-select.styles";

export const CourseFilterSelect: React.FC<{ data: CourseFilterType }> = ({
  data,
}) => {
  const [filterState, setFilterState] = useState<CourseFilterType>(data);
  const [toggleState, setToggleState] = useState<"expanded" | "collapsed">(
    "collapsed"
  );

  return (
    <CourseFilterSelectStyled>
      <h2 className="filter-title">{data.filterTitle}</h2>

      <div className="filter-select">
        <div
          className="filter-select-display"
          onMouseDown={() => {
            if (toggleState === "collapsed") {
              setToggleState("expanded");
              return;
            }
            setToggleState("collapsed");
          }}
        >
          <p>{filterState.options[filterState.selected].text}</p>
          <span className={toggleState === "collapsed" ? "flipped" : ""}>
            <svg
              viewBox="0 0 16 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.304691 8.6704C0.109588 8.47622 0 8.21301 0 7.93858C0 7.66415 0.109588 7.40094 0.304691 7.20677L7.25031 0.302861C7.44566 0.108929 7.71046 -4.47518e-07 7.98655 -4.47518e-07C8.26264 -4.47518e-07 8.52744 0.108929 8.72278 0.302861L15.6684 7.20677C15.7708 7.30158 15.8529 7.4159 15.9098 7.54294C15.9668 7.66997 15.9974 7.8071 15.9998 7.94614C16.0023 8.08519 15.9766 8.22331 15.9242 8.35226C15.8718 8.48121 15.7938 8.59835 15.6949 8.69668C15.5959 8.79502 15.4781 8.87254 15.3483 8.92463C15.2186 8.97671 15.0797 9.00229 14.9398 8.99984C14.7999 8.99739 14.6619 8.96695 14.5341 8.91035C14.4063 8.85375 14.2913 8.77214 14.1959 8.6704L7.98655 2.4983L1.77716 8.6704C1.58182 8.86433 1.31702 8.97326 1.04093 8.97326C0.764837 8.97326 0.500037 8.86433 0.304691 8.6704Z"
                fill="#CAC8C8"
              />
            </svg>
          </span>
        </div>

        <form action="" className={toggleState}>
          {filterState.options.map((entry) => {
            return (
              <div className="courses-filter-input-wrapper" key={entry.id}>
                <label htmlFor={`${filterState.filterName}${entry.id}`}>
                  {entry.text}
                </label>
                <input
                  type="radio"
                  name={filterState.filterName}
                  id={`${filterState.filterName}${entry.id}`}
                  className={entry.id === filterState.selected ? "active" : ""}
                  onChange={(event: React.FormEvent<HTMLInputElement>) => {
                    if (!event.currentTarget.checked) return;
                    setFilterState({ ...filterState, selected: entry.id });
                    setToggleState("collapsed");
                  }}
                />
              </div>
            );
          })}
        </form>
      </div>
    </CourseFilterSelectStyled>
  );
};
