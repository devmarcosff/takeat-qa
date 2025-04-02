"use client";
import MenuComponent from "@/components/menu/menu.component";
import HeaderComponent from "@/components/restaurants/header/header.components";
import ProductsRestaurant from "@/components/restaurants/product/products.component";
import { TakeatApp, TakeatPage } from "@/components/theme/ThemeProviderWrapper";
import { useDelivery } from "@/context/DeliveryContext";
import PageWrapper from "@/hook/pageWrapper";
import { useSearch } from "@/hook/useSearch";
import React, { useEffect } from "react";

interface Props {
  params: Promise<{ restaurants: string }>;
}

export default function Restaurant({ params }: Props) {
  const restaurant = React.use(params)?.restaurants;
  const [searchTerm] = useSearch();
  const { getRestaurants, getCategories, fetchInitialData } = useDelivery();

  useEffect(() => {
    fetchInitialData(restaurant)
  }, []);

  return (
    <PageWrapper>
      <TakeatApp>
        <HeaderComponent searchTerm={searchTerm} restaurant={getRestaurants} categories={getCategories} />
        <div>
          {/* <HighlightsRestaurant /> */}
          <ProductsRestaurant searchTerm={searchTerm} params={restaurant} categories={getCategories} />
        </div>
      </TakeatApp>

      <TakeatPage>
        <MenuComponent params={restaurant} />
      </TakeatPage>
    </PageWrapper>
  );
}