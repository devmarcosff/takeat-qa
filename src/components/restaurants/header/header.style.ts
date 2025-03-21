import styled, { css } from "styled-components";
import { IconSearch } from "takeat-design-system-ui-kit";

const MORE_SPACING = 10

interface HeaderStickyProps {
  scrollPercentage?: number;
  top?: number
  scrolling?: number
}

interface HeaderWrapperProps {
  scrolling: number
}

interface RestaurantDetailsProps {
  scrolling: number,
  height: number
}

interface IconSearchCustomProps {
  scrolling: number
}

export const LogoContainer = styled.div`
  display: flex;
`;

export const RestaurantInfo = styled.div`
  font-weight: 600 !important;

  h2 {
    font-size: 1.125rem;
    width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const IconSearchCustom = styled(IconSearch) <IconSearchCustomProps>`
  ${({ scrolling }) => css`
  transform: translateX(${scrolling ? '60px' : '20px'});
  opacity: ${scrolling ? '0' : '1'};
  font-size: 24px;
  position: absolute;
  transition: all ease-in-out .2s;
  right: 0;
  `}
`

export const RestaurantDetails = styled.div<RestaurantDetailsProps>`
${({ scrolling, height }) => css`  
  transition: opacity 0.3s ease-in-out, transform .2s ease-in-out, height .3s ease-in-out;
  overflow: hidden;
  opacity: ${scrolling};
  height: ${scrolling === 1 ? height : 0}px;
`}
`;

export const HeaderContainer = styled.header<HeaderStickyProps>`  
  ${({ theme, scrolling }) => css`
    color: ${theme};
    position: relative;
    width: 100%;
    background: ${scrolling ? theme.colors.neutral.lighter : 'white'};
    transition: all 0.3s ease-in-out;
    transform: translateY(0);
    overflow: hidden;
    position: sticky;
    top: 0;
    z-index: 999;
    box-shadow: ${scrolling ? 'none' : '0 2px 8px #00000050'};
    padding-bottom: ${scrolling ? '0' : '15px'};
  `
  };
`;

export const HeaderWrapper = styled.header<HeaderWrapperProps>`
  ${({ scrolling }) => css`
    padding: 20px 20px ${scrolling ? scrolling * MORE_SPACING : MORE_SPACING}px 20px;
  `};
`;

export const HeaderRow = styled.header`  
  padding-bottom: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.light};
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const InfoText = styled.span`
  font-weight: 500;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.neutral.default};
`;

export const LocationText = styled.span`
  font-weight: 500;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.neutral.dark};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const StatusBadge = styled.span<{ color: "green" | "orange" | "primary" }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: ${({ theme, color }) =>
    color === "green"
      ? theme.colors.green.default
      : color === "orange"
        ? theme.colors.orange.default
        : theme.colors.primary.default};
`;

export const PulseIndicator = styled.span<{ color: "green" | "orange" | "primary" }>`
  display: flex;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
  background-color: ${({ theme, color }) =>
    color === "green"
      ? theme.colors.green.default
      : color === "orange"
        ? theme.colors.orange.default
        : theme.colors.primary.default};

  @keyframes pulse {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.2);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
