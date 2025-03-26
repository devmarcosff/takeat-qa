"use client";

import styled, { css, keyframes, ThemeProvider } from "styled-components";
import { DEFAULT_THEME } from "takeat-design-system-ui-kit";

export default function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={DEFAULT_THEME}>{children}</ThemeProvider>;
}

// Animação de entrada com fade-in e leve zoom-in
export const fadeZoomOut = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: .3;
    transform: scale(.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

export const fadeZoomIn = keyframes`
  0% {
    opacity: 0.3;
    transform: scale(0.99);
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

export const CartFadeUp = keyframes`
  0% { 
    bottom: -50px;
  }
  100% { 
    bottom: 0px;
  }
`;

export const fadeInPage = keyframes`
  0% { 
    transform: translateY(0px);
  } 
    100% { 
      transform: translateY(0); 
  }
`;

// Animação de leve escala e pingo d'água
export const bounceDrop = keyframes`
  0% {
    transform: translateY(-10px);
    opacity: 0;
  }
  50% {
    transform: translateY(-20px);
  }
  70% {
    transform: translateY(0);
  }
  85% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(0);
  }
`;

// Animação de leve escala e vibração
export const cartUpdate = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.15) translateX(-4px); }
  50% { transform: scale(1) translateX(-2px); }
  60% { transform: scale(1) translateX(2px); }
  70% { transform: scale(1) translateX(-1px); }
  80% { transform: scale(1) translateX(1px); }
  100% { transform: scale(1); }
`;

export const TakeatApp = styled.div`
  position: relative;
  /* height: 100vh; */
  z-index: 30;
  /* animation: ${fadeZoomIn} .3s ease-out; */
`;

export const TakeatPage = styled.div`
  position: absolute;
  z-index: 100;
  /* animation: ${CartFadeUp} .3s ease-in-out; */
`;

export const LoadingWrapper = styled.div`
  ${({ }) => css`
    opacity: 0;
    /* animation: ${fadeZoomOut} .6s ease-in-out; */
  `}
`;