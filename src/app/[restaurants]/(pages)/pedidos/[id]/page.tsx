"use client"
import { statusMap } from "@/components/restaurants/pedidos/statusMap";
import { ProductInternalWrapper } from "@/components/restaurants/product/products.style";
import { TakeatApp } from "@/components/theme/ThemeProviderWrapper";
import InternalPages from "@/components/uiComponents/InternalPageHeader/internal_pages.header";
import { api_token_card } from "@/utils/apis";
import dayjs from "dayjs";
import { AnimatePresence, motion, MotionProps } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice, IconCardFront, IconDeliverySchedule, IconLocationFilled, IconMoney, IconPix, IconRoundChat } from "takeat-design-system-ui-kit";
import { IPedidos } from "../../../../../components/restaurants/pedidos/types";
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

type StatusKey = keyof typeof statusMap;

export default function InfoPedidos() {
  const restaurantParams = useParams<{ restaurants: string, id?: string }>()
  const restaurant = restaurantParams?.restaurants;

  const [pedidos2, setPedidos2] = useState<IProduct2>()
  const [pedidos, setPedidos] = useState<IPedidos>()
  const [addressRestaurant, setAddressRestaurant] = useState<IAddressRestaurantProps>({} as IAddressRestaurantProps)
  const [isLoading, setIsLoading] = useState<boolean>(true)


  useEffect(() => {
    const token = localStorage.getItem(`@tokenUserTakeat:${restaurant}`);
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    api_token_card.get(`/session/${restaurantParams?.id}`, config).then(res => setPedidos2(res.data)).catch(error => console.log(error));

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

  const TitleMethodPayment = ({ title, date, restaurant, url }: { title: string, date?: boolean, restaurant?: string, url?: string }) => {
    return (
      <>
        <div className={`flex items-center justify-between ${!date && 'pb-1'}`}>
          <h2 className="font-semibold text-lg">{title}</h2>
          {!!url && <Link className="font-semibold !text-sm text-takeat-primary-default" href={`/${restaurant}/${url}`}>Editar</Link>}
        </div>
        {!!date && <span className="flex items-center gap-2"><IconDeliverySchedule className="text-2xl" /> {dayjs(pedidos2?.scheduled_to).format('DD/MM/YY - HH:mm[h]')}</span>}
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

  const MotionDiv: React.FC<React.HTMLAttributes<HTMLDivElement> & MotionProps> = motion.div;

  if (isLoading) return null;

  const allStatuses: string[] =
    pedidos2?.bills?.[0]?.order_baskets?.map(item => item.order_status) ?? []

  const currentStatus = allStatuses[0] || 'default';
  const statusInfo = statusMap[(currentStatus as StatusKey)] || statusMap['default'];

  return (
    <div>
      <div className="sticky top-0 bg-white w-full h-full z-50">
        <InternalPages title="" restaurant={restaurant} button help backPage={false} />
      </div>

      <div className="fixed w-full">
        <div className="mb-4 px-6">
          <div>
            <div className="flex items-center gap-2">
              {
                currentStatus !== 'finished' ? (
                  <>
                    <div className="relative flex size-2.5">
                      <div className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75
                        ${['pending'].includes(currentStatus)
                          ? 'bg-takeat-orange-default'
                          : ['accepted', 'ready', 'delivered', 'ongoing'].includes(currentStatus)
                            ? 'bg-takeat-green-default'
                            : 'hidden'
                        }`}
                      />
                      <span className={`relative inline-flex size-2.5 rounded-full ${currentStatus !== 'finished' ? 'animate-pulse' : ''}
                        ${['pending'].includes(currentStatus)
                          ? 'bg-takeat-orange-default'
                          : ['accepted', 'ready', 'delivered', 'ongoing'].includes(currentStatus)
                            ? 'bg-takeat-green-default'
                            : 'hidden'
                        }`}>
                      </span>
                    </div>
                    <p className="font-medium text-gray-800 w-full text-sm truncate">
                      {statusInfo.label}
                    </p>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <p className="font-medium text-gray-800 w-full text-sm truncate">
                      {statusInfo.label}
                    </p>
                  </>
                )
              }
            </div>

            <div>
              <p className="text-takeat-neutral-dark mt-1 w-full text-sm font-medium">
                {statusInfo.description}
              </p>
            </div>

            <div className="my-5">
              {
                currentStatus !== 'canceled' && (
                  <div
                    className={`w-full justify-between gap-1 items-center ${currentStatus !== 'finished' ? 'flex' : 'hidden'
                      }`}
                  >
                    {[0, 1, 2].map((step) => {
                      const status = currentStatus;

                      // Lógica de animação conforme padrão dos tabs
                      let animateStep = [false, false, false];
                      if (status === 'pending') {
                        animateStep = [true, false, false];
                      } else if (["accepted", "ongoing"].includes(status)) {
                        animateStep = [true, true, false];
                      } else if (["delivered", "ready", "finished"].includes(status)) {
                        animateStep = [true, true, true];
                      }

                      const isActive = animateStep[step];
                      const lastActiveIndex = animateStep.lastIndexOf(true);

                      return (
                        <MotionDiv
                          key={step}
                          initial={{ opacity: 0.3, scaleX: 0.9 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          transition={{ duration: 0.4, delay: step * 0.1 }}
                          className={`h-2 w-1/3 rounded-full relative overflow-hidden mx-${step === 1 ? '1' : '0'} ${isActive ? 'bg-takeat-primary-light' : 'bg-gray-200'}`}
                        >
                          {isActive && step === lastActiveIndex && (
                            <MotionDiv
                              className='absolute inset-0 bg-gradient-to-r from-transparent via-takeat-red-lightest to-transparent opacity-80 scale-y-150'
                              initial={{ x: '-100%' }}
                              animate={{ x: '100%' }}
                              transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                            />
                          )}
                        </MotionDiv>
                      );
                    })}
                  </div>
                )
              }
            </div>

          </div>
        </div>

        <div className="px-6 flex justify-center items-center w-full">
          <Image alt="statusImage" src={`/assets/pedidos/${statusInfo.image}`} width={260} height={260} />
        </div>
      </div>

      <div className="sticky top-20">
        <ProductInternalWrapper className="shadow-[0_-5px_10px_rgba(0,0,0,0.1)] w-full">
          <div className="flex items-center justify-between w-full my-3">
            <h2 className="font-semibold text-md">Detalhes do Pedido</h2>
            <h2 className="font-semibold text-md">Senha {pedidos?.bills[0].order_baskets[0].basket_id}</h2>
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
                    <span className="font-semibold">{formatPrice(`${pedidos2?.total_delivery_price || 0}`)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between w-full border-t">
            <div className="pt-3 w-full">
              {TitleMethodPayment({ title: deliveryType, date: !!pedidos2?.scheduled_to })}
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
        </ProductInternalWrapper>
      </div>
    </div >
  )
}