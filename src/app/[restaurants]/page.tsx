"use client";
import MenuComponent from "@/components/menu/menu.component";
import HeaderComponent from "@/components/restaurants/header/header.components";
import ProductsRestaurant from "@/components/restaurants/product/products.component";
import { TakeatApp, TakeatPage } from "@/components/theme/ThemeProviderWrapper";
import PageWrapper from "@/hook/pageWrapper";
import { useSearch } from "@/hook/useSearch";
import { api_categories_delivery, api_delivery } from "@/utils/apis";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  params: Promise<{ restaurants: string }>;
}

export default function Restaurant({ params }: Props) {
  const restaurant = React.use(params)?.restaurants;
  const [getRestaurants, setGetRestaurants] = useState(null);
  const [getCategories, setGetCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { push } = useRouter();
  const [searchTerm] = useSearch();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await api_delivery.get(`/${restaurant}`);
        setGetRestaurants(res.data);

        const deliveryInfos = {
          delivery_minimum_price: res.data.delivery_info.delivery_minimum_price,
          is_delivery_by_distance: res.data.delivery_info.is_delivery_by_distance,
          delimit_by_area: res.data.delivery_info.delimit_by_area,
          restaurantId: res.data.delivery_info.id,
          has_credit_card: res.data.has_credit_card,
          has_pix: res.data.has_pix
        }

        localStorage.setItem(`@deliveryTakeat:${restaurant}`, JSON.stringify(deliveryInfos))

        const storageAceptTermsStorage = localStorage.getItem(`@aceptTermsStorage:${restaurant}`)
        if (!storageAceptTermsStorage) localStorage.setItem(`@aceptTermsStorage:${restaurant}`, JSON.stringify(false))

        api_categories_delivery.get(`/${res.data.id}?gd=true`)
          .then((res) => {
            setGetCategories(res.data);

            setLoading(false);
          })
          .catch(() => console.error('Restaurante não encontrado'));
      } catch {
        alert('Restaurante não encontrado');
        push('/');
      }
    };
    fetchRestaurant();
  }, [restaurant, push]);

  if (loading) return;

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