"use client";
import { AddProductsContainer, AddProductsQuantity, ButtonAddProducts, QuantityAddProducts, SelectAddProducts, TextAddProductsQuantity } from "@/components/addProducts/addProducts.style";
import { ICart } from "@/components/addProducts/addProducts.types";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Complement, ComplementCategory, Product } from "@/types/categories.types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RiSubtractLine } from "react-icons/ri";
import { formatPrice, IconAddCircleFilled, IconClose, IconRoundChat, IconTrashFilled } from "takeat-design-system-ui-kit";
import Placeholder from '../../../assets/placeholder.svg';
import { ProductInternalContainer } from "./products.style";

interface IDrawerProps {
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  products: Product;
  params: string;
}

type ComplementItem = {
  name: string;
  limit: number;
  qtd: number;
  price: string;
  categoryId: string;
  complementId: string;
};

export default function ProductDrawer({ openDrawer, setOpenDrawer, products, params }: IDrawerProps) {
  const [selectedComplements, setSelectedComplements] = useState<{ [key: string]: string }>({});
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, { qtd: number; categoryId: string; complementId: string; price: string, limit: number, name: string }>>({});
  const [lastQuantities, setLastQuantities] = useState<{ [key: string]: number }>({});
  const [observation, setObservation] = useState<string>('');
  const [quantityProduct, setQuantityProduct] = useState(1);
  const [valueProduct, setValueProduct] = useState(products?.delivery_price || 0);
  const [complements, setComplements] = useState<ComplementItem[]>([]);
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cartItems = Object.values(selectedQuantities).filter(({ qtd }) => qtd > 0).map(({ name, limit, qtd, price, categoryId, complementId }) => ({
      name,
      limit,
      qtd,
      price,
      categoryId,
      complementId,
    }));

    setComplements(cartItems);

    // 1. Valor base do combo
    const comboBase = products.is_combo
      ? Number(products.combo_delivery_price || products.combo_price)
      : Number(products.delivery_price_promotion || products.delivery_price || products.price);

    // 2. Calcular o extra dos complementos selecionados
    const extra = products.complement_categories?.reduce((sum, category) => {
      const categoryComplements = cartItems.filter(comp => comp.categoryId === String(category.id));

      if (category.more_expensive_only) {
        // Pega apenas o complemento mais caro
        const mostExpensive = categoryComplements.reduce((max, comp) =>
          Math.max(max, Number(comp.price)), 0);
        return sum + mostExpensive;
      } else if (category.use_average) {
        // Calcula a média dos complementos selecionados
        const totalPrice = categoryComplements.reduce((sum, comp) =>
          sum + Number(comp.price), 0);
        const average = categoryComplements.length > 0 ? totalPrice / categoryComplements.length : 0;
        return sum + average;
      } else {
        // Soma normal multiplicada pela quantidade
        return sum + categoryComplements.reduce((sum, comp) =>
          sum + (Number(comp.price) * comp.qtd), 0);
      }
    }, 0) || 0;

    // 3. Valor final
    const final = (comboBase + extra) * quantityProduct;
    setFinalPrice(final);
    setValueProduct(final);
  }, [selectedQuantities, products, quantityProduct]);

  useEffect(() => {
    resetProductState();
  }, [products.id]);

  const resetProductState = () => {
    setSelectedComplements({});
    setSelectedQuantities({});
    setLastQuantities({});
    setObservation('');
    setQuantityProduct(1);
    setValueProduct(products.delivery_price || 0);
    setComplements([]);
  };

  // const weightProduct = products.use_weight ? quantityProduct : undefined

  const getCategoryCounts = (
    selectedQuantities: Record<string, { qtd: number; categoryId: string; complementId: string; price: string }>,
    categoryId: string
  ) => {
    return Object.values(selectedQuantities)
      .filter((item) => item.categoryId === categoryId)
      .reduce((sum, item) => sum + item.qtd, 0);
  };

  const handleQuantityChange = (
    complementPrice: string,
    complementLimit: number,
    complementName: string,
    categoryId: string,
    complementId: string,
    amount: number
  ) => {
    const key = `${categoryId}-${complementName}`;

    setSelectedQuantities((prev) => {
      const prevQuantity = prev[key]?.qtd || 0;
      const newQuantity = prevQuantity + amount;

      if (newQuantity < 0) return prev;

      setLastQuantities((prevLast) => ({
        ...prevLast,
        [key]: prevQuantity,
      }));

      const updatedData = {
        ...prev,
        [key]: {
          name: complementName,
          qtd: newQuantity,
          limit: complementLimit,
          price: complementPrice,
          categoryId: categoryId,
          complementId: complementId,
          observation: observation
        },
      };

      // Verifica se atingiu o limite da categoria e faz scroll para a próxima
      const currentCategory = products.complement_categories?.find(cat => String(cat.id) === categoryId);
      if (currentCategory) {
        const totalCategoryQuantity = getCategoryCounts(updatedData, categoryId);
        const totalCategories = products.complement_categories?.length || 0;
        const currentIndex = products.complement_categories?.findIndex(cat => String(cat.id) === categoryId) || -1;
        // Só faz scroll se NÃO for a última categoria
        if (
          totalCategoryQuantity >= currentCategory.limit &&
          currentIndex !== -1 &&
          currentIndex < totalCategories - 1
        ) {
          const nextCategory = products.complement_categories?.[currentIndex + 1];
          if (nextCategory) {
            const nextElement = categoryRefs.current[nextCategory.id];
            if (nextElement) {
              const scrollContainer = scrollContainerRef.current;
              if (scrollContainer) {
                const containerTop = scrollContainer.getBoundingClientRect().top;
                const elementTop = nextElement.getBoundingClientRect().top;
                const footerHeight = 65;
                const scrollOffset = elementTop - containerTop + scrollContainer.scrollTop - 50 - footerHeight;

                scrollContainer.scrollTo({
                  top: scrollOffset,
                  behavior: 'smooth'
                });
              }
            }
          }
        }
      }

      return updatedData;
    });
  };

  const handleSelectComplement = (
    complementPrice: string,
    complementName: string,
    complementLimit: number,
    categoryId: string,
    complementId: string
  ) => {
    setSelectedComplements((prev) => {
      return { ...prev, [categoryId]: complementId };
    });

    setSelectedQuantities((prev) => {
      const updatedQuantities = { ...prev };

      Object.keys(prev).forEach((key) => {
        if (key.startsWith(`${categoryId}-`)) {
          delete updatedQuantities[key];
        }
      });

      const updatedData = {
        ...updatedQuantities,
        [`${categoryId}-${complementName}`]: {
          name: complementName,
          qtd: 1,
          limit: complementLimit,
          price: complementPrice,
          categoryId: categoryId,
          complementId: complementId,
        },
      };

      return updatedData;
    });

    return {
      name: complementName,
      qtd: 1,
      price: complementPrice,
      categoryId: categoryId,
      complementId: complementId,
    };
  };

  const handleCloseDrawer = () => {
    router.push(`/${params}`, { scroll: false });
    setOpenDrawer(false);
  };

  // const calculateAveragePrice = (complements: ComplementItem[]) => {
  //   const totalPrice = complements.reduce((sum, complement) => {
  //     return sum + (Number(complement.price) * complement.qtd);
  //   }, 0);

  //   const totalQuantity = complements.reduce((sum, complement) => sum + complement.qtd, 0);

  //   return totalQuantity > 0 ? totalPrice / totalQuantity : 0;
  // };

  // const mapToComplementFormat = (complements: ComplementItem[], categories: ComplementCategory[]) => {
  //   return complements.map(complement => {
  //     const category = categories.find(cat => String(cat.id) === complement.categoryId);
  //     return {
  //       price: String(complement.price),
  //       amount: category?.more_expensive_only ? 1 : complement.qtd,
  //       category: {
  //         additional: category?.additional || false,
  //         more_expensive_only: category?.more_expensive_only || false,
  //         use_average: category?.use_average || false
  //       }
  //     };
  //   });
  // };

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const validateRequiredCategories = (): boolean => {
    if (!Array.isArray(products?.complement_categories)) return true;

    // Filtra apenas categorias disponíveis em delivery
    const availableCategories = Array.isArray(products.complement_categories)
      ? products.complement_categories.filter(category =>
        category.available_in_delivery &&
        Array.isArray(category.complements) &&
        category.complements.some(complement => complement.available_in_delivery)
      )
      : [];

    for (const category of availableCategories) {
      if (!category.optional) {
        const selectedCount = getCategoryCounts(selectedQuantities, `${category.id}`);
        if (selectedCount < category.limit) {
          const element = categoryRefs.current[category.id];
          if (element) {
            setHighlightedCategory(String(category.id));
            element.scrollIntoView({ behavior: "smooth", block: "nearest" });

            setTimeout(() => {
              setHighlightedCategory(null);
            }, 1500);
          }
          return false;
        }
      }
    }

    return true;
  };

  const incrementWeight = () => {
    setQuantityProduct((prev) => parseFloat((prev + 0.050).toFixed(3)));
  };

  const decrementWeight = () => {
    setQuantityProduct((prev) => {
      const newValue = prev - 0.050;
      return newValue < 0.050 ? 0.050 : parseFloat(newValue.toFixed(3));
    });
  };

  // Adiciona este useEffect logo após os outros useEffects existentes
  useEffect(() => {
    products.complement_categories?.forEach((category, index) => {
      const totalCategoryQuantity = getCategoryCounts(selectedQuantities, String(category.id));
      const totalCategories = products.complement_categories?.length || 0;
      // Só faz scroll se NÃO for a última categoria
      if (
        totalCategoryQuantity >= category.limit &&
        index < totalCategories - 1
      ) {
        const nextCategory = products.complement_categories?.[index + 1];
        if (nextCategory) {
          const nextElement = categoryRefs.current[nextCategory.id];
          if (nextElement) {
            requestAnimationFrame(() => {
              nextElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
            });
          }
        }
      }
    });
  }, [selectedQuantities, products.complement_categories]);

  const handleAddToBag = () => {
    if (Number(valueProduct) <= 0 || quantityProduct === 0) return;

    const isValid = validateRequiredCategories();
    if (!isValid) return;

    const takeatBag = `@deliveryTakeat:${params}TakeatBag`;
    const storedCart = localStorage.getItem(takeatBag);
    const existingCart = storedCart ? JSON.parse(storedCart) : { products: [] };

    const image = products.image ? products.image.url_thumb : Placeholder;

    // Calculamos o preço unitário (sem multiplicar pela quantidade)
    const unitPrice = finalPrice / quantityProduct;

    // Mapeia os complementos incluindo o additional da categoria
    const complementsWithAdditional = complements.map(complement => {
      const category = products.complement_categories?.find(cat => String(cat.id) === complement.categoryId);
      return {
        ...complement,
        additional: category?.additional || false,
        more_expensive_only: category?.more_expensive_only || false,
        use_average: category?.use_average || false
      };
    });

    const payloadProduct = {
      name: products.name,
      categoryId: products.id,
      delivery_price: unitPrice,
      price: unitPrice,
      img: image,
      observation: observation,
      complements: complementsWithAdditional,
      qtd: quantityProduct,
      use_weight: products.use_weight
    };

    let updatedCart;

    const existingProduct = existingCart.products.find(
      (item: ICart) =>
        Number(item.categoryId) === payloadProduct.categoryId &&
        JSON.stringify(item.complements) === JSON.stringify(payloadProduct.complements) &&
        item.observation === payloadProduct.observation
    );

    if (existingProduct) {
      updatedCart = existingCart.products.map((item: ICart) =>
        Number(item.categoryId) === payloadProduct.categoryId &&
          JSON.stringify(item.complements) === JSON.stringify(payloadProduct.complements) &&
          item.observation === payloadProduct.observation
          ? { ...item, qtd: item.qtd + payloadProduct.qtd }
          : item
      );
    } else {
      updatedCart = [...existingCart.products, payloadProduct];
    }

    localStorage.setItem(takeatBag, JSON.stringify({ products: updatedCart }));
    handleCloseDrawer();
  };

  return (
    <Drawer open={openDrawer} onOpenChange={handleCloseDrawer}>
      <DrawerContent className="h-full w-full flex flex-col overflow-hidden !rounded-none">
        <div className="!-mt-8 mb-6">
          <div className="fixed top-6 right-6 z-20">
            <button className="w-full flex items-center justify-center bg-white rounded-lg p-3 border">
              <IconClose onClick={() => handleCloseDrawer()} />
            </button>
          </div>
          <Image src={products.image?.url_thumb || Placeholder} className="!w-full h-full max-h-[330px]" width={100} height={100} alt="Takeat Image" />
        </div>

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-4 pb-64 scroll-smooth [scroll-padding-bottom:10px] !rounded-t-[40px] overflow-hidden"
        >
          <ProductInternalContainer>
            <div>
              <div className="flex flex-col gap-3 mb-3 w-full">
                <div className="flex items-center justify-between">
                  <DrawerTitle className="font-semibold text-lg">{products.name}</DrawerTitle>
                  {products.promotion && (
                    <span className="rounded-full border flex items-center justify-center text-nowrap border-takeat-primary-default px-3 py-2 font-semibold text-takeat-primary-default shadow-md">
                      {products.promotion}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-takeat-neutral-dark">{products.description}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="text-takeat-green-dark font-semibold">
                      {
                        products.is_combo ? formatPrice(products.is_combo ? products.combo_delivery_price : products.combo_price) :
                          formatPrice(products.delivery_price_promotion || products.delivery_price || products.price_promotion || products.price)
                      }
                    </p>
                    {products.delivery_price_promotion && (
                      <p className="text-takeat-neutral-dark line-through">
                        {formatPrice(products.delivery_price)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {Array.isArray(products.complement_categories) ? products.complement_categories.filter(category =>
              category.available_in_delivery &&
              Array.isArray(category.complements) &&
              category.complements.some(complement => complement.available_in_delivery)
            ).map((category: ComplementCategory) => {
              return (
                <div
                  ref={(el) => { categoryRefs.current[category.id] = el }}
                  key={category.id}>
                  <div className={`flex transition-all duration-300 justify-between items-start px-4 py-2 mt-3 bg-takeat-neutral-lightest shadow rounded-xl ${highlightedCategory === String(category.id) ? 'ring-2 ring-takeat-primary-default bg-animation-slide-up-fade' : ''}`}>
                    <div>
                      <h3 className="text-lg font-semibold text-takeat-neutral-dark">{category.question}</h3>
                      <p className="text-takeat-neutral-dark text-sm">
                        Escolha até {category.limit === 1 ? `${category.limit} opção` : `${category.limit} opções`}
                      </p>
                      {category.use_average && (
                        <p className="text-xs text-takeat-primary-default">
                          Será cobrado a média dos complementos selecionados
                        </p>
                      )}
                      {category.more_expensive_only && (
                        <p className="text-xs text-takeat-primary-default">
                          Será cobrado apenas o complemento mais caro
                        </p>
                      )}
                    </div>
                    {!category.optional && (
                      <span className="bg-red-600 text-white px-2 py-1 text-sm font-semibold rounded-full">
                        Obrigatório
                      </span>
                    )}
                  </div>

                  {category.limit === 1 ? (
                    <div className="mt-4 space-y-3">
                      {Array.isArray(category.complements) ? category.complements.filter(complement => complement.available_in_delivery).map((complement: Complement) => (
                        <label
                          key={complement.id}
                          className="transition-all flex items-center cursor-pointer justify-between p-2 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {complement.image?.url_thumb && (
                              <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                                <Image
                                  src={complement.image.url_thumb}
                                  alt={complement.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="text-md font-medium">{complement.name}</span>
                              <span className={`text-md font-semibold text-sm ${Number(complement.delivery_price) == 0 && 'hidden'}`}>{formatPrice(complement.delivery_price)}</span>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name={`category-${category.id}`}
                            value={complement.id}
                            checked={selectedComplements[category.id] === String(complement.id)}
                            onChange={() => handleSelectComplement(`${complement.delivery_price}`, `${complement.name}`, category.limit, `${category.id}`, `${complement.id}`)}
                            className="hidden"
                          />
                          <span
                            className={`w-5 h-5 flex items-center justify-center border-2 rounded-full ${selectedComplements[category.id] === String(complement.id) ? "border-takeat-primary-default" : "border-gray-500"
                              }`}
                          >
                            {selectedComplements[category.id] === String(complement.id) && (
                              <span className="w-3 h-3 bg-takeat-primary-default rounded-full"></span>
                            )}
                          </span>
                        </label>
                      )) : null}
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {Array.isArray(category.complements) ? category.complements.filter(complement => complement.available_in_delivery).map((complement: Complement) => {
                        const key = `${category.id}-${complement.name}`;
                        const quantity = selectedQuantities[key]?.qtd || 0;
                        const lastQuantity = lastQuantities[key] || 0;
                        const totalCategoryQuantity = getCategoryCounts(selectedQuantities, `${category.id}`);
                        const isAddDisabled = totalCategoryQuantity >= category.limit;

                        return (
                          <div
                            key={complement.id}
                            className="transition-all flex items-center cursor-pointer justify-between p-2 rounded-lg">
                            <div className="flex items-center gap-3">
                              {complement.image?.url_thumb && (
                                <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                                  <Image
                                    src={complement.image.url_thumb}
                                    alt={complement.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="text-md font-medium">{complement.name}</span>
                                <span className={`text-md font-semibold text-sm ${Number(complement.delivery_price) || Number(complement.price) == 0 && 'hidden'}`}>{formatPrice(complement.delivery_price || complement.price)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                disabled={quantity === 0}
                                className={`w-7 h-7 flex items-center justify-center text-takeat-primary-default rounded-full font-bold text-lg transition-all ${quantity === 0 ? "hidden" : ""}`}
                                onClick={() => {
                                  handleQuantityChange(`${complement.delivery_price || complement.price}`, complement.limit, `${complement.name}`, `${category.id}`, `${complement.id}`, -1)
                                }
                                }
                              >
                                {quantity === 1 ? <IconTrashFilled className="fill-takeat-primary-default w-full h-full" /> : <RiSubtractLine className="fill-takeat-primary-default w-full h-full" />}
                              </button>

                              <div className="relative rounded-full w-5 h-5  flex items-center justify-center overflow-hidden">
                                <AnimatePresence mode="popLayout">
                                  <motion.span
                                    key={quantity}
                                    initial={{ y: quantity > lastQuantity ? -20 : 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: lastQuantity > quantity ? 20 : -20, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "backInOut" }}
                                    style={{ position: "absolute", fontSize: "16px", fontWeight: 600 }}
                                  >
                                    {quantity}
                                  </motion.span>
                                </AnimatePresence>
                              </div>

                              <button
                                disabled={isAddDisabled || quantity === complement.limit}
                                className={`w-7 h-7 flex items-center justify-center rounded-full font-bold text-lg ${isAddDisabled ? "opacity-50 cursor-not-allowed" : ""} ${quantity === complement.limit ? "opacity-50 cursor-not-allowed" : ""} `}
                                onClick={() => handleQuantityChange(`${Number(complement.delivery_price) || Number(complement.price)}`, complement.limit, `${complement.name}`, `${category.id}`, `${complement.id}`, 1)}
                              >
                                <IconAddCircleFilled className="fill-takeat-primary-default w-full h-full" />
                              </button>
                            </div>
                          </div>
                        );
                      }) : null}
                    </div>
                  )}
                </div>
              );
            }) : null}

            <div className="flex flex-col items-start my-2 gap-2">
              <span className="flex gap-1"><IconRoundChat className="fill-takeat-primary-default text-xl" /> Quer fazer alguma observação?</span>
              <textarea name="observation" onChange={(e) => setObservation(e.target.value)} id="observation" className="border shadow-md rounded-md border-takeat-primary-default w-full pt-3 px-3 focus:bg-takeat-neutral-lightest" placeholder="Ex: Retirar item X" />
            </div>
          </ProductInternalContainer>
        </div>

        {/* Rodapé fixo */}
        <div className="flex-shrink-0 border-t px-4 py-2 bg-white mb-16 !border-none">
          <AddProductsContainer style={{ height: "65px !important" }}>

            {products.use_weight ? (
              <SelectAddProducts>
                <ButtonAddProducts disabled={quantityProduct <= 0.050} onClick={decrementWeight}>-</ButtonAddProducts>
                <QuantityAddProducts>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={quantityProduct}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "backInOut" }}
                      style={{
                        position: 'absolute',
                        fontSize: '16px',
                        width: '100%',
                      }}
                    >
                      {quantityProduct.toFixed(3)}
                    </motion.span>
                  </AnimatePresence>
                </QuantityAddProducts>
                <ButtonAddProducts onClick={incrementWeight}>+</ButtonAddProducts>
              </SelectAddProducts>
            ) : (
              <SelectAddProducts width={130}>
                <ButtonAddProducts disabled={quantityProduct === 1} onClick={() => setQuantityProduct(quantityProduct - 1)}>-</ButtonAddProducts>
                <QuantityAddProducts>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={quantityProduct}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "backInOut" }}
                      style={{
                        position: 'absolute',
                        fontSize: '16px'
                      }}
                    >
                      {quantityProduct}
                    </motion.span>
                  </AnimatePresence>
                </QuantityAddProducts>
                <ButtonAddProducts onClick={() => setQuantityProduct(quantityProduct + 1)}>+</ButtonAddProducts>
              </SelectAddProducts>
            )}

            <AddProductsQuantity >
              <TextAddProductsQuantity onClick={handleAddToBag}>
                <span>Adicionar </span>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={finalPrice}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: .3, ease: "easeInOut" }}
                  >
                    {formatPrice(finalPrice)}
                  </motion.span>
                </AnimatePresence>
              </TextAddProductsQuantity>
            </AddProductsQuantity>
          </AddProductsContainer>
        </div>
      </DrawerContent>
    </Drawer>
  )
}