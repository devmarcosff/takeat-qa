"use client";
import MenuComponent from "@/components/menu/menu.component";
import HeaderComponent from "@/components/restaurants/header/header.components";
import ProductsRestaurant from "@/components/restaurants/product/products.component";
import { TakeatApp, TakeatPage } from "@/components/theme/ThemeProviderWrapper";
import { useDelivery } from "@/context/DeliveryContext";
import PageWrapper from "@/hook/pageWrapper";
import { useSearch } from "@/hook/useSearch";
import React, { useEffect, useState } from "react";

interface Props {
  params: Promise<{ restaurants: string }>;
}

export default function Restaurant({ params }: Props) {
  const restaurant = React.use(params)?.restaurants;
  const [searchTerm] = useSearch();
  const { getRestaurants, getCategories, fetchInitialData } = useDelivery();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchInitialData(restaurant).then(() => setIsLoading(false))
  }, []);

  if (isLoading) return;

  // ANALISA SE O RESTAURANTE ACEITA CLUBE CASHBASCK - SE VERDADEIRO(TRUE)
  // console.log(getRestaurants?.has_clube)

  // SALVA O TOKEN_CLUBE EM CACHE PARA ANALISE FUTURA
  // console.log(getRestaurants?.token_clube)

  return (
    <div>
      <PageWrapper>
        <TakeatApp>
          <HeaderComponent searchTerm={searchTerm} restaurant={getRestaurants} categories={getCategories} />
          <div>
            {/* <HighlightsRestaurant /> */}
            <ProductsRestaurant searchTerm={searchTerm} params={restaurant} categories={getCategories} />
          </div>
        </TakeatApp>
      </PageWrapper>

      <TakeatPage>
        <MenuComponent params={restaurant} />
      </TakeatPage>
    </div>
  );
}