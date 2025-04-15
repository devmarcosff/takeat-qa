"use client"
import { ProductInternalWrapper } from "@/components/restaurants/product/products.style";
import { TakeatApp } from "@/components/theme/ThemeProviderWrapper";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { formatPrice, IconPix } from "takeat-design-system-ui-kit";
import { IInfoPedidos } from "./types";

interface Props {
  params: Promise<{ restaurants: string, id?: string }>;
}

export default function InfoPedidos({ params }: Props) {
  const restaurant = use(params)?.restaurants;
  // const methodDeliveryTakeat = `@methodDeliveryTakeat:${restaurant}`;
  // const addressClientDeliveryTakeat = `@addressClientDeliveryTakeat:${restaurant}`;
  const [pedidos, setPedidos] = useState<IInfoPedidos>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  // const [methodDelivery, setMethodDelivery] = useState<string>();
  // const [addressDelivery, setAddressDelivery] = useState<IAddress>({
  //   state: ``,
  //   city: ``,
  //   neighborhood: ``,
  //   street: ``,
  //   number: ``,
  //   complement: ``,
  //   reference: ``,
  //   zip_code: ``,
  //   delivery_tax_price: ''
  // });

  useEffect(() => {
    // const getAddressDelivery = localStorage.getItem(addressClientDeliveryTakeat);
    // if (getAddressDelivery) {
    //   const parsedGetAddressDelivery = JSON.parse(getAddressDelivery);
    //   setAddressDelivery(parsedGetAddressDelivery);
    // }

    const getPedidos = localStorage.getItem(`@infoPedidosTakeat:${restaurant}`)
    const parsePedidos = JSON.parse(getPedidos || '[]')

    setPedidos(parsePedidos)
    setIsLoading(false);
  }, []);

  const TitleMethodPayment = (title: string, restaurant: string, url: string) => {
    return (
      <div className="flex pb-3 items-center justify-between">
        <h2 className="font-semibold text-lg">{title}</h2>
        <Link className="font-semibold !text-sm text-takeat-primary-default" href={`/${restaurant}/${url}`}>Alterar</Link>
      </div>
    )
  }

  if (isLoading) return;

  return (
    <div>
      <ProductInternalWrapper className="shadow-[0_-5px_10px_rgba(0,0,0,0.1)] w-full">

        <div className="flex items-center justify-between w-full my-3">
          <h2 className="font-semibold text-md">Detalhes do Pedido</h2>
          <h2 className="font-semibold text-md">Senha {pedidos?.basket_id}</h2>
        </div>

        <div className="flex items-center justify-between w-full border-t">
          <div>
            {
              pedidos?.orders?.map((item, index) => {
                return (
                  <TakeatApp key={index}>
                    <div className="py-3">
                      <div className="flex gap-3 z-0 relative">
                        <div>
                          <div className="flex items-center justify-center text-sm rounded-lg overflow-hidden bg-takeat-neutral-lightest w-[28px] h-[28px] font-semibold p-4">
                            <span>{item.amount}x</span>
                          </div>
                        </div>

                        <div className="flex-initial w-full">
                          <h3 className="font-semibold text-sm">{item.product.name}</h3>

                          <div className="flex justify-between items-center   font-semibold">
                            <AnimatePresence mode="popLayout">
                              <motion.span
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.35, ease: "backInOut" }}
                              >
                                {formatPrice(item.total_price)}
                              </motion.span>
                            </AnimatePresence>
                          </div>
                          <div className="flex flex-wrap w-full gap-1">
                            {
                              item.complement_categories.map((item, index: number) => {
                                return (
                                  <div key={index}>
                                    <span className="px-2 bg-takeat-neutral-lighter rounded-full text-xs font-medium">{item.complement_category.name}</span>
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </TakeatApp>
                )
              })
            }
          </div>
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="pt-3 border-t w-full">
            {TitleMethodPayment('Pagamento', restaurant, 'pagamento')}
            <div className="border-b pb-3 flex flex-col gap-3">
              <div className="flex flex-col">
                <div className="flex gap-2">
                  <IconPix className="text-2xl fill-takeat-green-default" />
                  <span className="font-semibold uppercase">{'parsedMethodPayment?.name'}</span>
                </div>
                <span>Pagamento Online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="pt-3 border-t w-full">
            {TitleMethodPayment('Pagamento', restaurant, 'pagamento')}
            <div className="border-b pb-3 flex items-center justify-between gap-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-2 justify-between items-start">
                  <span className="text-sm">Pedido feito em</span>
                  <span className="font-semibold">{dayjs(pedidos?.start_time).format('DD/MM/YY - HH:mm')}</span>
                </div>
                <div className="flex flex-col gap-2 justify-between items-end">
                  <span className="text-sm">Total</span>
                  <span className="font-semibold">{pedidos?.total_price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="flex items-center justify-between w-full">
          <div className="pt-3 w-full">
            {TitleMethodPayment('Delivery', restaurant, 'entrega')}
            {methodDelivery === 'delivery' ? (
              <div className="pb-3">
                {!!addressDelivery.city && (
                  <div className="flex items-center gap-2 font-semibold">
                    <IconLocationFilled className="text-2xl fill-takeat-neutral-dark" />
                    <span>{`${addressDelivery?.street}, ${addressDelivery?.number}`}</span>
                  </div>
                )}
                <div className="flex flex-col font-medium text-takeat-neutral-default">
                  <span>{`${addressDelivery?.neighborhood || 'Nenhuma informação adicionada'} ${addressDelivery?.city && `, ${addressDelivery?.city || 'Não informado'} -`} ${addressDelivery?.state}`}</span>
                  <span>{`${addressDelivery?.complement}${addressDelivery?.reference && `, ${addressDelivery?.reference}`}`}</span>
                  <span>{addressDelivery?.zip_code}</span>
                </div>
              </div>
            ) : (
              <div className="pb-3">
                <div className="flex items-center gap-2 font-semibold">
                  <IconLocationFilled className="text-2xl fill-takeat-neutral-dark" />
                  <span>
                    {`${methodDelivery == 'retirarBalcao' ? 'Retirar no balcão' : methodDelivery == 'agendamentoDelivery' ? 'Agendamento de entrega' : methodDelivery == 'agendamentoRetirada' ? 'Agendamento de retirada' : 'Delivery'}`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div> */}
      </ProductInternalWrapper>
    </div>
  )
}
