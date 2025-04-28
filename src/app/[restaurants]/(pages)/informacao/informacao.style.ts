import styled, { css } from "styled-components";

export const InputTakeat = styled.div`
  ${({ theme }) => css`
    border-radius: 12px;
    border: solid 1px ${theme.colors.neutral.default};
    width: 100%;
    padding: 12px 16px;
    display: flex;
    gap: 12px;
    align-items: center;
    font-weight: 500;
    outline: none;
  `}
`;

export const Container = styled.div`
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 32px;
  text-align: center;
`

export const InputContainer = styled.div`
  /* padding-left: 24px; */
  /* padding-right: 24px; */
  padding-top: 16px;
`

//////  GLOBAL CSS  //////
export const TakeatContainer = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
  `;

export const ButtonTakeatContainer = styled.div`
 ${({ theme }) => css`
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-top: 1px solid ${theme.colors.neutral.light};
  background-color: #FFF;
  padding: 10px 0;
  `}
`;

export const ButtonTakeatBottom = styled.button`
  ${({ theme }) => css`
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 0 auto;
    width: 90%;
    border-radius: 12px;
    background-color: ${theme.colors.primary.default};
  `}
`;

export const TextButtonTakeat = styled.span`
  font-weight: 600;
  color: #FFF;
`;