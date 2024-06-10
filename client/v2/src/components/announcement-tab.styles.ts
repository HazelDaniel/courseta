import styled from "styled-components";

export const AnnouncementTabStyled = styled.aside`
  width: 30%;
  height: max-content;
  min-height: 100vh;
  margin-right: auto;
  border: 1px solid var(--label-color);
  border-radius: 1rem;
  padding: var(--padding_M);
  margin-bottom: var(--margin_L);

  @media screen and (max-width: 999px) {
    display: none;
  }
  @media screen and (min-width: 1500px) {
    margin-right: var(--margin_M);
  }
  overflow-x: hidden;
  overflow-y: auto;

  .at-top {
    width: 100%;
    height: 5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: poppins;
    margin-bottom: var(--margin_L);
    h2 {
      flex: 1;
      font-size: 2rem;
      font-weight: 600;
      color: var(--text-color);
    }
    button {
      width: 8rem;
      height: 3rem;
      font-size: 1.3rem;
      border-radius: 1rem;
      background-color: var(--badge-bg-color);
      color: var(--badge-color);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
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
  .at-bottom {
    height: max-content;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    overflow: hidden;
    .announcement-tab-separator {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 1rem;
      h3 {
        width: max-content;
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--label-color);
      }
      span {
        flex: 1;
        display: block;
        height: 0.2rem;
        background-color: var(--label-color);
        border-radius: 0.25rem;
      }
    }
    .at-item-list {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      height: max-content;
      width: 100%;
      gap: 3rem;
      .announcement-tab-item {
        width: 100%;
        height: max-content;
        min-height: 12rem;
        border-radius: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 5%;
        gap: 2rem;
        background: var(--aside-tab-bg);
        .ati-badge {
          align-self: flex-start;
          font-size: 1.3rem;
          width: 8rem;
          height: max-content;
          padding: 0.25rem;
          font-weight: 700;
          background-color: var(--bright-color);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.8rem;
          &.creators {
            color: #ff2e2e;
          }
          &.students {
            color: #2eff5c;
          }
        }
        .ati-body {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          overflow: hidden;

          p {
            flex: 1;
            font-size: 1.3rem;
            font-weight: 700;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: var(--text-color);
          }
          .ati-expand-cta {
            width: 3rem;
            height: 3rem;
            span {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              background-color: var(--bright-color);
              cursor: pointer;
              transition: transform 0.2s linear;
              &:focus {
                outline: unset;
                border: 1px solid var(--text-color);
                border-radius: 50%;
              }
              &:hover {
                transform: scale(0.9);
              }
              svg {
                width: 100%;
                height: 100%;
                transform: scale(0.3);
              }
            }
          }
        }
        .ati-time-area {
          width: 100%;
          color: var(--inactive-text-color);
          font-size: 1.2rem;
        }
      }
    }
  }
`;
