import styled from "styled-components";
import { debug } from "../styles/globals";

export const CourseBannerStyled = styled.div`
  width: 97%;
  height: max-content;
  min-height: 23rem;
  border-radius: 1.5rem;
  margin: -1rem auto 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: var(--padding_M) var(--padding_L);
  overflow: hidden;
  gap: 1.5rem;
  font-family: poppins;
  margin-bottom: 8rem;
  & > * {
    z-index: 2;
    position: relative;
  }

  &::before,
  .banner-image {
    top: 0;
    left: 0;
    position: absolute;
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }
  .banner-image {
    z-index: 1;
    object-fit: cover;
  }

  &::before {
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.2) 100%
    );
    z-index: 2;
  }
  .course-creator-name-text {
    width: max-content;
    align-self: flex-start;
    font-size: 2rem;
    text-transform: capitalize;
    font-weight: 400;
    color: var(--bright-color);
  }
  .course-banner-title {
    font-size: 4rem;
    font-weight: 400;
    color: var(--bright-color);
  }
  .course-banner-stat-div {
    width: max-content;
    display: flex;
    align-items: center;
    gap: 2rem;
    height: 3rem;
    .stat-part {
      width: max-content;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      height: 3rem;
      position: relative;
      span {
        width: 3rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        svg {
          /* height: 100%; */
          width: 100%;
          transform: scale(0.6);
        }
      }
      p {
        font-size: 1.5rem;
        color: var(--bright-color);
      }
    }
  }
  .course-banner-cta {
    width: 15rem;
    height: 4rem;
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    border: 1px solid var(--label-color);
    background-color: var(--primary-color);
    color: var(--bg-color);
  }
`;
