import styled, { css } from "styled-components";
import { IconClipboardCheckFilled, IconDiscountFilled, IconHomeFilled, IconTakeatCart, IconTicketFilled } from "takeat-design-system-ui-kit";
import { bounceDrop, CartFadeUp, cartUpdate } from "../theme/ThemeProviderWrapper";

export const CartUpdate = styled.div`
  ${({ }) => css`
    position: relative;
    /* animation: ${bounceDrop} .5s ease-in-out; */
  `}
`;

export const MenuContainer = styled.div`
  ${({ }) => css`
    position: fixed;
    width: 100%;
    height: 7rem;
    /* z-index: 40 !important; */
    /* animation: ${CartFadeUp} ease-in-out .35s; */
    `}
    `;

export const MenuTags = styled.div`
  ${({ theme }) => css`
  position: fixed;
  /* z-index: 20;  */
  bottom: 0;
  width: 100%;
  height: 64px;
  color: ${theme.colors.neutral.darker} !important;
  background-color: ${theme.colors.neutral.white};
  font-weight: 600;
  `}
`;

export const CircleNotificationMenu = styled.div`
  ${({ theme }) => css`
    position: absolute;
    bottom: -4px;
    right: -8px;
    width: 20px;
    height: 20px;
    background-color: ${theme.colors.yellow.light};
    border-radius: 50%;
    display: flex;
    font-size: 12px;
    align-items: center;
    justify-content: center;
    /* animation: ${cartUpdate} .8s ease-in-out; */
  `}
`;

export const AnimationMenu = styled.div`
  ${({ theme }) => css`
    animation: ${bounceDrop} .8s ease-in-out;
    height: 50px;
    width: 100%;
    /* z-index: 4; */
    position: fixed;
    bottom: 64px;
    color: #FFF;
    font-weight: 600;
    font-size: 18px;
    background-color: ${theme.colors.primary.default};
  `}
`;

export const NotificationMenuContainer = styled.div`
  ${({ }) => css`
    /* animation: ${bounceDrop} .5s ease-in-out; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 1rem;
    padding-right: 1rem;
    height: 100%;
    font-size: 0.875rem; 
    cursor: pointer;
  `}
`;

export const NotificationMenuInfo = styled.div`
  ${({ }) => css`
    /* animation: ${bounceDrop} .5s ease-in-out; */
    display: flex;
    gap: 1rem;
    align-items: center;
  `}
`;

export const NotificationIconMenu = styled(IconTakeatCart)`
  ${({ theme }) => css`
    /* animation: ${bounceDrop} .5s ease-in-out; */
    font-size: 1.875rem;
    fill: ${theme.colors.neutral.white};
  `}
`;


///////   ICONS  ////// 
export const IconTHome = styled(IconHomeFilled) <{ $active: boolean }>`
  ${({ theme, $active }) => css`
    fill: ${$active ? theme.colors.primary.default : theme.colors.neutral.dark};
    font-size: 24px;
    `}
    `;

export const IconTDiscount = styled(IconDiscountFilled) <{ $active: boolean }>`
  ${({ theme, $active }) => css`
  fill: ${$active ? theme.colors.primary.default : theme.colors.neutral.dark};
  font-size: 24px;
  `}
  `;

export const IconTFilled = styled(IconTicketFilled) <{ $active: boolean }>`
  ${({ theme, $active }) => css`
  fill: ${$active ? theme.colors.primary.default : theme.colors.neutral.dark};
  font-size: 24px;
  `}
  `;

export const IconTClipboard = styled(IconClipboardCheckFilled) <{ $active: boolean }>`
  ${({ theme, $active }) => css`
  fill: ${$active ? theme.colors.primary.default : theme.colors.neutral.dark};
  font-size: 24px;
  `}
`;

export const StyledLink = styled.div<{ $active: boolean }>`
  ${({ theme, $active }) => css`
    color: ${$active ? theme.colors.primary.default : theme.colors.neutral.dark};
    font-weight: 500;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `}
`;