import styled from "styled-components";

export const NotFoundStyled = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  ._404-content-area {
    width: max-content;
    display: flex;
    gap: 1rem;
    align-items: center;
    height: 10rem;
    overflow: hidden;
    & > span {
      height: 100%;
      min-height: 8rem;
      width: 0.5rem;
      margin: 0 1rem;
      background-color: var(--text-color);
    }
    ._404-logo-parent {
      width: 7rem;
      height: 7rem;
      /* padding: 1rem; */
      display: flex;
      align-items: center;
      justify-content: center;
      .logo-container {
        border: 0.2rem solid var(--label-color);
        border-radius: 0.5rem;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .logo-div {
          margin: auto 0;
        }
      }
    }
    ._404-icon-parent {
      height: 5rem;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        height: 100%;
      }
    }
    ._404-text-area {
      width: max-content;
      height: 5rem;
      display: flex;
      align-items: center;
      p {
        font-family: montserrat;
        font-size: 1.8rem;
        margin-right: 1rem;
        color: var(--inactive-text-color);
        color: #797777;
        font-weight: 500;
      }
      a {
        font-family: poppins;
        font-weight: 600;
        font-size: 1.8rem;
        color: var(--text-color);
        position: relative;
        overflow: visible;
        &:hover {
          &::after {
            width: 0;
          }
        }
        &::after {
          position: absolute;
          content: "";
          width: 100%;
          height: 0.5rem;
          border-radius: 1rem;
          background-color: var(--text-color);
          bottom: -5px;
          left: 0;
          transition: width 0.2s linear;
        }
      }
    }
  }
`;
