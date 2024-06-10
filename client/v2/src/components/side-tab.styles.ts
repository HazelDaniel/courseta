import styled from "styled-components";
import { debug } from "../styles/globals";

export const SideTabStyled = styled.nav`
  position: fixed;
  left: 0;
  top: 1.5vh;
  height: 97vh;
  border-radius: 1rem;
  border-top-left-radius: unset;
  border-bottom-left-radius: unset;
  width: inherit;
  border: 1px solid var(--label-color);
  @media screen and (max-width: 800px) {
    width: 100vw;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  gap: 1rem;
  background-color: var(--bright-color);



  .side-tab-body {
    width: 100%;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    .nav-list {
      /* ${debug}; */
      list-style-type: none;
      width: 100%;
      height: max-content;
      height: 35rem;
      .nav-item {
        width: 90%;
        height: max-content;
        margin: 1rem auto;
        /* ${debug}; */
        & > div:first-of-type {
          width: 100%;
          height: 5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-radius: 0.5rem;
          position: relative;
          span {
            height: 100%;
            width: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            svg {
              height: 80%;
              transform: scale(0.8);
            }
          }
          a {
            font-size: 1.8rem;
            color: black;
            &.active::before {
              position: absolute;
              content: "";
              top: 0;
              left: 0;
              display: block;
              width: 100%;
              height: 100%;
              border-radius: 0.5rem;
              transform: scaleX(1.05);
              background-color: var(--active-text-bg);
            }
          }
        }
        .sub-nav-list {
          min-height: 10rem;
          height: max-content;
          width: 80%;
          margin: 0 auto;
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-left: var(--margin_M);
          /* background-color: red; */
          .sub-nav-item {
            width: 100%;
            height: 3rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            /* padding-left: var(--padding_M); */
            span {
              width: 1rem;
              height: 1rem;
              border-radius: 50%;
              border: 0.3rem solid #c0c0c1;
              position: relative;
              overflow: visible;
              &::before,
              &::after {
                width: 0.3rem;
                height: 1.2rem;
                content: "";
                display: block;
                background-color: #c0c0c1;
                border-radius: 0.3rem;
                margin-left: 25%;
              }
              &::before {
                top: 0;
                transform: translateY(-1.2rem);
              }
              &::after {
                bottom: 0;
                transform: translateY(-0.4rem);
              }
            }
            a {
              font-size: 1.5rem;
              color: var(--inactive-text-color);
              &.active {
                color: var(--active-text-color);
              }
            }
          }
        }
      }
    }
    .side-tab-cta-div {
      width: 95%;
      height: 5rem;
      margin: 0 auto;
      overflow: hidden;
      border-radius: 0.5rem;
      background-color: var(--primary-color);
      margin-bottom: 50%;
      button {
        background-color: unset;
        width: 100%;
        height: 100%;
        outline: none;
        border: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        padding-right: 8rem;
        font-size: 1.5rem;
        text-transform: uppercase;
        color: var(--bg-color);

        span {
          position: absolute;
          width: 3rem;
          height: 3rem;
          content: "";
          display: block;
          top: 50%;
          left: 65%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .side-tab-notif-box {
      width: 95%;
      margin: 0 auto;
      height: 15rem;
      border-radius: 1rem;
      background-color: var(--primary-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20%;
      .notif-text {
        font-size: 1.6rem;
        color: var(--bright-color);
        text-align: center;
        width: 80%;
        margin: 0 auto;
      }
      .notif-box-cta {
        width: 60%;
        margin: 0 auto;
        border-radius: 0.5rem;
        height: 4rem;
        background-color: unset;
        border: 1px solid var(--label-color);
        font-size: 1.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--bg-color);
      }
    }
  }
`;
