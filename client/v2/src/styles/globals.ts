import { createGlobalStyle, css } from "styled-components";

export const debug = css`
  border: 1px solid red;
  background-color: rgba(94, 95, 96, 0.17);
`;

export const courseAccordionStyle = css`
  height: max-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  --uniform-padding-here: 0 var(--padding_M);
  .accordion-head {
    height: 8rem;
    width: 100%;
    &.first {
      border-radius: inherit;
    }
    padding: var(--uniform-padding-here);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--active-text-bg);
    border-bottom: 1px solid var(--label-color);
    & > p {
      font-size: 2rem;
      color: var(--active-text-color);
      font-weight: 500;
    }
    .head-right {
      width: max-content;
      min-width: 20rem;
      display: flex;
      align-items: center;
      gap: 1rem;

      .duration-details {
        width: max-content;
        display: inherit;
        align-items: inherit;
        gap: 1rem;
        margin-right: 2rem;
        span {
          width: 0.5rem;
          height: 0.5rem;
          background-color: var(--text-color);
          border-radius: 50%;
          display: inline-flex;
        }
        p {
          display: inline-flex;
          font-size: 1.4rem;
          font-weight: 500;
          color: var(--text-color);
        }
      }
      .accordion-controller {
        width: max-content;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        display: none;
        svg {
          height: 80%;
          transform: scale(0.6);
        }
      }
    }
  }

  .accordion-content-list {
    padding: var(--uniform-padding-here);
    width: 100%;
    height: max-content;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .accordion-content {
      height: 8rem;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 1rem;
      --content-icon-color-here: var(--text-color);
      position: relative;
      overflow: visible;

      &::before {
        bottom: 0;
        height: 0.1rem;
        width: 100%;
        content: "";
        display: block;
        position: absolute;
        background-color: var(--label-color);
        transform: scaleX(2);
      }
      .content-icon-wrapper {
        height: 100%;
        width: 8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        svg {
          height: 100%;
          transform: scale(0.4);
        }
      }

      .accordion-content-text {
        font-size: 2rem;
        font-weight: 500;
        color: var(--content-icon-color-here);
      }
      .accordion-content-badge {
        width: max-content;
        padding: 0 2rem;
        height: 3.5rem;
        justify-self: flex-end;
        margin-left: auto;
        margin-right: var(--margin_S);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4rem;
        gap: 0.5rem;
        background-color: var(--aside-tab-bg);
        p {
          font-weight: 500;
          text-transform: uppercase;
        }
        svg {
          height: 1.5rem;
        }
      }
    }
  }
`;

export const noContentStyle = css`
.no-content {

  width: 100%;
  height: 8rem;
        font-size: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--bg-color);
        span {
          width: 3rem;
          height: 3rem;
          svg {
            width: 100%;
            height: 100%;
            fill: var(--label-color);
            transform: scale(0.6);
          }
        }
        
      }
`

export const GlobalStyle = createGlobalStyle`

html {
  font-size: 8px;
  scroll-behavior: smooth;
  font-family: poppins;
  @media screen and (min-width: 500px) {
    font-size: .5vw;
  }
  @media screen and (max-width: 800px) {
    font-size: 7px;
  }
  @media screen and (min-width: 1500px) {
    font-size: 10px;
  }
  @media screen and (min-width: 2500px) {
    font-size: .5vw;
  }
}
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}
body, #root {
  margin: 0; line-height: normal;
  width: 100vw;
  padding: 0;
  overflow: auto;
  overflow-x: hidden;
  height: max-content;
  min-height: 100vh;
}
#root {
  display: flex;
  align-items: center;
  justify-content: center;
  #app {
    width: 100%;
    height: max-content;
    min-height: 100vh;
    display: flex;
    gap: 2rem;
    background-color: var(--bg-color);
    @media screen and (max-width: 800px) {
      gap: unset;
    }
    
    .side-tab-wrapper {
      width: 30rem;
      height: max-content;
      min-height: 100vh;
      @media screen and (max-width: 800px) {
        width: max-content;
      }
    }

  }
}
body > script {
  width: 0 !important;
  height: 0 !important;
  background-color: var(--bg-color);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
}


:root {
  --primary-color: #272727;
  --faint-accent-color: rgba(228, 95, 20, 0.26);
  --text-color: #333333;
  --active-text-color: #272727;
  --badge-color: #FD7427;
  --label-color: #CAC8C8;
  --cta-bg: rgba(94, 95, 96, 0.27);
  --logo-color: #3C4442;
  --bg-color: #F3F3F3;
  --bright-color: #FFFFFF;
  --active-text-bg: rgba(94, 95, 96, 0.17);
  --tab-icon-color: rgba(98, 76, 64, 0.67);
  --inactive-text-color: #BABABA;
  --progress-color: #35AC65;
  --badge-bg-color: rgba(231, 233, 124, 0.42);
  --aside-tab-bg: rgba(159, 233, 124, 0.42);

  //box model
  --padding_S: 1rem;
  --padding_M: 3rem;
  --padding_L: 5rem;
  --padding_XL: 10rem;

  --margin_S: 1rem;
  --margin_M: 3rem;
  --margin_L: 5rem;
  --margin_XL: 10rem;
}
`;
