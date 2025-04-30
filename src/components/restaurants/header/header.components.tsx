import useScrollProgress from "@/components/scroll/useScrollDirection";
import { setSearchGlobal } from "@/hook/useSearch";
import { Category } from "@/types/categories.types";
import { Restaurant } from "@/types/restaurant.types";
import Image from "next/image";
import { useState } from "react";
import { formatPrice, IconClose, IconLocationFilled, IconSearch } from "takeat-design-system-ui-kit";
import CategoriesRestaurant from "../categories/categories.component";
import { SearchContainer, SearchInput } from "../categories/categories.style";
import { CategoriesProps } from "../restaurants.types";
import { DrawerHeaderComponent } from "./drawer.component";
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

export default function HeaderComponent({ restaurant, categories, searchTerm }: { restaurant: Restaurant | null, categories: CategoriesProps['categories'] | [], searchTerm: string }) {
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  useScrollProgress();

  const scrolling = window.scrollY > 5 ? 0 : 1
  const height = scrolling * 72;
  const DENSITY = scrolling ? 60 : 40

  const handleSearchClick = () => {
    if (!scrolling) setIsSearchActive(!isSearchActive);
  };

  return (
    <HeaderContainer scrolling={scrolling}>
      <HeaderWrapper scrolling={scrolling}>
        <HeaderRow>
          <LogoContainer className="w-16 h-16 rounded-full overflow-hidden">
            <Image width={DENSITY} height={DENSITY}
              className="w-full h-full flex items-center justify-center"
              src={`${restaurant?.avatar.url_thumb}`} alt="Takeat" />
          </LogoContainer>
          <RestaurantInfo>
            <div className="flex relative items-center justify-between">
              <h2 className="text-takeat-neutral-darker">{restaurant?.fantasy_name}</h2>
              <IconSearchCustom onClick={handleSearchClick} scrolling={scrolling} />
            </div>

            <RestaurantDetails scrolling={scrolling} height={height} onClick={() => setOpenDrawer(true)}>
              <InfoText>
                Pedido Mínimo: {formatPrice(`${restaurant?.delivery_info.delivery_minimum_price}`)}
              </InfoText>
              <div className="flex gap-2 text-sm">
                {deliveryInfo({ restaurant })}
                <span className="text-takeat-neutral-darker">Mais informações</span>
              </div>
              <LocationText>
                <IconLocationFilled style={{ fill: "#222222" }} />
                {restaurant?.adress.city} - {restaurant?.adress.state}
              </LocationText>
            </RestaurantDetails>
          </RestaurantInfo>
        </HeaderRow>
      </HeaderWrapper>

      <RestaurantDetails
        id="search-area"
        scrolling={isSearchActive ? Number(isSearchActive) : scrolling}
        height={60}>
        <SearchContainer>
          <IconSearch style={{ fontSize: "22px", fill: "#545454" }} />
          <SearchInput
            type="text"
            placeholder="Buscar produto"
            value={searchTerm}
            onChange={(e) => setSearchGlobal(e.target.value)}
          />

          {searchTerm && (
            <IconClose
              onClick={() => setSearchGlobal('')}
              style={{ fontSize: "22px", fill: "#545454", cursor: "pointer" }}
            />
          )}
        </SearchContainer>
      </RestaurantDetails>

      <CategoriesRestaurant categories={categories as Category[]} scrolling={isSearchActive ? Number(isSearchActive) : scrolling} />

      <DrawerHeaderComponent openDrawer={openDrawer} restaurant={restaurant} setOpenDrawer={setOpenDrawer} />

    </HeaderContainer>
  );
}

export function deliveryInfo({ restaurant }: { restaurant: Restaurant | null }) {
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