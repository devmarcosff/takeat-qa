import axios from "axios";

export const api_delivery = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api_public = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_PUBLIC,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api_confirm_pix = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_CONFIRM_PIX,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api_token_card = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_VALIDATE_TOKEN_CARD,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api_create_order = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_VALIDATE_ORDER,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api_validate_address = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_VALIDATE_ADDRESS,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api_delivery_address = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_DELIVERY_ADDRESS_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api_categories_delivery = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_CATEGORIES_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api_Club = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_CLUB,
  headers: {
    "Content-Type": "application/json",
  },
});