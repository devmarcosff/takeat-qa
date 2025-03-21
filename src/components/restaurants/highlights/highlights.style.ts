import styled from "styled-components";
import { Image } from "takeat-design-system-ui-kit";

export const HighlightsContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 0;
  background-color: ${({ theme }) => theme.colors.neutral.lighter};
`;

export const HighlightsTitle = styled.h2`
  font-weight: 600; 
  color: ${({ theme }) => theme.colors.neutral.darker};
  margin-left: 20px;
  font-size: 18px;
`;

export const CarouselWrapper = styled.section`
  max-width: 100%;
`;

export const CarouselViewport = styled.div`
  overflow: hidden;
  padding: 10px 20px;
`;

export const CarouselContainer = styled.div`
  display: flex;
  gap: 12px;
  touch-action: pan-y;
`;

export const HighlightCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 340px;
  position: relative;
  background: ${({ theme }) => theme.colors.neutral.white};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  justify-content: space-between;
`;

export const HighlightImageContainer = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  padding: 8px;
  `;

export const HighlightImage = styled(Image)`
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  `;

export const HighlightContent = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-grow: 1; /* Mantém o conteúdo alinhado sem quebrar */
`;

export const HighlightName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral.dark};
`;

export const HighlightDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.neutral.default};
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

export const PriceContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2.5rem; /* Equivalente ao h-10 */
  display: flex;
  gap: 0.75rem;
  padding: 0 1rem;
`;

export const NewPrice = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.green.default};
`;

export const OldPrice = styled.span`
  font-size: 1rem;
  text-decoration: line-through;
  color: ${({ theme }) => theme.colors.neutral.dark};
`;