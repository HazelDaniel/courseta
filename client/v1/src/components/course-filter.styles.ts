import styled from "styled-components";

export const CourseFilterStyled = styled.div`
  width: 100%;
  height: max-content;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: var(--text-color);
  font-family: poppins;
  margin-bottom: var(--margin_L);
  .filter-controller-area {
    width: max-content;
    min-width: 20rem;
    height: inherit;
    display: flex;
    justify-content: flex-end;
    gap: 2rem;
    height: 3rem;
    overflow: hidden;
    margin-bottom: 7rem;
    h2 {
      width: max-content;
      height: 3rem;
      font-size: 2rem;
      font-weight: 500;
    }
    .filter-controller-parent {
      height: 3rem;
      overflow: hidden;
      width: max-content;
      display: flex;
      gap: 1rem;
      align-items: center;
      span {
        width: 3rem;
        height: 100%;
        cursor: pointer;
        transform: scale(0.6);
        transform-origin: right;
        svg {
          width: 100%;
          height: 100%;
        }
        &.chevron-icon {
          transform: scale(0.4);
          transform-origin: left;
          cursor: default;
          &.flipped {
            transform: scale(0.4, -0.4);
          }
        }
      }
    }
  }
  .filter-select-area {
    align-self: center;
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5rem;
    .filter-select-parent {
      width: 100%;
      align-self: inherit;
      list-style-type: none;
      display: flex;
      gap: 0;
      overflow: hidden;
      flex-basis: 200%;
      flex-wrap: wrap;
      align-items: flex-start;
      height: max-content;
      @media screen and (max-width: 800px) {
        justify-content: center;
      }
    }
    .filter-select-cta {
      width: 18rem;
      height: 8rem;
      background-color: var(--primary-color);
      color: var(--bg-color);
      border-radius: 0.5rem;
      font-size: 1.3rem;
      transition: all 0.2s linear;
      &:hover {
        filter: invert(90%);
        outline: unset;
      }
    }
  }
`;
