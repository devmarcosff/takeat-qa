"use client";
import { ICashbackDrawer } from "@/app/[restaurants]/(pages)/confirmar-pedido/types";
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
  cuponValue: ICashbackDrawer;
  setCuponValue: React.Dispatch<React.SetStateAction<ICashbackDrawer>>;
  cashbackValue: string | undefined;
  setCashbackValue: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export const DeliveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [getRestaurants, setGetRestaurants] = useState<Restaurant | null>(null);
  const [getCategories, setGetCategories] = useState<Category[]>([]);
  const [cuponValue, setCuponValue] = useState({} as ICashbackDrawer);
  const [cashbackValue, setCashbackValue] = useState<string>();

  const fetchInitialData = async (restaurant: string) => {
    try {
      const res = await api_delivery.get(`/${restaurant}`);
      setGetRestaurants(res.data);
      localStorage.setItem(`@deliveryTakeatRestaurant:${restaurant}`, JSON.stringify(res.data));
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
        cuponValue,
        setCuponValue,
        cashbackValue,
        setCashbackValue
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error("useDelivery deve ser usado dentro de um DeliveryProvider");
  }
  return context;
};
