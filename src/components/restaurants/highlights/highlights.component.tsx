import { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { formatPrice } from "takeat-design-system-ui-kit";
import {
  CarouselContainer,
  CarouselViewport,
  CarouselWrapper,
  HighlightCard,
  HighlightContent,
  HighlightDescription,
  HighlightImage,
  HighlightImageContainer,
  HighlightName,
  HighlightsContainer,
  HighlightsTitle,
  NewPrice,
  OldPrice,
  PriceContainer,
} from "./highlights.style";

const burger1 = '/assets/alimento1.png';
const burger2 = '/assets/alimento2.png';

const highlights = [
  {
    id: 1,
    name: "Double Bacon Burger",
    description: "Pão, hambúrguer, queijo, bacon, alface, tomate, maionese e ketchup",
    image: burger1,
    price: 38.0,
    newPrice: 22.99,
  },
  {
    id: 2,
    name: "Combo que mata a sua fome",
    description: "Pão, hambúrguer, queijo, bacon, alface, tomate, maionese e ketchup, batata frita e refrigerante",
    image: burger2,
    price: 70.0,
    newPrice: 54.0,
  },
  {
    id: 3,
    name: "Burger de frango",
    description: "Pão, hambúrguer de frango, queijo, alface, tomate, maionese e ketchup",
    image: burger1,
    price: 144.5,
    newPrice: 98.0,
  },
];

export default function HighlightsRestaurant() {
  const OPTIONS: EmblaOptionsType = {
    align: "start",
    loop: false,
    dragFree: false,
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  };
  const [emblaRef] = useEmblaCarousel(OPTIONS, [Autoplay()]);

  return (
    <HighlightsContainer>
      <HighlightsTitle>Destaques</HighlightsTitle>
      <CarouselWrapper>
        <CarouselViewport ref={emblaRef}>
          <CarouselContainer>
            {highlights.map((item) => (
              <Link href={`#${item.id}`} onClick={() => alert(item.id)} key={item.id}>
                <HighlightCard>
                  <h2></h2>
                  <HighlightImageContainer>
                    <HighlightImage src={item.image} width={150} height={150} alt={item.name} />
                  </HighlightImageContainer>
                  <HighlightContent>
                    <HighlightName>{item.name}</HighlightName>
                    <HighlightDescription>{item.description}</HighlightDescription>
                  </HighlightContent>
                  <PriceContainer>
                    <NewPrice>{formatPrice(item.newPrice)}</NewPrice>
                    <OldPrice>{formatPrice(item.price)}</OldPrice>
                  </PriceContainer>
                </HighlightCard>
              </Link>
            ))}
          </CarouselContainer>
        </CarouselViewport>
      </CarouselWrapper>
    </HighlightsContainer>
  );
}
