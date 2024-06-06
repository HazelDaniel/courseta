import styled from "styled-components";

export const LogoStyled = styled.div`
  height: 5rem;
  width: 100%;
  margin: var(--margin_M) 0;
  span {
    height: 5rem;
    width: 5rem;
    margin-right: auto;
    margin-left: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    svg {
      width: 100%;
      height: 100%;
    }
  }
  a {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    display: block;
    top: 0;
    left: 0;
  }
`;
