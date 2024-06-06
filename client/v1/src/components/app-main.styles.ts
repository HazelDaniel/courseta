import styled from "styled-components";

export const AppMainStyled = styled.main`
  flex: 1;
  height: max-content;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: var(--padding_M) 0 0 var(--padding_M);
  --section-width-here: 95%;
  /* background-color: green; */

  .home-section-title {
    font-size: 1.8rem;
    font-family: poppins;
    font-weight: 500;
    color: var(--text-color);

    /* font-family: poppins; */
    /* font-weight: 500; */

    text-transform: capitalize;
  }
  .app-main-content {
    flex: 1;
    max-width: 54vw;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 4rem;
    margin-bottom: var(--margin_XL);
    margin-right: -2rem;
  }
`;

export const WelcomeBoardStyled = styled.div`
  width: var(--section-width-here);
  height: 15rem;
  padding: var(--padding_M) var(--padding_L);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #586764 0%, #b1a899 100%);
  border-radius: 1rem;

  .wp-left {
    width: 40%;
    height: max-content;
    min-height: 100%;
    span {
      font-size: 2rem;
      color: var(--bg-color);
    }
    h2 {
      font-size: 3.5rem;
      color: var(--bright-color);
      margin-top: 1.5rem;
    }
  }
  .wp-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    position: relative;
    overflow: visible;
    img {
      position: absolute;
      width: 20rem;
      right: 0;
      top: -10rem;
      content: "";
      display: block;
      transform: scale(0.8);
      transform-origin: top;
    }
  }
`;

export const CurrentCourseSectionStyled = styled.section`
  width: var(--section-width-here);
  height: 30rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  margin-bottom: var(--margin_L);
  .ccs-top {
    width: 100%;
    height: max-content;
    display: flex;
    justify-content: space-between;
    p {
      margin: auto 0;
    }
    button {
      width: 20rem;
      height: 4.5rem;
      background-color: var(--badge-bg-color);
      color: var(--badge-color);
      font-size: 1.5rem;
      &:hover,
      &:active {
        border: 0.05px solid var(--badge-color);
      }
      &:focus {
        outline: unset;
        border: 0.05px dashed var(--badge-color);
      }
    }
  }
  .ccs-bottom {
    height: max-content;
    min-height: 15rem;
  }
`;

export const RecommendedCourseSectionStyled = styled.section`
  width: var(--section-width-here);
  max-width: 55vw;
  height: 42rem;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  overflow-x: auto;
  margin-bottom: var(--margin_M);
  .rcs-top {
    margin-bottom: var(--margin_XL);
    height: 3rem;
  }
  .rcs-bottom {
    flex: 1;
    .list-course-cards {
      width: 100%;
      height: 100%;
      display: flex;
      gap: 5rem;
      overflow-x: auto;
      overflow-y: hidden;
    }
  }
`;
