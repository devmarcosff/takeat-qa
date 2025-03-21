import { Category } from "@/types/categories.types";
import { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconClose, IconSearch } from "takeat-design-system-ui-kit";
import { Logo } from "../header/header.components";
import { RestaurantDetails } from "../header/header.style";
import {
  CarouselContainer,
  CarouselViewport,
  CarouselWrapper,
  CategoriesContainer,
  CategoriesTitle,
  CategoryImage,
  CategoryImageContainer,
  CategoryItem,
  CategoryName,
  SearchContainer,
  SearchInput
} from "./categories.style";

export interface Props {
  categories?: Category[],
  scrolling: number;
}

export default function CategoriesRestaurant({ categories, scrolling }: Props) {
  const OPTIONS: EmblaOptionsType = {
    align: "start",
    loop: false,
    dragFree: true,
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  };
  const [emblaRef] = useEmblaCarousel(OPTIONS, [Autoplay()]);

  const router = useRouter();
  const [checkCategorie, setCheckCategorie] = useState<string>()
  const height = scrolling * 30;
  const heightSearch = scrolling * 50;

  const handleCategoryClick = (categoryName: string) => {
    router.push(`#${categoryName}`);
    setCheckCategorie(categoryName)

    const element = document.getElementById(categoryName);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("toggleAccordion", { detail: categoryName }));
      }, 300);
    }
  };

  return (
    <CategoriesContainer>
      <RestaurantDetails scrolling={scrolling} height={heightSearch}>
        <SearchContainer>
          <IconSearch style={{ fontSize: "22px", fill: "#545454" }} />
          <SearchInput type="text" placeholder="Buscar produto" />
          <IconClose style={{ fontSize: "22px", fill: "#545454" }} />
        </SearchContainer>
      </RestaurantDetails>

      <RestaurantDetails scrolling={scrolling} height={height}>
        <CategoriesTitle>Categorias</CategoriesTitle>
      </RestaurantDetails>

      <CarouselWrapper>
        <CarouselViewport ref={emblaRef}>
          <CarouselContainer>
            {categories?.map((item, index) => (
              <CategoryItem key={index} onClick={() => handleCategoryClick(item.name)}>
                <CategoryItem>
                  <CategoryImageContainer border={checkCategorie === item.name ? true : undefined}>
                    <CategoryImage
                      style={scrolling ? { width: 70, height: 70 } : { width: 60, height: 60 }}
                      src={item?.image?.url || Logo}
                      width={70}
                      height={70}
                      alt={`${item?.id}`}
                    />
                  </CategoryImageContainer>
                  <CategoryName color={checkCategorie === item.name ? "selected" : undefined}>{item.name}</CategoryName>
                </CategoryItem>
              </CategoryItem>
            ))}
          </CarouselContainer>
        </CarouselViewport>
      </CarouselWrapper>
    </CategoriesContainer>
  );
}