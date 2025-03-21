import Image from "next/image";
import styled from "styled-components";

interface CategoryItemProps {
  border?: boolean;
  color?: string;
}

export const StickyContainer = styled.div`
  position: relative;
  width: 100%;
  
  &.fixed-header {
    height: 280px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 70px;
    left: 0;
    width: 100%;
    padding: 12px 0;
    background: white;
    z-index: 999;
  }
`;

export const CategoriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  transition: all 0.3s ease-in-out;
`;

export const SearchContainer = styled.div`
  gap: 10px;
  transition: height 0.4s ease-in-out;
  overflow: hidden;
  display: flex;
  align-items: center;
  width: calc(100% - 40px);
  padding: 12px 16px;
  margin: 0 auto 12px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.neutral.dark};
  background: transparent;
  color: ${({ theme }) => theme.colors.neutral.dark};
  font-weight: normal;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  
  height: 50px;
  `;
/* height: ${({ isSearchActive }) => (isSearchActive ? "50px" : "0")};
opacity: ${({ isSearchActive }) => (isSearchActive ? 1 : 0)}; */

// export const SearchContainer = styled.div`
//   display: flex;
//   align-items: center;
//   width: calc(100% - 40px);
//   height: 48px;
//   gap: 8px;
//   padding: 12px 16px;
//   margin: 0 auto 12px;
//   border-radius: 12px;
//   border: 1px solid ${({ theme }) => theme.colors.neutral.dark};
//   background: transparent;
//   color: ${({ theme }) => theme.colors.neutral.dark};
//   font-weight: normal;
//   box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
// `;


export const SearchInput = styled.input`
  width: 100%;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.neutral.default};
  font-size: 16px;
  padding-left: 8px;
  
  &::placeholder {
    font-size: 14px;
  }
`;

export const CategoriesTitle = styled.h2`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral.darker};
  margin-left: 20px;
  font-size: 18px;
`;

export const CarouselWrapper = styled.section`
  --slide-size: 85%;
`;

export const CarouselViewport = styled.div`
  overflow: hidden;
`;

export const CarouselContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 20px;
  touch-action: pan-y;
`;

export const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  width: 80px;
`;

export const CategoryImageContainer = styled.div
  .withConfig({ shouldForwardProp: (prop) => prop !== "border" }) <CategoryItemProps>`
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ease-in-out 0.3s;

  ${({ border, theme }) =>
    border ? `border: solid 3px ${theme.colors.primary.default};` : ``};
`;

export const CategoryImage = styled(Image)`
  object-fit: cover;
  width: 100%;
  height: 100%;
  transition: all ease-in-out .3s;
`;

export const CategoryName = styled.h2<CategoryItemProps>`
  font-weight: 500;
  font-size: 12px;
  max-width: 70px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  ${({ color, theme }) =>
    color ? `color: ${theme.colors.primary.default}; font-weight: 600;` : ``}
`;
