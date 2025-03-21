import { fadeZoomIn } from "@/components/theme/ThemeProviderWrapper";
import styled, { css } from "styled-components";
import { Image } from "takeat-design-system-ui-kit";

interface ImageInternalContainerProps {
  img: string;
}

export const ProductsContainer = styled.section`
  padding: 0 20px 40px 20px;
  padding-bottom: 64px;
  background-color: ${({ theme }) => theme.colors.neutral.lighter};
`;

export const CategoryContainer = styled.div`
  background: transparent;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 12px;
`;

export const CategoryHeader = styled.div`
  position: relative;
  height: 90px;
  cursor: pointer;
  border-radius: 20px;
  overflow: hidden;
`;

export const CategoryImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
`;

export const CategoryImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
`;

export const CategoryButton = styled.button`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const CategoryTitle = styled.div`
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  color: white;
  font-weight: 600;

  h2 {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

export const ProductList = styled.div`
  background: ${({ theme }) => theme.colors.neutral.white};
  border-radius: 20px;
  padding: 16px;
  margin-top: 10px;
`;

export const ProductItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.light};
  padding-bottom: 12px;
  margin-bottom: 12px;
  cursor: pointer;
`;

export const ProductDetails = styled.div`
  flex: 1;
  padding-right: 12px;

  h2 {
    font-weight: 600;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.neutral.dark};
  }

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.neutral.default};
  }
`;

export const ProductPrice = styled.p`
  font-size: 16px !important;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.green.lighter} !important;

  span {
    font-size: 0.875rem;
    text-decoration: line-through;
    color: ${({ theme }) => theme.colors.neutral.dark};
    margin-left: 6px;
  }
`;

export const ProductImage = styled(Image)`
  width: 75px;
  height: 75px;
  border-radius: 16px;
  object-fit: cover;
`;

// --------------------------- //
export const ProductInternalContainer = styled.div`
  ${({ }) => css`
    position: relative;
    height: 100%;
  `}
`
export const ImageInternalContainer = styled(Image) <ImageInternalContainerProps>`
  ${({ img }) => css`
    background-image: url(${img});
    height: 300px;
    width: 100%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    position: fixed;
    top: 0%;
    left: 0%;
    z-index: 1;
    
    &::after {
      content: '';
      z-index: 2;
      background-color: #000;
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: .4;
    }
    `}
    `
export const ProductInternalWrapper = styled.div`
  ${({ theme }) => css`
    position: relative;
    z-index: 10;
    background-color: ${theme.colors.neutral.white};
    width: 100%;
    padding: 20px;
    height: 100%;
    margin-top: 250px;
    margin-bottom: 75px;
    border-radius: 20px 20px 0 0;

    animation: ${fadeZoomIn} .3s ease-in-out;
  `}
`