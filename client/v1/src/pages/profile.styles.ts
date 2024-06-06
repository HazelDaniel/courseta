import styled from "styled-components";

export const RankListStyled = styled.div`
  width: 100%;
  height: max-content;
  display: flex;
  flex-direction: column;
  gap: 10rem;
  position: relative;
  &::before {
    position: absolute;
    display: block;
    height: 95%;
    width: 0.3rem;
    background-color: var(--active-text-color);
    top: 0;
    left: 20%;
    z-index: 0;
    content: "";
  }
  & > li {
    height: 8rem;
    border-radius: 0.8rem;
    align-items: center;
    display: flex;
    gap: 3rem;
    box-shadow: 0rem 0.3rem 1rem #3e3e3e;
    background-color: var(--primary-color);
    border: 1px solid var(--label-color);
    width: 90%;
    margin-left: auto;
    overflow: visible;
    position: relative;
    z-index: 2;

    & > span {
      width: 3rem;
      height: 3rem;
      margin-left: -5rem;
      svg {
        height: 100%;
        width: 100%;
        transform: scale(0.8);
      }
    }
    .rank-details {
      width: 100%;
      display: flex;
      height: 100%;
      padding: 1rem;
      align-items: center;
      img {
        height: 80%;
        margin: auto 0;
      }
      .rank-title {
        font-size: 2rem;
        color: var(--bg-color);
        text-align: start;
        width: 10rem;
        margin-left: 2.2rem;
      }
      .rank-date {
        color: var(--bg-color);
        margin-left: auto;
        margin-right: 1rem;
        font-size: 1.3rem;
        text-transform: capitalize;
        font-weight: 400;
        font-family: montserrat;
      }
    }

    .rank-badge {
      position: absolute;
      content: "";
      display: block;
      bottom: 0;
      bottom: -5rem;
      height: 3.5rem;
      width: 12rem;
      border-radius: 4rem;
      right: 1rem;
      background-color: var(--aside-tab-bg);
      color: #2d6b10;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

export const GenericProfileStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: var(--padding_L);
  .profile-top {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: 5rem;
    @media screen and (max-width: 800px) {
      flex-direction: column;
    }
    .profile-info-area {
      flex: 1;
      max-width: 50vw;
      display: flex;
      flex-direction: column;
      gap: 8rem;
      align-items: flex-start;
      .profile-info-image-wrapper {
        width: max-content;
        position: relative;
        height: max-content;
        min-height: 15rem;
        padding-bottom: var(--padding_M);
        img {
          width: 15rem;
          height: 15rem;
          border-radius: 1rem;
        }
        span.profile-role-badge {
          position: relative;
          display: block;
          content: "";
          bottom: -1.5rem;
          left: 0;
          height: 3rem;
          width: max-content;
          padding: 1rem;
          border-radius: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--progress-color);
          border: 0.1rem solid var(--progress-color);
          background-color: var(--aside-tab-bg);
        }
      }
    }
    .profile-credentials-editable {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 3.5rem;
      .input-wrapper {
        width: 35rem;
        height: 7rem;
        display: flex;
        gap: 1rem;
        align-items: center;
        font-family: poppins;
        padding-left: 1rem;
        background-color: var(--aside-tab-bg);

        background-color: var(--text-color);
        border-top-right-radius: 1rem;
        border-bottom-right-radius: 1rem;
        label {
          font-size: 2rem;
          text-transform: capitalize;
          font-weight: 500;
          color: var(--bright-color);
        }

        input {
          height: 100%;
          width: 30rem;
          border-radius: 1rem;
          font-weight: 500;
          font-size: 1.8rem;
          background-color: var(--label-color);
          border: unset;
          outline: unset;
          padding-left: 2rem;
          &:focus {
            box-shadow: 0.3rem 0.3rem 0.5rem var(--text-color);
          }
        }
      }
      .profile-rank-display-area {
        width: 100%;
        height: 5rem;
        display: flex;
        gap: 2rem;
        align-items: center;
        & > span {
          width: max-content;
          font-family: poppins;
          font-size: 2rem;
          font-weight: 500;
          text-align: center;
          min-width: 8rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .profile-rank-display {
          display: flex;
          /* gap: 1rem; */
          height: 3rem;
          align-items: center;
          span {
            height: 3rem;
            width: 3rem;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              aspect-ratio: 1 / 1;
            }
          }
          & > p {
            font-size: 2rem;
          }
        }
      }
      button {
        align-self: flex-end;
        height: 5rem;
        width: 20rem;
        font-size: 1.8rem;
        border-radius: 1rem;
        background-color: rgba(231, 233, 124, 0.42);
        color: var(--badge-color);
        &:focus {
          outline: unset;
          border: 0.1rem dashed var(--badge-color);
        }
        &:hover {
          border: 0.1rem solid var(--badge-color);
        }
      }
    }
    .profile-aside-details {
      width: 50rem;
      border-radius: 1rem;
      border: 1px solid var(--label-color);
      padding: var(--padding_M);
      padding-bottom: 10rem;
      /* background-color: red; */
      h2 {
        font-size: 3rem;
        font-weight: 500;
        text-align: center;
        margin-bottom: var(--margin_XL);
      }
      .ranks-wrapper {
        display: flex;
        height: max-content;
        width: 100%;
        list-style-type: none;
      }
    }
  }
`;

export const StudentProfileBottomStyled = styled.section`
  width: 100%;
  margin-top: var(--margin_XL);
  height: max-content;
  width: 70rem;
  margin-right: auto;
  padding-bottom: var(--padding_XL);
  .profile-bottom-title-div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 8rem;
    font-family: poppins;
    margin-bottom: 8rem;
    p {
      font-size: 2.2rem;
    }
    button {
      min-width: 15rem;
      width: max-content;
      height: 4rem;
      color: var(--badge-color);
      background-color: rgba(231, 233, 124, 0.42);
      border-radius: 0.5rem;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      &:focus {
        border: 0.1rem dashed var(--badge-color);
        outline: unset;
      }
      &:hover {
        border: 0.1rem solid var(--badge-color);
      }
    }
  }
  .attempted-courses-area {
    width: 100%;
    height: max-content;
    ul {
      height: inherit;
      width: inherit;
      list-style-type: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5rem;
      li {
        width: 100%;
        .course-card {
          width: 100%;
          max-width: unset;
        }
      }
    }
  }
`;

export const CreatorProfileBottomStyled = styled.section``;
