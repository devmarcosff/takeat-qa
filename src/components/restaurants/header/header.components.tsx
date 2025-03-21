import useScrollProgress from "@/components/scroll/useScrollDirection";
import { Category } from "@/types/categories.types";
import { Restaurant } from "@/types/restaurant.types";
import Image from "next/image";
import { useState } from "react";
import { formatPrice, IconLocationFilled } from "takeat-design-system-ui-kit";
import CategoriesRestaurant from "../categories/categories.component";
import { CategoriesProps } from "../restaurants.types";
import {
  HeaderContainer,
  HeaderRow,
  HeaderWrapper,
  IconSearchCustom,
  InfoText,
  LocationText,
  LogoContainer,
  PulseIndicator,
  RestaurantDetails,
  RestaurantInfo,
  StatusBadge
} from "./header.style";

export const Logo = "/assets/default_image.svg";

export default function HeaderComponent({ restaurant, categories }: { restaurant: Restaurant | null, categories: CategoriesProps[] | [] }) {
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  useScrollProgress();

  const scrolling = window.scrollY > 5 ? 0 : 1
  const height = scrolling * 72;
  const DENSITY = scrolling ? 60 : 40

  function deliveryInfo() {
    if (restaurant?.delivery_info.is_delivery_active) {
      return (
        <StatusBadge color="green">
          <PulseIndicator color="green" />
          Aberto agora
        </StatusBadge>
      );
    } else if (!restaurant?.delivery_info.is_delivery_active && restaurant?.delivery_info.is_withdrawal_active) {
      return (
        <StatusBadge color="orange">
          <PulseIndicator color="orange" />
          Apenas retirada
        </StatusBadge>
      );
    } else if (!restaurant?.delivery_info.is_delivery_active && !restaurant?.delivery_info.is_withdrawal_active && restaurant?.delivery_info.is_delivery_allowed) {
      return (
        <StatusBadge color="green">
          <PulseIndicator color="green" />
          Delivery aberto
        </StatusBadge>
      );
    } else {
      return (
        <StatusBadge color="primary">
          <PulseIndicator color="primary" />
          Estamos fechados
        </StatusBadge>
      );
    }
  }

  const handleSearchClick = () => {
    if (!scrolling) setIsSearchActive(!isSearchActive);
  };

  return (
    <HeaderContainer scrolling={scrolling}>
      <HeaderWrapper scrolling={scrolling}>
        <HeaderRow>
          <LogoContainer>
            <Image width={DENSITY} height={DENSITY} src={Logo} alt="Takeat" />
          </LogoContainer>
          <RestaurantInfo>
            <div className="flex relative items-center justify-between">
              <h2>{restaurant?.fantasy_name}</h2>
              <IconSearchCustom onClick={handleSearchClick} scrolling={scrolling} />
            </div>

            <RestaurantDetails scrolling={scrolling} height={height}>
              <InfoText>
                Pedido Mínimo: {formatPrice(`${restaurant?.delivery_info.delivery_minimum_price}`)}
              </InfoText>
              <div className="flex gap-2 text-sm">
                {deliveryInfo()}
                <span>Mais informações</span>
              </div>
              <LocationText>
                <IconLocationFilled style={{ fill: "#545454" }} />
                {restaurant?.adress.city} - {restaurant?.adress.state}
              </LocationText>
            </RestaurantDetails>
          </RestaurantInfo>
        </HeaderRow>
      </HeaderWrapper>
      <CategoriesRestaurant categories={categories as Category[]} scrolling={isSearchActive ? Number(isSearchActive) : scrolling} />
    </HeaderContainer>
  );
}
