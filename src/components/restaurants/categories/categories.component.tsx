import { Category } from "@/types/categories.types";
import { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useRef, useState } from "react";
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
  CategoryName
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

  const [checkCategorie, setCheckCategorie] = useState<string>()
  const height = scrolling * 30;
  const heightSearch = scrolling * 50;

  const HEADER_HEIGHT = 200;

  const categoriesRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (categoryName: string) => {
    setCheckCategorie(categoryName);

    const element = document.getElementById(categoryName);
    if (element) {
      const yOffset = -(HEADER_HEIGHT);
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("toggleAccordion", { detail: categoryName }));
      }, 300);
    }
  };

  return (
    <CategoriesContainer >
      <RestaurantDetails scrolling={scrolling} height={height}>
        <CategoriesTitle>Categorias</CategoriesTitle>
      </RestaurantDetails>

      <CarouselWrapper ref={categoriesRef}>
        <CarouselViewport ref={emblaRef}>
          <CarouselContainer>
            {categories?.map((item, index) => (
              <CategoryItem key={index} onClick={() => handleCategoryClick(item.name)}>
                <CategoryItem>
                  <CategoryImageContainer border={checkCategorie === item.name ? true : undefined}>
                    <CategoryImage
                      style={scrolling ? { width: 60, height: 60 } : { width: 55, height: 55 }}
                      src={item?.image?.url || Logo}
                      width={60}
                      height={60}
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