import styled from "styled-components";
import { courseAccordionStyle, debug } from "../styles/globals";

export const CourseInfoStyled = styled.section`
  font-family: poppins;
  padding-left: var(--padding_L);
  margin-bottom: 15rem;
  height: max-content;
  .course-desc-title {
    font-size: 4rem;
    font-weight: 500;
    text-transform: capitalize;
    color: var(--primary-color);
    margin-bottom: 2.5rem;
  }
  .course-desc {
    font-size: 2rem;
    color: var(--primary-color);
    width: 80%;
    margin-bottom: var(--margin_L);
  }

  .course-info-area {
    width: 97%;
    height: max-content;
    min-height: 50rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: 4%;

    @media screen and (max-width: 800px) {
      flex-direction: column;
    }
    li {
      list-style-type: none;
    }
    .area-left {
      flex: 1;
      height: max-content;
      display: flex;
      flex-direction: column;
      gap: 3rem;
      .horizontal-file-tab {
        width: 100%;
        height: 5rem;
        display: flex;
        gap: 5rem;
        border-bottom: 0.2rem solid var(--label-color);
        li {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 15rem;
          a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            position: relative;
            font-size: 1.8rem;
            z-index: 2;
            span {
              color: var(--primary-color);
              position: relative;
            }
            &.active {
              span {
                color: var(--bright-color) !important;
              }
              &::before {
                background-color: var(--primary-color);
                z-index: 0;
                border-radius: 1rem;
                border-bottom-left-radius: unset;
                border-bottom-right-radius: unset;
              }
            }
            &::before {
              position: absolute;
              content: "";
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              z-index: 0;
            }
          }
        }
      }
      .course-outline-area {
        border-radius: 1rem;
        height: max-content;
        border: 1px solid var(--label-color);
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3rem;
        --inactive-text-color: #7d7d7d;
        .coa-top {
          width: 100%;
          height: 8rem;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          &-left {
            width: 8rem;
            height: 100%;
            div {
              width: 8rem;
              height: 100%;
              border-radius: 0.5rem;
              border: 1px solid var(--label-color);
              span {
                width: 2rem;
                height: 2rem;
                svg {
                  width: 100%;
                  height: 100%;
                  transform: scale(0.4);
                  path {
                    fill: white !important;
                  }
                }
              }
            }
          }
          &-right {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 1rem;
            h2 {
              font-size: 2.5rem;
              font-weight: 500;
            }
            .course-outline-stat-div {
              height: max-content;
              width: 100%;
              display: flex;
              gap: 1rem;
              align-items: center;
              p {
                font-size: 1.4rem;
                color: var(--inactive-text-color);
              }
              span {
                width: 0.5rem;
                height: 0.5rem;
                border-radius: 50%;
                background-color: var(--inactive-text-color);
              }
            }
          }
        }
        .coa-bottom {
          width: 100%;
          height: max-content;
          margin-bottom: 7rem;
          padding-bottom: var(--padding_M);
          border-radius: 1.5rem;
          border: 1px solid var(--label-color);

          .course-outline-accordion {
            ${courseAccordionStyle};
            .no-content {
              width: 100%;
              font-size: 4rem;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--label-color);
              height: 8rem;
              font-family: montserrat;
            }
          }
        }
      }
    }
  }
`;
