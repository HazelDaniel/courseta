import styled from "styled-components";
import { debug, noContentStyle } from "../styles/globals";

export const UserCoursesStyled = styled.section`
  width: 100%;
  height: max-content;
  /* ${debug}; */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: var(--padding_S) var(--padding_XL);
  font-family: poppins;
  .courses-top {
    width: 100%;
    height: max-content;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    overflow: hidden;
    gap: 5rem;
    & > h2 {
      font-size: 2.2rem;
      text-transform: capitalize;
      font-weight: 500;
    }
  }
  .courses-bottom {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: max-content;
    gap: 20rem;
    .courses-list-container {
      width: 100%;
      height: max-content;
      list-style-type: none;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(35rem, 1fr));
      ${noContentStyle};
      .no-content {
        color: var(--text-color);
        font-size: 5rem;
        margin: auto;
        span {
          height: 100%;
          margin-right: 2rem;
          svg {
            transform: unset;
            fill: var(--text-color);
          }
        }
      }
      @media screen and (max-width: 800px) {
        grid-template-columns: repeat(1, minmax(35rem, 0.8fr));
      }
      grid-auto-flow: row;
      grid-auto-rows: 40rem;
      justify-content: center;
      margin-right: auto;
    }
  }
`;
