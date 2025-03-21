import { Product } from "@/types/categories.types";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice, IconClockFilled } from "takeat-design-system-ui-kit";
import { CategoriesProps } from "../restaurants.types";
import {
  CategoryButton,
  CategoryContainer,
  CategoryHeader,
  CategoryImage,
  CategoryImageContainer,
  CategoryTitle,
  Overlay,
  ProductDetails,
  ProductImage,
  ProductItem,
  ProductList,
  ProductPrice,
  ProductsContainer
} from "./products.style";

export default function ProductsRestaurant({ categories = [], params }: CategoriesProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const { push } = useRouter()

  const toggleShow = (index: number) => {
    setOpenIndexes((prevIndexes) =>
      prevIndexes.includes(index) ? prevIndexes.filter((i) => i !== index) : [...prevIndexes, index]
    );
  };

  const savedStorage = (item: Product) => {
    localStorage.setItem(`@deliveryTakeat:${params}ProductRestaurant`, JSON.stringify(item));
    push(`/${params}/produto/${item.name}`)
  }

  useEffect(() => {
    const handleToggleAccordion = (event: CustomEvent) => {
      const categoryName = event.detail;
      const categoryIndex = categories.findIndex((item) => item.name === categoryName);
      if (categoryIndex !== -1) {
        setOpenIndexes((prev) => (prev.includes(categoryIndex) ? prev : [...prev, categoryIndex]));
      }
    };

    window.addEventListener("toggleAccordion", handleToggleAccordion as EventListener);

    return () => {
      window.removeEventListener("toggleAccordion", handleToggleAccordion as EventListener);
    };
  }, [categories]);

  return (
    <ProductsContainer>
      <div id="accordionExample">
        {categories?.map((item, index) => {
          const isOpen = openIndexes.includes(index);

          return (
            <CategoryContainer key={index}>
              <CategoryHeader onClick={() => toggleShow(index)} id={item.name}>
                <CategoryImageContainer>
                  <CategoryImage src={item?.image?.url} width={"100%"} height={"100%"} alt="Categoria" />
                  <Overlay />
                </CategoryImageContainer>
                <CategoryButton aria-expanded={isOpen} aria-controls={`collapse-${index}`}>
                  <CategoryTitle>
                    <h2>{item.name}</h2>
                    {!!item.preparation_time && (
                      <h2>
                        <IconClockFilled style={{ fill: "#FFF" }} /> {item.preparation_time}
                      </h2>
                    )}
                  </CategoryTitle>
                </CategoryButton>
              </CategoryHeader>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ProductList>
                      {item.products.map((product, index) => (
                        <ProductItem key={index} onClick={() => savedStorage(product)}>
                          <ProductDetails>
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>
                            <ProductPrice>
                              {!!product.delivery_price ? formatPrice(product.delivery_price) : formatPrice(product.price)}
                              {!!product.delivery_price_promotion && <span>{formatPrice(product.delivery_price_promotion)}</span>}
                            </ProductPrice>
                          </ProductDetails>

                          <ProductImage src={product.image?.url} width={1000} height={1000} alt={product.name} />
                        </ProductItem>
                      ))}
                    </ProductList>
                  </motion.div>
                )}
              </AnimatePresence>
            </CategoryContainer>
          );
        })}
      </div>
    </ProductsContainer>
  );
}
