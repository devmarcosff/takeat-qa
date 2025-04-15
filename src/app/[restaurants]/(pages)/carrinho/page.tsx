"use client";
import { ICart } from "@/components/addProducts/addProducts.types";
import CarrinhoButtonComponent from "@/components/confirmar-pedido/continue.components";
import { TakeatApp } from "@/components/theme/ThemeProviderWrapper";
import InternalPages from "@/components/uiComponents/InternalPageHeader/internal_pages.header";
import PageWrapper from "@/hook/pageWrapper";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { RiSubtractLine } from "react-icons/ri";
import { formatPrice, IconAddCircleFilled, IconRoundChat, IconTrashFilled } from "takeat-design-system-ui-kit";

interface Props {
  params: Promise<{ restaurants: string }>;
}

export default function ProductPage({ params }: Props) {
  const restaurant = React.use(params).restaurants;
  const [bag, setBag] = useState<ICart[]>([]);
  const [lastQuantities, setLastQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const takeatBagKey = `@deliveryTakeat:${restaurant}TakeatBag`;
      const storedBag = localStorage.getItem(takeatBagKey);
      const parsedBag = storedBag ? JSON.parse(storedBag)?.products || [] : [];

      setBag((prevBag) => {
        if (JSON.stringify(prevBag) !== JSON.stringify(parsedBag)) {
          return parsedBag;
        }
        return prevBag;
      });
    }
  }, [restaurant]);

  const clearBag = () => {
    setBag([]);
  };

  console.log(bag)

  const updateQuantity = ({ index, newQuantity }: { index: number, newQuantity: number }) => {
    setBag((prevBag) => {
      const updatedBag = prevBag.map((item, i) => {
        if (i === index) {
          const updatedQuantity = item.qtd + newQuantity;
          setLastQuantities((prevLast) => ({ ...prevLast, [index]: item.qtd }));
          return { ...item, qtd: updatedQuantity <= 0 ? 0 : updatedQuantity };
        }
        return item;
      }).filter(item => item.qtd > 0);

      const takeatBagKey = `@deliveryTakeat:${restaurant}TakeatBag`;
      const storedCart = localStorage.getItem(takeatBagKey);
      const existingCart = storedCart ? JSON.parse(storedCart) : { products: [] };

      const updatedStorageCart = {
        ...existingCart,
        products: updatedBag,
      };

      localStorage.setItem(takeatBagKey, JSON.stringify(updatedStorageCart));

      return updatedBag;
    });
  };

  return (
    <InternalPages title="Carrinho" button>
      <PageWrapper>
        {
          bag.length > 0 ? (
            <div>
              <div className="divide-y divide-takeat-neutral-lighter pb-44 z-10 relative">
                <h2 className="text-md font-semibold py-1">Itens</h2>
                {
                  (
                    bag.map((item: ICart, index: number) => {
                      const quantity = item.qtd;
                      const lastQuantity = lastQuantities[index];

                      return (
                        <TakeatApp key={index}>
                          <div className="py-3">
                            <div className="flex gap-3">
                              <div className="flex items-start flex-col gap-1 w-full max-w-20">
                                <div className="w-[74px] h-[74px] overflow-hidden rounded-lg">
                                  <Image src={item.img} width={120} height={120} alt={`${item.img}`} className="w-[74px] h-[74px] rounded-lg" />
                                </div>
                                {/* <span className="text-takeat-primary-default font-semibold flex items-center justify-center gap-1 w-full"><IconPencilFilled className="fill-takeat-primary-default text-lg" /> Editar</span> */}
                              </div>

                              <div className="flex-initial w-full">
                                <h3 className="font-semibold text-lg">{item.name}</h3>

                                <div className="flex justify-between items-center mt-2 font-semibold">
                                  <AnimatePresence mode="popLayout">
                                    <motion.span
                                      key={item.price * quantity}
                                      initial={{ x: 20, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      exit={{ x: -20, opacity: 0 }}
                                      transition={{ duration: 0.35, ease: "backInOut" }}
                                    >
                                      {formatPrice(item.price * quantity)}
                                    </motion.span>
                                  </AnimatePresence>


                                  <div className="flex items-center gap-1">
                                    <button
                                      className={`w-7 h-7 flex items-center justify-center text-takeat-primary-default rounded-full font-bold text-lg transition-all `}
                                      onClick={() => updateQuantity({ index, newQuantity: -1 })}
                                    >
                                      {quantity === 1 ? <IconTrashFilled className="text-md fill-takeat-primary-default text-[28px]" /> : <RiSubtractLine className="text-md" />}
                                    </button>

                                    <div className="relative rounded-full w-12 h-5 flex items-center justify-center overflow-hidden">
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
                                      className={`w-7 h-7 flex items-center justify-center text-white rounded-full font-bold text-lg`}
                                      onClick={() => updateQuantity({ index, newQuantity: 1 })}
                                    >
                                      <IconAddCircleFilled className="fill-takeat-primary-default w-full h-full" />
                                    </button>
                                  </div>
                                </div>

                                {
                                  item.observation.length > 0 && (
                                    <div className="flex justify-between items-center my-2">
                                      <span className="flex gap-1 text-sm"><IconRoundChat className="fill-takeat-orange-default text-lg" /> {item.observation}</span>
                                    </div>
                                  )
                                }

                                <div className="flex flex-wrap w-full gap-1 my-3">
                                  {
                                    item.complements.map((item, index) => {
                                      return (
                                        <span key={index} className="px-2 bg-takeat-neutral-lighter rounded-full font-medium text-sm">{item.name}</span>
                                      )
                                    })
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </TakeatApp>
                      )
                    }
                    )
                  )
                }
              </div>
            </div>
          )
            : <div className="flex items-center justify-center w-full pt-8"><h2>Carrinho vazio</h2></div>
        }
      </PageWrapper>
      <CarrinhoButtonComponent params={restaurant} onClearBag={clearBag} />
    </InternalPages >
  );
}