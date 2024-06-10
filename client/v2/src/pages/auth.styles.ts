import styled from "styled-components";

export const AuthStyled = styled.div`
  width: 100%;
  height: max-content;
  min-height: 100vh;
  @media screen and (max-height: 500px) {
    min-height: 180vh;
  }
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  font-family: poppins;
  --faded-color-here: #8a8a8a;
  padding: 2rem;
  .auth-content-wrapper {
    width: 90%;
    @media screen and (max-width: 800px) {
      width: 100%;
    }
    height: max-content;
    min-height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    flex-basis: 50%;
    padding-top: var(--padding_XL);
    margin: 0 5vw var(--margin_XL) 5vw;
    gap: 10%;
    & > div {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: column;
    }
    .auth-left {
      min-width: 70rem;
      @media screen and (max-width: 1000px) {
        min-width: 100vw;
      }
      flex: 1;
      gap: 3rem;
      height: 80rem;
      .auth-logo-area {
        width: 100%;
        --logo-dimension-val: 10rem;
        height: var(--logo-dimension-val);
        display: flex;
        align-items: center;
        justify-content: center;
        .logo-container {
          margin: 0 auto;
          width: var(--logo-dimension-val);
          height: var(--logo-dimension-val);
          display: flex;
          align-items: center;
          justify-content: center;
          svg {
            transform: scale(1.5);
          }
        }
      }
      .auth-form {
        width: 100%;
        height: max-content;
        min-height: 80rem;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        flex-basis: 20rem;
        .input-wrapper {
          width: 50%;
          @media screen and (max-width: 800px) {
            width: 100%;
          }
          height: max-content;
          display: flex;
          flex-direction: column;
          align-items: start;
          gap: 2rem;
          padding-left: 3rem;
          @media screen and (max-width: 800px) {
            padding-left: 0;
          }
          label {
            font-size: 2rem;
            font-family: montserrat;
            font-weight: 500;
            color: var(--faded-color-here);
          }
          input {
            width: 100%;
            height: 4rem;
            border-radius: 0.5rem;
            border: 0.1rem solid var(--active-text-bg);
            background-color: var(--bright-color);
            padding-left: 2rem;
            color: var(--text-color);
            &:focus {
              outline: none;
              border-color: var(--badge-color);
            }
          }
        }
        .input-wrapper:has(> input[type="password"]),
        .input-wrapper:has(> input[type="email"]) {
          width: 100%;
        }

        button[type="submit"] {
          width: 100%;
          height: 8rem;
          background-color: var(--primary-color);
          margin-top: var(--margin_XL);
          border-radius: 0.5rem;
          color: var(--bg-color);
          font-size: 2rem;
          text-transform: uppercase;
        }
      }
    }
    .auth-right {
      flex: 1;
      overflow: hidden;
      height: max-content;
      margin-top: 0;
      padding-bottom: 1rem;
      &-header {
        width: 100%;
        height: 5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 3rem;
        font-size: 2rem;
        color: var(--faded-color-here);
        span {
          flex: 1;
          height: 0.5rem;
          border-radius: 1rem;
          background-color: var(--label-color);
          transform: scaleX(0.8);
          transform-origin: right;
          &:nth-of-type(2) {
            transform-origin: left;
          }
        }
      }
      ul {
        list-style-type: none;
        width: max-content;
        height: max-content;
        display: flex;
        gap: 2rem;
        margin: 0 auto;
        li {
          position: relative;
          height: 5rem;
          width: 5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          a {
            position: absolute;
            content: "";
            width: 100%;
            height: 100%;
            display: block;
          }
        }
      }
      .auth-optional-redirect-area {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        margin-top: 12rem;
        span {
          font-size: 2rem;
          color: var(--faded-color-here);
        }
        a {
          position: relative;
          text-transform: lowercase;
          font-size: 2rem;
          color: var(--primary-color);
          width: max-content;
          overflow: visible;
          &:hover::after {
            width: 0;
          }
          &::after {
            position: absolute;
            content: "";
            display: block;
            width: 100%;
            height: 0.5rem;
            background-color: var(--primary-color);
            bottom: -0.5rem;
            transition: width 0.2s linear;
          }
        }
      }
    }
  }
  svg {
    width: 3rem;
    height: 3rem;
  }
`;
