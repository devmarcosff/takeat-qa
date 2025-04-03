"use client";
import { Category } from "@/types/categories.types";
import { Restaurant } from "@/types/restaurant.types";
import { api_categories_delivery, api_delivery } from "@/utils/apis";
import React, { createContext, useContext, useState } from "react";

interface DeliveryContextType {
  getRestaurants: Restaurant | null;
  setGetRestaurants: React.Dispatch<React.SetStateAction<Restaurant | null>>;
  getCategories: Category[];
  setGetCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  fetchInitialData: (restaurant: string) => Promise<void>;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export const DeliveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [getRestaurants, setGetRestaurants] = useState<Restaurant | null>(null);
  const [getCategories, setGetCategories] = useState<Category[]>([]);

  const fetchInitialData = async (restaurant: string) => {
    try {
      const res = await api_delivery.get(`/${restaurant}`);
      setGetRestaurants(res.data);
      localStorage.setItem(`@deliveryTakeatRestaurant:${restaurant}`, JSON.stringify(res.data));
      localStorage.setItem(`@deliveryTakeatInfo:${restaurant}`, JSON.stringify(res.data.delivery_info));
      localStorage.setItem(`@deliveryTakeat:${restaurant}`, res.data.delivery_info.delivery_minimum_price);
      const catRes = await api_categories_delivery.get(`/${res.data.id}?gd=true`);
      setGetCategories(catRes.data);
    } catch (error) {
      alert("Erro ao buscar restaurante e categorias.");
      console.error("Erro ao buscar dados:", error);
    }
  };

  return (
    <DeliveryContext.Provider
      value={{
        getRestaurants,
        setGetRestaurants,
        getCategories,
        setGetCategories,
        fetchInitialData,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  // localStorage.setItem('@deliveryTakeat', context?.getRestaurants?.is_delivery_by_distance);
  if (!context) {
    throw new Error("useDelivery deve ser usado dentro de um DeliveryProvider");
  }
  return context;
};
