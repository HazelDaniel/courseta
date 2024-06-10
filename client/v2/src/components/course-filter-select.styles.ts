import styled from "styled-components";

export const CourseFilterSelectStyled = styled.li`
  height: max-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5rem;
  width: 35rem;
  font-family: poppins;
  color: var(--text-color);
  margin: auto;
  margin-bottom: var(--margin_XL);
  margin-top: 0;
  --box-shadow-here: 0.2rem 0.4rem 0.8rem var(--label-color);

  h2 {
    width: 100%;
    font-size: 2rem;
    font-weight: 500;
    height: 3rem;
  }
  .filter-select {
    width: 100%;
    /* overflow: hidden; */
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
    &-display {
      width: 100%;
      height: 5rem;
      box-shadow: var(--box-shadow-here);
      background-color: var(--bright-color);
      border-radius: 0.8rem;
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      & > p {
        width: 10rem;
        font-size: 1.5rem;
        color: var(--text-color);
      }
      span {
        width: 3rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s linear;
        &.flipped {
          transform: scaleY(-1);
        }
        svg {
          width: 100%;
          height: 100%;
          transform: scale(0.4);
          path {
            fill: var(--text-color);
          }
        }
      }
    }
    form {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: var(--box-shadow-here);
      transition: transform 0.1s linear;
      &.collapsed {
        transform: scaleY(0);
        transform-origin: top;
      }
      .courses-filter-input-wrapper {
        width: 100%;
        height: 5rem;
        position: relative;
        padding: 0 0.5rem;
        /* &:has(input:checked) {
          anchor-name: --a;
        } */
        /* &::before {
          position: absolute;
          content: "";
          width: 100%;
          height: anchor-size(--a height);
          display: block;
          top: 0;
          left: 0;
          z-index: 0;
          background-color: var(--label-color);
        } */
        input {
          all: unset;
          position: inherit;
          width: 100%;
          height: 100%;
          border-radius: 0.8rem;
          z-index: 1;
          &.active {
            background-color: var(--primary-color);
          }
          &::before {
            position: absolute;
            content: "";
            width: 100%;
            height: 100%;
            display: block;
            top: 0;
            left: 0;
            z-index: 0;
            background-color: var(--label-color);
            opacity: 0;
            transition: opacity 0.3s linear;
            border-radius: inherit;
          }
          &:checked::before {
            opacity: 1;
          }
        }
        label {
          position: absolute;
          width: 90%;
          height: 90%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          display: flex;
          align-items: center;
          font-size: 1.5rem;
          z-index: 2;
          cursor: pointer;
          &:has(+ input.active) {
            color: var(--bright-color);
          }
        }
      }
    }
  }
`;
