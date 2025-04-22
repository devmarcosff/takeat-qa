"use client";
import AddProductsComponents from "@/components/addProducts/addProducts.components";
import { ICart } from "@/components/addProducts/addProducts.types";
import {
  ImageInternalContainer,
  ProductInternalContainer,
  ProductInternalWrapper
} from "@/components/restaurants/product/products.style";
import LoadingTakeat from "@/components/theme/loading.component";
import { Complement, ComplementCategory, Product } from "@/types/categories.types";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RiSubtractLine } from "react-icons/ri";
import { formatPrice, IconAddCircleFilled, IconChevronLeft, IconRoundChat, IconTrashFilled } from "takeat-design-system-ui-kit";
import Placeholder from '../../../../../../public/assets/placeholder.svg';

interface Props {
  params: Promise<{ restaurants: string }>;
}

export default function ProductPage({ params }: Props) {
  const restaurant = React.use(params).restaurants;
  const [storage, setStorage] = useState<Product>();
  const [selectedComplements, setSelectedComplements] = useState<{ [key: string]: string }>({});
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, { qtd: number; categoryId: string; complementId: string; price: string, limit: number, name: string }>>({});
  const [lastQuantities, setLastQuantities] = useState<{ [key: string]: number }>({});
  const [observation, setObservation] = useState<string>('');
  const [isAddButtonEnabled, setIsAddButtonEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const { back } = useRouter()
  const [showStickyHeader, setShowStickyHeader] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 250;
      setShowStickyHeader(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!restaurant) return;

    if (typeof window !== "undefined") {
      const getItemStorage = localStorage.getItem(`@deliveryTakeat:${restaurant}ProductRestaurant`);
      if (getItemStorage) {
        setStorage(JSON.parse(getItemStorage));
        setLoading(false);
      }

      const storedData = localStorage.getItem("quantityComplements");
      const jsonStoredData = JSON.parse(storedData || `{}`);
      if (jsonStoredData[`${storage?.name}`]) {
        const restoredQuantities: Record<string, { qtd: number; name: string, limit: number, categoryId: string; complementId: string; price: string }> = {};

        const categories: ComplementCategory[] = jsonStoredData[`${storage?.name}`];

        categories.forEach((category) => {
          Object.keys(category.complements).forEach((complementId) => {
            const index = Number(complementId);
            if (!isNaN(index)) {
              restoredQuantities[`${category.id}-${complementId}`] = {
                qtd: Number(category.complements[index]),
                categoryId: String(category.id),
                complementId: complementId,
                price: "0",
                name: category.complements[index].name,
                limit: category.complements[index].limit,
              };
            }
          });
        });

        setSelectedQuantities(restoredQuantities);
      }
    }
  }, [storage?.name, restaurant]);

  const cart: Record<string, ICart> = Object.entries(selectedQuantities).reduce(
    (acc, [key, item]) => ({
      ...acc,
      [key]: {
        id: item.complementId,
        name: item.name,
        qtd: item.qtd,
        limit: item.limit,
        price: item.price,
        categoryId: item.categoryId,
        complementId: item.complementId,
        observation: item.limit,
        complements: [],
      },
    }),
    {}
  );

  useEffect(() => {
    if (storage?.complement_categories) {
      const allCategoriesValid = storage.complement_categories.every((category: ComplementCategory) => {
        const totalQuantity = getCategoryCounts(selectedQuantities, `${category.id}`);

        if (category.optional) {
          return true;
        }

        return totalQuantity >= category.minimum;
      });

      setIsAddButtonEnabled(allCategoriesValid);
    }
  }, [selectedQuantities, storage?.complement_categories]);

  if (loading) return <LoadingTakeat />

  return (
    <ProductInternalContainer>
      {showStickyHeader ? (
        <div
          className={`sticky top-0 z-30 bg-white shadow px-4 py-3 flex items-center gap-3 transition-all duration-300 ${showStickyHeader ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
          <Link href={'/'} className="flex items-center justify-center bg-white rounded-lg p-2">
            <IconChevronLeft />
          </Link>
          <h2 className="text-base font-semibold truncate">{storage?.name}</h2>
        </div>
      ) : <div>
        <div className="fixed top-6 left-6 z-20">
          <button onClick={back} className="w-full flex items-center justify-center bg-white rounded-lg p-3"><IconChevronLeft /></button>
        </div>
        <ImageInternalContainer img={`${storage?.image ? storage?.image.url_thumb : Placeholder}`} />
      </div>}

      <ProductInternalWrapper>
        <div className="flex flex-col gap-3 mb-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">{storage?.name}</h2>
            {storage?.promotion && (

              <span className="rounded-full border flex items-center justify-center text-nowrap border-takeat-primary-default px-3 py-2 font-semibold text-takeat-primary-default shadow-md">
                Contém Glúten
              </span>
            )}
          </div>
          <div>
            <p className="text-takeat-neutral-dark">{storage?.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-takeat-green-dark font-semibold">{storage?.delivery_price}</p>
            <p className="text-takeat-neutral-dark line-through">{storage?.delivery_price_promotion}</p>
          </div>
        </div>

        {storage?.complement_categories?.map((category: ComplementCategory) => {
          return (
            <div key={category.id}>
              <div className="flex justify-between items-start px-4 py-2 mt-3 bg-takeat-neutral-lightest shadow rounded-xl">
                <div>
                  <h3 className="text-lg font-semibold text-takeat-neutral-dark">{category.name}</h3>
                  <p className="text-takeat-neutral-dark text-sm">
                    Escolha {category.limit === 1 ? `${category.limit} opção` : `${category.limit} opções`}
                  </p>
                </div>
                {!category.optional && (
                  <span className="bg-red-600 text-white px-2 py-1 text-sm font-semibold rounded-full">
                    Obrigatório
                  </span>
                )}
              </div>

              {category.limit === 1 ? (
                <div className="mt-4 space-y-3">
                  {category.complements.map((complement: Complement) => (
                    <label
                      key={complement.id}
                      className="transition-all flex items-center cursor-pointer justify-between p-2 rounded-lg"
                    >
                      <div className="flex flex-col">
                        <span className="text-md font-medium">{complement.name}</span>
                        <span className="text-md font-semibold text-sm">{formatPrice(complement.price)}</span>
                      </div>
                      <input
                        type="radio"
                        name={`category-${category.id}`}
                        value={complement.id}
                        checked={selectedComplements[category.id] === String(complement.id)}
                        onChange={() => handleSelectComplement(`${complement.price}`, `${complement.name}`, category.limit, `${category.id}`, `${complement.id}`)}
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
                  ))}
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {category.complements.map((complement: Complement) => {
                    const key = `${category.id}-${complement.name}`;
                    const quantity = selectedQuantities[key]?.qtd || 0;
                    const lastQuantity = lastQuantities[key] || 0;
                    const totalCategoryQuantity = getCategoryCounts(selectedQuantities, `${category.id}`);
                    const isAddDisabled = totalCategoryQuantity >= category.limit;

                    return (
                      <div
                        key={complement.id}
                        className="transition-all flex items-center cursor-pointer justify-between p-2 rounded-lg"
                      >
                        <div className="flex flex-col">
                          <span className="text-md font-medium">{complement.name}</span>
                          <span className="text-md font-semibold text-sm">{formatPrice(complement.price)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            disabled={quantity === 0}
                            className={`w-7 h-7 flex items-center justify-center text-takeat-primary-default rounded-full font-bold text-lg transition-all ${quantity === 0 ? "hidden" : ""
                              }`}
                            onClick={() =>
                              handleQuantityChange(`${complement.price}`, complement.limit, `${complement.name}`, `${category.id}`, `${complement.id}`, - 1)
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
                            className={`w-7 h-7 flex items-center justify-center rounded-full font-bold text-lg
                              ${isAddDisabled ? "opacity-50 cursor-not-allowed" : ""}
                              ${quantity === complement.limit ? "opacity-50 cursor-not-allowed" : ""}
                            `}
                            onClick={() =>
                              handleQuantityChange(`${complement.price}`, complement.limit, `${complement.name}`, `${category.id}`, `${complement.id}`, 1)
                            }
                          >
                            <IconAddCircleFilled className="fill-takeat-primary-default w-full h-full" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div className="flex flex-col items-start my-2 gap-2">
          <span className="flex gap-1"><IconRoundChat className="fill-takeat-primary-default text-xl" /> Quer fazer alguma observação?</span>
          <textarea name="observation" onChange={(e) => setObservation(e.target.value)} id="observation" className="border shadow-md rounded-md border-takeat-primary-default w-full pt-3 px-3 focus:bg-takeat-neutral-lightest" placeholder="Ex: Retirar item X" />
        </div>

      </ProductInternalWrapper>
      <AddProductsComponents disabled={!isAddButtonEnabled} product={storage} params={restaurant} cart={cart} observation={observation} />
    </ProductInternalContainer>
  );
}