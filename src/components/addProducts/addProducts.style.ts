import styled, { css } from "styled-components";
import { CartFadeUp } from "../theme/ThemeProviderWrapper";

interface AddProductsContainerProps {
  flex_direction?: string;
  height?: number;
  weight?: string;
  textsize?: number;
}

interface TextAddProductsQuantityProps {
  disabled?: boolean;
}

export const AddProductsContainer = styled.div<AddProductsContainerProps>`
  ${({ theme, height, flex_direction }) => css`
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 50 !important;
    background-color: #FFF;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-direction: ${flex_direction ? flex_direction : ""};
    height: ${height ? height : 65}px;
    min-height: 65px;
    border-top: 1px solid ${theme.colors.neutral.lighter};
    box-shadow: 5px 5px 10px 2px ${theme.colors.neutral.lighter};

    animation: ${CartFadeUp} ease-in-out .35s;
  `}
`;

export const AddProductsPriceItem = styled.div<AddProductsContainerProps>`
  ${({ }) => css`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
    animation: ${CartFadeUp} ease-in-out .35s;
  `}
`;

export const AddProductsPriceInfoItem = styled.div<AddProductsContainerProps>`
  ${({ theme, weight, textsize }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    color: ${theme.colors.neutral.dark};
    font-weight: ${weight ? weight : 400};
    font-size: ${textsize ? textsize : 18}px;
  `}
`;

export const ProductsDiscount = styled.div`
  ${({ }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  `}
`;

export const ButtonProductsDiscount = styled.button`
  ${({ theme }) => css`
    border: 1px solid ${theme.colors.neutral.light};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0 12px;
    width: 100%;
    height: 48px;
    border-radius: 8px;
  `}
`;

export const ProductsDiscountContainer = styled.div`
  ${({ }) => css`
    display: flex;
    align-items: center;
    gap: 2px;
  `}
`;

export const ProductsDiscountText = styled.span`
  ${({ theme }) => css`
    color: ${theme.colors.neutral.dark};
    font-weight: 600;
  `}
`;

export const ActionProducts = styled.div`
  ${({ }) => css`
    height: 100%;
    width: 100%;
    display: flex;
    gap: 12px;
  `}
`;

export const CleanAddProducts = styled.div`
  ${({ theme }) => css`
    color: ${theme.colors.primary.default};
    font-weight: 600;
  `}
`;

export const AddProductsQuantity = styled.div<TextAddProductsQuantityProps>`
  ${({ theme, disabled }) => css`
    border: solid 1px ${disabled ? `${theme.colors.neutral.lighter}` : `${theme.colors.primary.default}`};
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: ${disabled ? `${theme.colors.neutral.lighter}` : `${theme.colors.primary.default}`};
    color: ${disabled ? `${theme.colors.neutral.light}` : `${theme.colors.neutral.white}`};
  `}
`;

export const TextAddProductsQuantity = styled.button<{ disabled: boolean }>`
  ${({ }) => css`
    font-weight: 600;
    width: 100%;
    height: 100%;
    transition: all ease-in-out .4s;
  `}
`;

export const SelectAddProducts = styled.div`
  ${({ theme }) => css`
    border: solid 1px ${theme.colors.primary.default};
    border-radius: 12px;
    display: flex;
    height: 100%;
    /* width: 130px; */
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
  `}
`;

export const ButtonAddProducts = styled.button`
  ${({ theme }) => css`
    padding: 0 15px;
    border-radius: 12px;
    width: 100%;
    font-size: 28px;
    color: ${theme.colors.primary.default};
    font-weight: 500;
    
    &:disabled {
      color: ${theme.colors.neutral.light};
    }
  `}
`;

export const QuantityAddProducts = styled.div`
  ${({ }) => css`
    position: relative;
    width: 40px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 0 8px;
  `}
`;