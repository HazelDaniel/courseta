import styled from "styled-components";
import { debug } from "../styles/globals";

export const CourseStatInfoStyled = styled.aside`
  width: 35rem;
  height: max-content;
  min-height: 30rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  gap: 10rem;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
  .course-stat-info-area {
    width: 100%;
    max-width: 35rem;
    height: max-content;
    .course-stat-info {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3rem;
      .stat-info-top {
        width: 100%;
        height: max-content;
        display: flex;
        flex-direction: inherit;
        overflow: hidden;
        padding: 2rem;
        padding-top: 3rem;
        background-color: var(--bright-color);
        border-radius: 1.5rem;
        border: 1px solid var(--label-color);
        .stat-info-list {
          height: max-content;
          min-height: 15rem;
          width: 100%;
          li {
            height: 5rem;
            width: 100%;
            display: flex;
            align-items: center;
            border-bottom: 1px solid var(--label-color);
            padding: 0 1rem;
            justify-content: space-between;
            p {
              font-size: 1.5rem;
              font-weight: 500;
            }
            span {
              color: var(--logo-color);
              font-size: 1.2rem;
            }
          }
        }
        .stat-info-share-area {
          width: 100%;
          overflow: hidden;
          height: 10rem;
          display: flex;
          align-items: center;
          button {
            border: unset;
            outline: unset;
            background-color: unset;
            &::focus,
            &:hover {
              border: unset;
            }
            width: 100%;
            height: 4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            span {
              height: 80%;
              width: 3rem;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 2rem;
              svg {
                width: 100%;
                transform: scale(0.6);
                path {
                  fill: var(--text-color);
                }
              }
            }
          }
        }
      }
    }
    .course-cta-area {
      width: 100%;
      height: 5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      button {
        height: 100%;
        width: 14rem;
        min-width: max-content;
        background-color: var(--primary-color);
        color: var(--bg-color);
        border-radius: 0.8rem;
        text-transform: capitalize;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        &:focus,
        &:hover {
          border: 1px solid var(--bright-color);
        }
        &.secondary {
          background-color: var(--bg-color);
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
        }
      }
    }
  }
  .creator-stat-info-area {
    width: 100%;
    height: max-content;
    position: relative;
    --uniform-ra-height: 8rem;
    padding-bottom: var(--uniform-ra-height);
    border-radius: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;

    .creator-stat-info {
      /* height: 20rem; */
      height: max-content;
      overflow: hidden;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      border: 1px solid var(--label-color);
      border-radius: inherit;
      margin-bottom: -2rem;
      background-color: var(--bright-color);
      z-index: 3;
      position: relative;
      padding: 1.5rem;
      .top {
        width: 100%;
        height: 5rem;
        overflow: hidden;
        display: flex;
        align-items: center;
        gap: 1rem;
        .creator-icon-wrapper {
          width: 4rem;
          height: 4rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0.15rem solid var(--label-color);
          svg {
            width: 100%;
            height: 100%;
            transform: scale(0.4);
          }
        }
        p {
          font-size: 1.5rem;
        }
      }
      .middle {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 8rem;
        overflow: hidden;
        .creator-name-title-area {
          width: max-content;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          font-size: 1.5rem;
          .creator-name {
            width: max-content;
            font-weight: 500;
            text-align: start;
            margin-right: auto;
            font-weight: 600;
          }
          .creator-title {
            width: max-content;
            text-align: start;
          }
        }
        .creator-avatar-area {
          width: 8rem;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            aspect-ratio: 1 / 1;
          }
        }
      }
      .bottom {
        width: 100%;
        display: flex;
        gap: 1rem;
        height: max-content;
        align-items: center;
        p,
        span {
          display: inline-flex;
          color: #7e7e7e;
          font-size: 1.2rem;
        }
        span {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background-color: var(--label-color);
        }
      }
    }
    .author-stat-ratings-area {
      position: absolute;
      content: "";
      display: block;
      width: 100%;
      height: var(--uniform-ra-height);
      bottom: 0;
      left: 0;
      z-index: 0;
      background-color: var(--active-text-bg);
      border-bottom-right-radius: inherit;
      border-bottom-left-radius: inherit;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 var(--padding_M);
      padding-top: 2rem;
      font-size: 1.3rem;
      border: 1px solid var(--label-color);
      .ratings-area-left {
        width: max-content;
        display: flex;
        gap: 0.5rem;
        align-items: center;
        span {
          width: 1.5rem;
          height: 1.5rem;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          svg {
            width: 100%;
            /* height: 100%; */
          }
        }
      }
      .ratings-area-right {
        width: max-content;
        display: flex;
        gap: 0.5rem;
        align-items: center;
        span {
          width: 1.2rem;
          height: 1.2rem;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          svg {
            width: 100%;
            height: 100%;
            /* transform: scale(0.8); */
          }
        }

        p {
          text-align: end;
          width: max-content;
          font-weight: 600;
        }
      }
    }
  }
`;
