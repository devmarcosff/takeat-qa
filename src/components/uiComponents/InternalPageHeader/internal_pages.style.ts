import styled, { css } from "styled-components";

export const TakeatInternalContainer = styled.div`
  ${({ theme }) => css`
    position: relative;
    height: 100%;
    padding: 16px 20px;
    color: ${theme.colors.neutral.dark};
    /* overflow: hidden; */
  `}
`;

export const TakeatHeaderInternalPage = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
`;