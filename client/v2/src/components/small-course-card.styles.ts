import styled from "styled-components";

export const SmallCourseCardStyled = styled.li`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom-left-radius: 0.8rem;
  border-bottom-right-radius: 0.8rem;
  max-width: 45rem;
  .course-card-small {
    width: 80%;
    height: 80%;
    display: flex;
    flex-direction: column;
    border-radius: inherit;
    align-items: center;
    border: 1px solid var(--label-color);
    border-bottom-left-radius: 1rem;
    .top {
      width: 100%;
      height: 15rem;
      position: relative;
      a {
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        display: block;
        background-color: transparent;
      }
      img {
        width: 100%;
        height: 15rem;
        object-fit: cover;
        aspect-ratio: 3 / 2;
      }
    }
    .bottom {
      flex: 1;
      width: 100%;
      font-family: montserrat;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 2rem;
      .card-bottom-text {
        font-size: 1.8rem;
        height: 3rem;
        text-wrap: nowrap;
        text-align: center;
        font-family: poppins;
        width: 80%;
        margin: 2rem auto;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .course-circle-progress-wrapper {
        width: 100%;
        height: 5rem;
        display: flex;
        justify-content: flex-end;
      }
      .course-info-cta-area {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 3rem;
        font-weight: 600;
        text-transform: capitalize;
        padding: 0 2rem;
        p {
          font-size: 1.2rem;
        }
        button {
          width: max-content;
          height: 3rem;
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--primary-color);
          color: var(--bg-color);
          border-radius: 0.5rem;
          font-size: 1.5rem;
          text-transform: capitalize;
        }
      }
    }
  }

  &.home {
    min-width: 35rem;
    .course-card-small {
      width: 100%;
      height: 100%;
    }
  }
`;
