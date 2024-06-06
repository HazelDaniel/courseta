import styled from "styled-components";

export const RootWrapperStyled = styled.div`
  flex: 1 !important;
  display: flex;
  flex-direction: column;
  gap: var(--margin_M);
  &.compact {
    gap: unset;
  }
  background-color: var(--bright-color);
  border: 1px solid var(--label-color);
  border-top-left-radius: 2rem;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;
