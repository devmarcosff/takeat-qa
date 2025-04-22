import { ICart } from "@/components/addProducts/addProducts.types";
import { Product } from "@/types/categories.types";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice, IconClockFilled } from "takeat-design-system-ui-kit";
import { CategoriesProps } from "../restaurants.types";
import ProductDrawer from "./products.drawer";
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

export default function ProductsRestaurant({ categories = [], params, searchTerm }: CategoriesProps & { searchTerm: string }) {
  const takeatBagKey = `@deliveryTakeat:${params}TakeatBag`;
  // const [_, setOpenIndexes] = useState<number[]>([]);
  const [parsedBag, setParsedBag] = useState<number>(0);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [productInDrawer, setProductInDrawer] = useState<Product>({} as Product);
  const router = useRouter();

  // const toggleShow = (index: number) => {
  //   setOpenIndexes((prevIndexes) =>
  //     prevIndexes.includes(index) ? prevIndexes.filter((i) => i !== index) : [...prevIndexes, index]
  //   );
  // };

  const viewProductInDrawer = (product: Product) => {
    const productSlug = encodeURIComponent(product.name);
    // Atualiza a URL (shallow: true)
    router.push(`?produto=${productSlug}`, { scroll: false });

    setOpenDrawer(!openDrawer)
    setProductInDrawer(product)
  }

  useEffect(() => {
    const storedBag = localStorage.getItem(takeatBagKey);
    const parsedBag = storedBag ? JSON.parse(storedBag)?.products || [] : [];
    const qtd = parsedBag.reduce((acc: number, item: ICart) => acc + (item.qtd), 0);
    setParsedBag(qtd)

    // const handleToggleAccordion = (event: CustomEvent) => {
    //   const categoryName = event.detail;
    //   const categoryIndex = categories.findIndex((item) => item.name === categoryName);
    //   if (categoryIndex !== -1) {
    //     setOpenIndexes((prev) => (prev.includes(categoryIndex) ? prev : [...prev, categoryIndex]));
    //   }
    // };

    // window.addEventListener("toggleAccordion", handleToggleAccordion as EventListener);

    // return () => {
    //   window.removeEventListener("toggleAccordion", handleToggleAccordion as EventListener);
    // }; s
  }, [categories]);

  const parsedbag = parsedBag;

  const allProducts = categories.flatMap((cat) => cat.products);
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProductsContainer search={searchTerm.length} parsedbag={parsedbag}>
      {searchTerm ? (
        <div className="space-y-2">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => {
              return (
                <div
                  onClick={() => viewProductInDrawer(product)}
                  className="flex bg-white rounded-2xl p-3 shadow"
                  key={index}>
                  <ProductDetails>
                    <h2>{product.name}</h2>
                    <p className="line-clamp-3">{product.description}</p>
                    <ProductPrice>
                      {formatPrice(product.combo_delivery_price || product.delivery_price_promotion || product.delivery_price || product.price)}
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
            // const isOpen = openIndexes.includes(index);
            const isOpen = true;
            const categoryImageUrl =
              item?.image?.url ||
              item.products.find((p) => p.image?.url)?.image?.url;

            return (
              <CategoryContainer key={index}>
                <CategoryHeader
                  id={item.name}>
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
                            onClick={() => viewProductInDrawer(product)}
                          >
                            <ProductDetails>
                              <h2>{product.name}</h2>
                              <p className="line-clamp-3">{product.description}</p>
                              <ProductPrice delivery_price={product.delivery_price_promotion ? product.delivery_price_promotion : undefined}>
                                {/* {product.is_combo ? <span className="!no-underline">A partir de </span> : null} */}
                                {formatPrice(product.combo_delivery_price || product.delivery_price_promotion || product.delivery_price || product.price)}
                                {!!product.delivery_price_promotion && (
                                  <span>{formatPrice(product.delivery_price_promotion)}</span>
                                )}
                              </ProductPrice>
                            </ProductDetails>

                            <ProductImage
                              src={
                                product.image?.url}
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

      <ProductDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} products={productInDrawer} params={params} />
    </ProductsContainer>
  );
}
