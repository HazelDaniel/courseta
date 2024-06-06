import styled from "styled-components";

export const AssessmentStyled = styled.div`
  width: 100%;
  height: max-content;
  min-height: 80vh;
  font-family: poppins;
  overflow: hidden;
  padding: 5rem;
  padding-right: 8%;
  .section-title {
    width: 100%;
    height: max-content;
    margin-bottom: 10rem;
    font-size: 2.2rem;
  }
  .assessments-container {
    width: auto;
    height: max-content;
    min-height: 100%;
    margin-left: 5%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 30rem;
    position: relative;
    &::before {
      width: 0.3rem;
      position: absolute;
      border-radius: 1rem;
      content: "";
      left: -1.5rem;
      top: 0;
      height: 90%;
      background-color: var(--label-color);
    }

    @media screen and (max-width: 800px) {
      gap: 15rem;
    }
  }
`;

export const AssessmentAreaStyled = styled.div`
  width: 100%;
  height: max-content;
  min-height: 50rem;
  display: flex;
  flex-direction: column;
  .assessment-type-title {
    width: 100%;
    height: max-content;
    margin-bottom: 5rem;
    font-size: 2rem;
    text-align: start;
    text-transform: capitalize;
    position: relative;
    overflow: visible;
    &::before {
      position: absolute;
      content: "";
      display: block;
      left: -2rem;
      top: 1rem;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background-color: var(--label-color);
    }
  }
  .average-score-area {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 2rem;
    align-items: center;
    margin-bottom: var(--margin_XL);
    & > h2 {
      font-size: 2.5rem;
      font-family: montserrat;
      text-transform: capitalize;
    }
    .average-score-progress-area {
      width: max-content;
      display: flex;
      gap: 1rem;
      align-items: center;
      & > div {
        width: 30rem;
        height: 4rem;
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 1rem;
        border: 0.1rem solid var(--label-color);
        .progress-parent {
          flex: 1;
          height: 1rem;
          border-radius: 2rem;
          background-color: var(--inactive-text-color);
          span.progress {
            height: 100%;
            border-radius: inherit;
            background-color: var(--progress-color);
            display: block;
          }
        }
      }
      & > p {
        font-size: 2.2rem;
        font-weight: 600;
      }
    }
  }
  .course-assessments-list {
    width: 100%;
    height: max-content;
    min-height: 100%;
    align-self: center;
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    /* flex-basis: 40rem; */
    padding-left: 10%;
    @media screen and (max-width: 800px) {
      padding-left: 0;
    }
    gap: 10%;
  }
`;

export const AssessmentItemStyled = styled.li`
  width: 33rem;
  height: max-content;
  min-height: 30rem;
  padding: var(--padding_M);
  margin-bottom: 5rem;
  border-radius: 1.5rem;
  border: 0.2rem solid var(--label-color);
  display: flex;
  flex-direction: column;
  gap: 4rem;
  .assessment-badge {
    width: max-content;
    height: max-content;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: 3rem;
    font-size: 1.5rem;
    cursor: pointer;
    &.passed {
      border: 0.1rem solid var(--progress-color);
      color: var(--progress-color);
      background-color: var(--aside-tab-bg);
    }
    &.failed {
      border: 0.1rem solid #fb442b;
      color: #fb442b;
      background-color: rgba(241, 67, 29, 0.06);
    }
    &.no-attempt {
      border: 0.1rem solid var(--label-color);
      color: var(--label-color);
      background-color: rgba(215, 215, 215, 0.13);
    }
  }
  .assessment-card-items {
    width: flex 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 1rem;
    .card-item {
      width: 100%;
      height: 3rem;
      display: flex;
      align-items: center;
      font-family: poppins;
      .bullet {
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        border: 0.2rem solid var(--text-color);
        margin-right: 1rem;
      }
      a,
      p {
        font-size: 1.5rem;
        margin-right: 2rem;
        color: var(--text-color);
        font-weight: 500;
      }
      a {
        position: relative;
        &:hover::before {
          transform: scaleX(0);
        }
        &::before {
          position: absolute;
          bottom: -0.5rem;
          content: "";
          height: 0.3rem;
          border-radius: 1rem;
          width: 100%;
          display: block;
          background-color: var(--text-color);
          transform-origin: left;
          transition: transform 0.2s linear;
        }
      }
      span:last-of-type:not(.bullet) {
        justify-self: flex-end;
        margin-left: auto;
        color: var(--inactive-text-color);
        font-size: 1.3rem;
        font-weight: 600;
      }
    }
  }
`;
