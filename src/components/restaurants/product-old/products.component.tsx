import { ICart } from "@/components/addProducts/addProducts.types";
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

export default function ProductsRestaurantOld({ categories = [], params, searchTerm }: CategoriesProps & { searchTerm: string }) {
  const takeatBagKey = `@deliveryTakeat:${params}TakeatBag`;
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [parsedBag, setParsedBag] = useState<number>(0);
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
    const storedBag = localStorage.getItem(takeatBagKey);
    const parsedBag = storedBag ? JSON.parse(storedBag)?.products || [] : [];
    const qtd = parsedBag.reduce((acc: number, item: ICart) => acc + (item.qtd), 0);
    setParsedBag(qtd)

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

  const parsedbag = parsedBag;

  const allProducts = categories.flatMap((cat) => cat.products);
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProductsContainer parsedbag={parsedbag}>
      {searchTerm ? (
        <div className="space-y-2">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => {
              return (
                <div className="flex bg-white rounded-2xl p-3 shadow" key={index} onClick={() => savedStorage(product)}>
                  <ProductDetails className="">
                    <h2>{product.name}</h2>
                    <p className="line-clamp-3">{product.description}</p>
                    <ProductPrice>
                      {!!product.delivery_price
                        ? formatPrice(product.delivery_price)
                        : formatPrice(product.price)}
                      {!!product.delivery_price_promotion && (
                        <span>{formatPrice(product.delivery_price_promotion)}</span>
                      )}
                    </ProductPrice>
                  </ProductDetails>
                  <ProductImage
                    src={product.image?.url}
                    width={100}
                    height={100}
                    alt={product.name}
                  />
                </div>
              )
            })
          ) : (
            <p className="text-sm text-center text-gray-500">
              Nenhum produto encontrado.
            </p>
          )}
        </div>
      ) : (
        <div id="accordionExample">
          {categories.map((item, index) => {
            const isOpen = openIndexes.includes(index);
            const categoryImageUrl =
              item?.image?.url ||
              item.products.find((p) => p.image?.url)?.image?.url;

            return (
              <CategoryContainer key={index}>
                <CategoryHeader onClick={() => toggleShow(index)} id={item.name}>
                  <CategoryImageContainer>
                    <CategoryImage
                      src={categoryImageUrl}
                      width={"100%"}
                      height={"100%"}
                      alt="Categoria"
                    />
                    <Overlay />
                  </CategoryImageContainer>
                  <CategoryButton
                    aria-expanded={isOpen}
                    aria-controls={`collapse-${index}`}
                  >
                    <CategoryTitle>
                      <h2>{item.name}</h2>
                      {!!item.preparation_time && (
                        <h2>
                          <IconClockFilled style={{ fill: "#FFF" }} />{" "}
                          {item.preparation_time}
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
                          <ProductItem
                            key={index}
                            onClick={() => savedStorage(product)}
                          >
                            <ProductDetails>
                              <h2>{product.name}</h2>
                              <p className="line-clamp-3">
                                {product.description}
                              </p>
                              <ProductPrice>
                                {!!product.delivery_price
                                  ? formatPrice(product.delivery_price)
                                  : formatPrice(product.price)}
                                {!!product.delivery_price_promotion && (
                                  <span>
                                    {formatPrice(product.delivery_price_promotion)}
                                  </span>
                                )}
                              </ProductPrice>
                            </ProductDetails>

                            <ProductImage
                              src={product.image?.url}
                              width={1000}
                              height={1000}
                              alt={product.name}
                            />
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
      )}
    </ProductsContainer>
  );
}
