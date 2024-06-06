import styled from "styled-components";

export const HeaderSearchBoxStyled = styled.div`
  width: 30rem;
  height: 5rem;
  border-radius: 0.5rem;
  display: flex;
  border: 1px solid var(--label-color);
  & > input {
    height: 100%;
    width: 80%;
    background-color: unset;
    outline: unset;
    border: unset;
    color: var(--bg-color);
    padding: var(--padding_S);
    padding: 1rem;
  }
  .search-icon {
    width: 20%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    input {
      position: absolute;
      content: "";
      display: block;
      z-index: 2;
      width: 100%;
      height: 100%;
      background-color: transparent;
      cursor: pointer;
      outline: unset;
      border: unset;
      &:focus-visible,
      &:focus {
        & + svg {
          transform: scale(0.4);
        }
      }
    }

    svg {
      cursor: pointer;
      width: 100%;
      height: 100%;
      transform: scale(0.6);
    }
  }
`;

export const HeaderStyled = styled.header`
  height: 12rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  &.shrink {
    width: 75%;
    margin-left: auto;
  }
  overflow: hidden;
  padding: var(--padding_M);
  background-color: var(--primary-color);
  border-top-right-radius: 1.5rem;
  border-top-left-radius: 1.5rem;
  @media screen and (max-width: 800px) {
    margin-left: 0;
  }

  .header-left {
    height: 5rem;
    flex: 1;
    &.hidden {
      visibility: hidden;
    }
  }
  .header-right {
    width: 30rem;
    margin-right: var(--margin_XL);
    height: 5rem;
    display: flex;
    justify-content: flex-end;
    .notif-icon-area {
      width: 5rem;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: visible;
      .notif-icon-shadow {
        width: 100%;
        height: 100%;
        content: "";
        display: block;
        position: absolute;
        background-color: var(--label-color);
        opacity: 0;
        top: 0;
        left: 0;
        -webkit-mask: url("/public/icons/notification-bell.svg") center/contain
          no-repeat;
        mask: url("/public/icons/notification-bell.svg") center/contain
          no-repeat;
        mask-size: cover;
        transform-origin: top;
        transition: transform 0.3s ease-out;
        z-index: 0;
      }
      svg {
        width: 100%;
        height: 100%;
        transform: scale(0.8);
        cursor: pointer;
        z-index: 1;
        &:hover {
          & + .notif-icon-shadow {
            transform: rotateZ(-15deg);
            opacity: 0.4;
          }
        }
      }
    }
    .profile-summary-area {
      flex: 1;
      overflow: hidden;
      display: flex;
      max-width: max-content;
      span {
        font-size: 2rem;
        color: var(--label-color);
        width: max-content;
        margin-left: 5rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-right: var(--margin_S);
      }
      .profile-image-div {
        width: 5rem;
        height: 100%;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0.5rem;
        }
        a {
          position: absolute;
          content: "";
          display: block;
          width: 100%;
          height: 100%;
          top: 0;
          z-index: 2;
        }
      }
    }
  }
`;
