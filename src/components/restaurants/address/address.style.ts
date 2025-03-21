import styled, { css } from "styled-components";

export const ButtonTakeatModal = styled.button<{ color?: string, textcolor?: string, width?: number }>`
  ${({ theme, color, textcolor, width }) => css`
    height: 48px;
    width: ${width ? width : 100}%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* margin: 0 auto; */
    border-radius: 12px;
    font-weight: 600;
    border: solid 1px ${theme.colors.primary.default};
    background-color: ${color ? color : theme.colors.primary.default};
    color: ${textcolor ? textcolor : theme.colors.neutral.white};
  `}
`;