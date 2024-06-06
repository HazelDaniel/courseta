import styled from "styled-components";
import { courseAccordionStyle, debug, noContentStyle } from "../styles/globals";

export const CourseDetailsStyled = styled.div`
  width: 100%;
  margin: 0 auto;
  height: max-content;
  min-height: 100vh;
  display: flex;
  margin-top: unset;
  gap: 1px;
  .quiz-cta-area {
    width: 100%;
    height: max-content;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    button {
      height: 5rem;
      width: 18rem;
      border-radius: 0.5rem;
      background-color: var(--badge-color);
      color: var(--bg-color);
      font-size: 2rem;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(0.97);
        border: unset;
      }
      &:focus {
        border: 1px solid var(--label-color);
        outline: unset;
      }
    }
  }
`;

export const CourseSideTabStyled = styled.aside`
  position: fixed;
  top: 0;
  height: 100vh;
  width: 25%;
  overflow: auto;
  background-color: var(--primary-color);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  .course-side-tab-body {
    width: 100%;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    & > p {
      font-family: poppins;
      width: 90%;
      margin: 0 auto;
      height: 5rem;
      font-size: 2rem;
      color: var(--bg-color);
      /* text-align: center; */
      text-wrap: nowrap;
      text-align: start;
      justify-content: center;
      text-transform: capitalize;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .course-outline-accordion {
      ${courseAccordionStyle};
      border-top-right-radius: 2rem;
      border-top-left-radius: 2rem;
      border: 1px solid var(--label-color);
      .accordion-head {
        background-color: var(--active-text-bg);
        .head-right {
          width: 4rem;
          height: 4rem;
          min-width: unset;
          .accordion-controller {
            --text-color: var(--label-color);
          }
        }
        p {
          color: var(--bg-color);
          flex: 1;
        }
      }
      .accordion-content-list {
        .accordion-content {
          --content-icon-color-here: var(--label-color);
          overflow: hidden;
          text-wrap: nowrap;
          text-overflow: ellipsis;
          .content-icon-wrapper svg {
            transform: scale(0.3);
          }
          &.active {
            position: relative;
            z-index: 1;
            overflow: visible;
            opacity: 0.8;
            &::before {
              content: "";
              width: 100%;
              height: 100%;
              position: absolute;
              border-top: 0.1rem solid var(--badge-color);
              border-bottom: 0.1rem solid var(--badge-color);
              background-color: transparent;
            }
          }

          &-text {
            color: var(--bg-color);
            width: 60% !important;
            display: inline-block;
            overflow: hidden;
            text-wrap: nowrap;
            text-overflow: ellipsis;
            max-height: 2.5rem !important;
            z-index: 2;
          }
          .accordion-content-badge {
            display: none;
          }
        }
      }
      ${noContentStyle};
    }
  }
`;

export const CourseAccesssmentAreaStyled = styled.div`
  width: 75vw;
  margin-left: auto;
  height: max-content;
  overflow: hidden;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 5rem;
  padding: var(--padding_L);
  padding-top: 0;

  .accessment-cta-area {
    height: 5rem;
    overflow: hidden;
    margin-top: 0;
    top: 0;
    display: flex;
    justify-content: flex-end;
    gap: 3rem;
    button {
      width: 15rem;
      border-radius: unset;
      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
      background-color: var(--primary-color);
      font-size: 1.2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: visible;
      &::before {
        content: "";
        position: absolute;
        display: block;
        height: 100%;
        width: 0.5rem;
        top: 0;
        right: 0;
        background-color: var(--badge-color);
        opacity: 0;
        transition: opacity 0.2s linear;
      }
      &:hover {
        border: unset;
        &::before {
          opacity: 1;
        }
      }
      span {
        margin-right: var(--margin_S);
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        svg {
        }
      }
      color: var(--label-color);
    }
  }

  .accessment-countdown-area {
    /* ${debug}; */
    width: 90%;
    margin-right: auto;
    display: flex;
    height: max-content;
    align-items: center;
    .countdown-area-left {
      height: max-content;
      flex: 1;
      & > p {
        font-size: 3rem;
        font-family: poppins;
        width: max-content;
        font-weight: 500;
        color: var(--text-color);
      }
    }
    .countdown-area-right {
      width: max-content;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      height: max-content;
      align-items: center;
      .countdown-elapsed-area {
        width: 40rem;

        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 5rem;
        list-style-type: none;
        gap: 2rem;
        li {
          font-size: 1.5rem;
          transition: width 0.2s linear;
          &:first-of-type {
            width: 20rem;
          }
          span {
            font-size: 1.8rem;
            font-family: poppins;
            color: var(--primary-color);
            margin-right: 1rem;
          }
        }
        /* align-self: flex-end; */
      }
    }
  }

  .accessment-description-area {
    height: max-content;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5rem;
    margin-top: var(--margin_L);
    p {
      font-size: 2rem;
      color: var(--text-color);
      font-weight: 500;
      text-align: start;
      text-wrap: balance;
    }
  }
  form {
    width: 100%;
    height: max-content;
    display: flex;
    flex-direction: column;
    gap: 5rem;
  }
  .accessment-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 3rem;
    margin-bottom: var(--padding_L);
    ${noContentStyle};
    .no-content {
      width: 100%;
      font-size: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: montserrat;
    }
    & > span {
      width: 100%;
      text-align: start;
      font-weight: 600;
      color: var(--primary-color);
      font-size: 2.2rem;
    }
    .options-area {
      margin-bottom: var(--margin_L);
      width: 100%;
      display: flex;
      flex-direction: column;
      height: max-content;
      padding: 3rem 2rem;
      border-top-left-radius: 2rem;
      border-top-right-radius: 2rem;
      border: 1px solid var(--label-color);
      overflow: hidden;
      .option {
        height: 5rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 2rem;
        position: relative;
        overflow: visible;
        &::before {
          position: absolute;
          content: "";
          display: block;
          width: 100%;
          height: 100%;
          bottom: 0;
          left: 0;
          transform: scaleX(2);
          transform-origin: center;
          border-bottom: 0.1rem solid var(--label-color);
          z-index: 0;
        }
        input {
          position: relative;
          background-color: var(--label-color);
          accent-color: var(--primary-color);
        }
        label {
          font-size: 1.8rem;
          color: var(--text-color);
          z-index: 1;
          width: 100%;
        }
      }
    }
  }
`;

export const LessonContentBodyStyled = styled.div`
  width: 100%;
  display: flex;
  height: max-content;
  min-height: 120vh;
  flex-direction: column;
  align-items: center;
  gap: 5rem;
  font-family: poppins;
  h1 {
    font-size: 4rem;
    font-weight: 500;
    width: 100%;
    text-align: start;
    margin: 3rem 0;
  }
  h2 {
    width: 100%;
    height: max-content;
    font-size: 2.5rem;
    font-weight: 500;
    margin-top: var(--margin_L);
  }
  .resource-header-div {
    width: 100%;
    display: flex;
    gap: 2rem;
    align-items: center;
    position: relative;
    &::after {
      width: 100%;
      height: 0.3rem;
      content: "";
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: var(--primary-color);
      border-radius: 2rem;
    }
    span {
      font-size: 3rem;
      text-transform: capitalize;
      font-weight: 600;
    }
    p {
      font-size: 2rem;
    }
  }
  iframe {
    width: 100%;
    flex: 1;
  }
`;
