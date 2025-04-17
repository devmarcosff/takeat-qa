"use client"
import { ProductInternalWrapper } from "@/components/restaurants/product/products.style";
import { TakeatApp } from "@/components/theme/ThemeProviderWrapper";
import { api_token_card } from "@/utils/apis";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice, IconCardFront, IconDeliverySchedule, IconLocationFilled, IconMoney, IconPix, IconRoundChat } from "takeat-design-system-ui-kit";
import { IPedidos } from "../types";
import { IProduct2 } from "./types";

export interface IAddressRestaurantProps {
  id: number;
  street: string;
  number: number;
  complement: string;
  state: string;
  city: string;
  zip_code: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  inscricao_estadual: string;
  createdAt: string;
  updatedAt: string;
}

export default function InfoPedidos() {
  const restaurantParams = useParams<{ restaurants: string, id?: string }>()
  const restaurant = restaurantParams.restaurants;

  const [pedidos2, setPedidos2] = useState<IProduct2>()
  const [pedidos, setPedidos] = useState<IPedidos>()
  const [addressRestaurant, setAddressRestaurant] = useState<IAddressRestaurantProps>({} as IAddressRestaurantProps)
  const [isLoading, setIsLoading] = useState<boolean>(true)


  useEffect(() => {
    const token = localStorage.getItem(`@tokenUserTakeat:${restaurant}`);
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    api_token_card.get(`/session/${restaurantParams.id}`, config).then(res => setPedidos2(res.data)).catch(error => console.log(error));

    const addressRestaurant = localStorage.getItem(`@deliveryTakeatRestaurant:${restaurant}`);
    const parsedAddressRestaurant = JSON.parse(addressRestaurant || '');
    setAddressRestaurant(parsedAddressRestaurant.adress);

    const getPedidos = localStorage.getItem(`@infoPedidosTakeat:${restaurant}`)
    const parsePedidos = JSON.parse(getPedidos || '[]')

    setPedidos(parsePedidos)
    setIsLoading(false);
  }, []);

  const paymentInfo = () => {
    if (!!pedidos?.pix_payments.map(item => item.id).length) {
      return `Pagamento online`
    } else if (Number(pedidos?.user_change) > 0) {
      return `Troco para: ${formatPrice(pedidos?.user_change || 0)}`
    } else if (pedidos?.with_withdrawal == true) {
      return `Pagamento na retirada`
    } else {
      return `Pagamento na entrega`
    }
  }

  const TitleMethodPayment = ({ title, date, restaurant, url }: { title: string, date?: string, restaurant?: string, url?: string }) => {
    return (
      <>
        <div className={`flex items-center justify-between ${!date && 'pb-3'}`}>
          <h2 className="font-semibold text-lg">{title}</h2>
          {!!url && <Link className="font-semibold !text-sm text-takeat-primary-default" href={`/${restaurant}/${url}`}>Alterar</Link>}
        </div>
        {!!date && <span className="flex items-center gap-2"><IconDeliverySchedule className="text-2xl" /> {date}</span>}
      </>
    )
  }

  let deliveryType = "";

  if (pedidos2?.scheduled_to && pedidos2?.with_withdrawal) {
    deliveryType = "Retirada agendada";
  } else if (pedidos2?.scheduled_to && pedidos2?.with_withdrawal == false) {
    deliveryType = "Entrega agendada";
  } else if (pedidos2?.with_withdrawal) {
    deliveryType = "Retirada";
  } else {
    deliveryType = "Entrega";
  }

  if (isLoading) return;
  console.log(pedidos2)
  return (
    <div>
      <ProductInternalWrapper className="shadow-[0_-5px_10px_rgba(0,0,0,0.1)] w-full">

        <div className="flex items-center justify-between w-full my-3">
          <h2 className="font-semibold text-md">Detalhes do Pedido</h2>
          <h2 className="font-semibold text-md">Senha {pedidos2?.attendance_password}</h2>
        </div>

        <div className="flex items-center justify-between w-full border-t">
          <div>
            {
              pedidos2?.bills[0].order_baskets[0].orders.map((item, index) => {
                return (
                  <TakeatApp key={index}>
                    <div className="py-3">
                      <div className="flex gap-3 z-0 relative">
                        <div>
                          <div className="flex items-center justify-center text-sm rounded-lg overflow-hidden text-takeat-neutral-default bg-takeat-neutral-lightest w-[28px] h-[28px] font-semibold p-4">
                            <span>{item.amount}x</span>
                          </div>
                        </div>

                        <div className="flex-initial w-full">
                          <h3 className="font-semibold text-sm">{item.product.name}</h3>

                          <div className="flex justify-between items-center font-semibold">
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
                          {
                            item.details && (
                              <div className="flex justify-between items-center my-2">
                                <span className="flex gap-1 text-sm"><IconRoundChat className="fill-takeat-orange-default text-lg" /> {item.details}</span>
                              </div>
                            )
                          }
                          <div className="flex flex-wrap w-full gap-1">
                            {
                              item.complement_categories.map((item, index: number) => {
                                return (
                                  <div key={index} className="px-2 bg-takeat-neutral-lighter text-takeat-neutral-darker rounded-full ">
                                    <span className="text-xs font-medium">{item.complement_category.name}</span>
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

        <div className="flex items-center justify-between w-full border-t">
          <div className="pt-3 w-full">
            {TitleMethodPayment({ title: 'Pagamento' })}
            <div className="pb-3 flex flex-col gap-3">
              <div className="flex flex-col">
                <div className="flex gap-2">
                  {
                    pedidos2?.payment_method.keyword == "pix_auto" ? <IconPix className="text-2xl fill-takeat-green-default" />
                      : pedidos2?.payment_method.keyword == "dinheiro" ? <IconMoney className="text-2xl fill-takeat-second_green-default" />
                        : <IconCardFront className="text-2xl fill-takeat-primary-default" />
                  }
                  <span className="font-semibold uppercase">{pedidos2?.payment_method.name}</span>
                </div>
                <span>{paymentInfo()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full border-t">
          <div className="pt-3 w-full">
            <div className="pb-3 flex items-center justify-between gap-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-2 justify-between items-start">
                  <span className="text-sm">Pedido feito em</span>
                  <span className="font-semibold">{dayjs(pedidos2?.start_time).format('DD/MM/YY - HH:mm')}</span>
                </div>
                <div className="flex flex-col gap-2 justify-between items-end">
                  <span className="text-sm">Total</span>
                  <span className="font-semibold">{pedidos2?.total_delivery_price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full border-t">
          <div className="pt-3 w-full">
            {TitleMethodPayment({ title: deliveryType, date: dayjs(pedidos2?.scheduled_to).format('DD/MM/YY - HH:mm[h]') })}
            {pedidos2?.buyer_delivery_address_id ? (
              <div className="pb-3">
                {pedidos2?.buyer_address && (
                  <>
                    <div className="flex items-center gap-2 font-semibold">
                      <IconLocationFilled className="text-2xl fill-takeat-neutral-black" />
                      <span>{`${pedidos2?.buyer_address.street}, ${pedidos2?.buyer_address.number}`}</span>
                    </div>
                    <div className="flex flex-col text-takeat-neutral-default">
                      <span>{pedidos2?.buyer_address.neighborhood}, {pedidos2?.buyer_address.city} - {pedidos2?.buyer_address.state}</span>
                      <span>{pedidos2?.buyer_address.complement} {pedidos2?.buyer_address.reference && `, ${pedidos2?.buyer_address.reference}`}</span>
                      <span>{pedidos2.buyer_address.zip_code}</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="pb-3">
                {addressRestaurant && (
                  <>
                    <div className="flex items-center gap-2 font-semibold">
                      <IconLocationFilled className="text-2xl fill-takeat-neutral-dark" />
                      <span>{`${addressRestaurant.street}, ${addressRestaurant.number}`}</span>
                    </div>
                    <div className="flex flex-col font-medium text-takeat-neutral-default">
                      <span>{addressRestaurant.neighborhood}, {addressRestaurant.city} - {addressRestaurant.state}</span>
                      <span>{addressRestaurant.complement && `Complemento: ${addressRestaurant.complement}`}</span>
                      <span>{addressRestaurant.zip_code}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </ProductInternalWrapper >
    </div >
  )
}
