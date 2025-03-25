import styled, { css } from "styled-components";

export const InfoButton = styled.button`
  ${({ theme }) => css`
  background-color: transparent;
  color: ${theme.colors.neutral.darker};
  border: solid 1px ${theme.colors.neutral.light};
  border-radius: 12px;
  overflow: hidden;
  padding: 0 16px;
  height: 60px;
  width: 100%;
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;

  &:hover {
    background-color: ${theme.colors.neutral.lightest};
  }
  `}
`;

export const InfoContainerButton = styled.div`
  ${({ theme }) => css`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${theme.colors.neutral.dark}
`}`;

export const Icon = styled.i`

`