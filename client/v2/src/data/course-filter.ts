import type { CourseFilterType } from "../types";

export const filterData: CourseFilterType[] = [
  {
    selected: 0,
    filterName: "courses-filter-input-posted-since",
    filterTitle: "posted since",
    options: [
      { text: "yesterday", id: 0 },
      { text: "last 1 week", id: 1 },
      { text: "last 1 month", id: 2 },
      { text: "last 1 year", id: 3 },
      { text: "forever", id: 4 },
    ],
  },
  {
    selected: 0,
    filterName: "courses-filter-input-min-duration",
    filterTitle: "min duration",
    options: [
      { text: "1 min", id: 0 },
      { text: "30 mins", id: 1 },
      { text: "1 hour", id: 2 },
    ],
  },
  {
    selected: 0,
    filterName: "courses-filter-input-max-duration",
    filterTitle: "max duration",
    options: [
      { text: "1 hour", id: 0 },
      { text: "10 hours", id: 1 },
      { text: "24 hours", id: 2 },
    ],
  },
];
