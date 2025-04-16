"use client";
import { ICart } from "@/components/addProducts/addProducts.types";
import ContinueComponents from "@/components/continue/continue.components";
import { TakeatApp } from "@/components/theme/ThemeProviderWrapper";
import InformationButton from "@/components/uiComponents/Buttons/informationButton.component";
import InternalPages from "@/components/uiComponents/InternalPageHeader/internal_pages.header";
import { useDelivery } from "@/context/DeliveryContext";
import { Restaurant } from "@/types/restaurant.types";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { formatPrice, IconCardFront, IconLocationFilled, IconMoney, IconPix, IconRoundChat, IconUserFilled } from "takeat-design-system-ui-kit";
import { IPaymentsProps } from "../pagamento/page";
import CashbackDrawer from "./cashback.drawer";

interface Props {
  params: Promise<{ restaurants: string }>;
}

export interface IAddress {
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  reference: string;
  zip_code: string;
  delivery_tax_price: string;
};

export interface IClienteTakeat {
  name: string,
  tel: string
}

export interface IAgendamento {
  day?: number,
  hour?: string,
  method?: string,
  month?: number,
}

export default function ConfirmarPedidoPage({ params }: Props) {
  const restaurant = use(params)?.restaurants;
  const takeatBagKey = `@deliveryTakeat:${restaurant}TakeatBag`;
  const useChange = `@useChange:${restaurant}`;
  const addressClientDeliveryTakeat = `@addressClientDeliveryTakeat:${restaurant}`;
  const addressRestaurant = `@deliveryTakeatRestaurant:${restaurant}`;
  const MethodPaymentTakeat = `@methodPaymentTakeat:${restaurant}`;
  const clienteTakeat = `@clienteTakeat:${restaurant}`;
  const deliveryTakeat = `@deliveryTakeat:${restaurant}`;
  const methodDeliveryTakeat = `@methodDeliveryTakeat:${restaurant}`;
  const [resumeCart, setResumeCart] = useState<ICart[]>();
  const [isClienteTakeat, setIsClienteTakeat] = useState<IClienteTakeat>();
  const [parsedMethodPayment, setParsedMethodPayment] = useState<IPaymentsProps>();
  const [methodDelivery, setMethodDelivery] = useState<IAgendamento>({});
  const [addressDeliveryRestaurant, setAddressDeliveryRestaurant] = useState<Restaurant>()
  const [troco, setTroco] = useState<number>(0)
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [addressDelivery, setAddressDelivery] = useState<IAddress>({
    state: ``,
    city: ``,
    neighborhood: ``,
    street: ``,
    number: ``,
    complement: ``,
    reference: ``,
    zip_code: ``,
    delivery_tax_price: ''
  });

  const { cuponValue } = useDelivery()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const addressDeliveryRestaurant = localStorage.getItem(addressRestaurant);
      const getTakeatBag = localStorage.getItem(takeatBagKey);
      const getTroco = localStorage.getItem(useChange);
      const getAddressDelivery = localStorage.getItem(addressClientDeliveryTakeat);
      const getClienteTakeat = localStorage.getItem(clienteTakeat);
      const getMethodDeliveryTakeat = localStorage.getItem(methodDeliveryTakeat);
      const getMethodPaymentTakeat = localStorage.getItem(MethodPaymentTakeat);

      if (addressDeliveryRestaurant) {
        const parsedGetTakeatBag = JSON.parse(addressDeliveryRestaurant);
        setAddressDeliveryRestaurant(parsedGetTakeatBag);
      }

      if (getTakeatBag) {
        const parsedGetTakeatBag = JSON.parse(getTakeatBag);
        setResumeCart(parsedGetTakeatBag.products);
      }

      if (getTroco) {
        const parsedTroco = JSON.parse(getTroco);
        setTroco(parsedTroco);
      }

      if (getMethodDeliveryTakeat) {
        const parsedGetMethodDeliveryTakeat = JSON.parse(getMethodDeliveryTakeat);
        setMethodDelivery(parsedGetMethodDeliveryTakeat);
      }

      if (getClienteTakeat) {
        const parsedGetClienteTakeat = JSON.parse(getClienteTakeat);
        setIsClienteTakeat(parsedGetClienteTakeat);
      }

      if (getAddressDelivery) {
        const parsedGetAddressDelivery = JSON.parse(getAddressDelivery);
        setAddressDelivery(parsedGetAddressDelivery);
      }

      if (getMethodPaymentTakeat) {
        const parsedGetMethodPaymentTakeat = JSON.parse(getMethodPaymentTakeat);
        setParsedMethodPayment(parsedGetMethodPaymentTakeat);
      }
    }
  }, [
    takeatBagKey,
    addressClientDeliveryTakeat,
    clienteTakeat,
    deliveryTakeat,
    MethodPaymentTakeat,
  ]);

  const TitleMethodPayment = (title: string, url: string) => {
    return (
      <div className="flex pb-3 items-center justify-between">
        <h2 className={`font-semibold text-lg ${title === 'Retirada' && 'text-takeat-primary-default'}`}>{title}</h2>
        <Link
          className="font-semibold text-sm md:text-[16px] text-takeat-primary-default"
          href={`/${restaurant}/${url}`}
          onClick={() => { if (url == 'pagamento') return localStorage.removeItem(`@useChange:${restaurant}`) }}
        >Alterar</Link>
      </div>
    )
  }

  const PaymentInfo = () => {
    if (parsedMethodPayment?.keyword == 'dinheiro') {
      return `Troco para: ${formatPrice(troco || 0)}`
    } else if (parsedMethodPayment?.keyword !== 'credit_card_auto' && parsedMethodPayment?.keyword !== 'pix_auto') {
      return `Pagamento na entrega`
    } else return `Pagamento online`
  }

  return (
    <InternalPages title="Confirmar Pedido" button>
      <div className={`${addressDelivery.delivery_tax_price ? 'pb-64' : 'pb-28'}`}>
        <div className="pt-3">
          {TitleMethodPayment('Resumo do pedido', 'carrinho')}
          <div>
            {
              resumeCart?.map((item, index) => {
                return (
                  <TakeatApp key={index}>
                    <div className="py-3">
                      <div className="flex gap-3 z-0 relative">
                        <div>
                          <div className={`flex items-center justify-center text-sm rounded-lg overflow-hidden bg-takeat-neutral-lightest ${item.use_weight ? 'w-full' : 'w-[28px]'} h-[28px] font-semibold px-2 shadow`}>
                            {
                              item.use_weight ? <span>{item.qtd}kg</span> : <span>{item.qtd}x</span>
                            }
                          </div>
                        </div>

                        <div className="flex-initial w-full">
                          <h3 className="font-semibold text-lg">{item.name}</h3>

                          <div className="flex justify-between items-center   font-semibold">
                            <AnimatePresence mode="popLayout">
                              <motion.span
                                key={item.price * item.qtd}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.35, ease: "backInOut" }}
                              >
                                {formatPrice(item.price * item.qtd)}
                              </motion.span>
                            </AnimatePresence>
                          </div>

                          {
                            item.observation.length > 0 && (
                              <div className="flex justify-between items-center my-2">
                                <span className="flex gap-1 text-sm"><IconRoundChat className="fill-takeat-orange-default text-lg" /> {item.observation}</span>
                              </div>
                            )
                          }
                          <div className="flex flex-wrap w-full gap-1">
                            {
                              item.complements.map((item, index: number) => {
                                return (
                                  <span key={index} className="px-2 bg-takeat-neutral-lighter rounded-full text-xs font-medium">{item.name}</span>
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

        <div className="pt-3 border-t">
          {TitleMethodPayment('Pagamento', 'pagamento')}
          <div className="border-b pb-3 flex flex-col gap-3">
            <div className="flex flex-col">
              <div className="flex gap-2">
                {
                  parsedMethodPayment?.keyword == "pix_auto" ? <IconPix className="text-2xl fill-takeat-green-default" />
                    : parsedMethodPayment?.keyword == "dinheiro" ? <IconMoney className="text-2xl fill-takeat-second_green-default" />
                      : <IconCardFront className="text-2xl fill-takeat-primary-default" />
                }
                <span className="font-semibold uppercase">{parsedMethodPayment?.name}</span>
              </div>
              <span>{PaymentInfo()}</span>
            </div>

            <InformationButton onClick={() => setOpenDrawer(!openDrawer)} title={`${cuponValue.code ? 'Cupom aplicado!' : 'Adicionar desconto'}`} description={cuponValue.code} icon={`${cuponValue.code ? 'Nothing' : 'IconTicketFilled'}`} fill="#7a7a7a" arrow />
          </div>
        </div>

        <div className="pt-3">
          {TitleMethodPayment(`${methodDelivery.method === 'retirarBalcao' ? 'Retirada' : methodDelivery.method === 'delivery' ? 'Delivery' : methodDelivery.method}`, `${methodDelivery.method === 'retirarBalcao' || methodDelivery.method === 'Agendamento Retirada' ? 'entrega' : 'endereco'}`)}
          {methodDelivery.method === 'delivery' || methodDelivery.method === 'Agendamento Delivery' ? (
            <div className="border-b pb-3">
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
            <div className="border-b pb-3">
              <div className="flex items-center gap-2 font-semibold">
                <IconLocationFilled className="text-2xl fill-takeat-neutral-dark" />
                {
                  addressDeliveryRestaurant?.adress && (
                    <div>
                      <div>
                        <span>{`${addressDeliveryRestaurant.adress.street}, ${addressDeliveryRestaurant.adress.number}`}</span>
                      </div>
                      <div className="flex flex-col font-medium text-takeat-neutral-default">
                        <span>{`${addressDeliveryRestaurant.adress.neighborhood}, ${addressDeliveryRestaurant.adress.city} - ${addressDeliveryRestaurant.adress.state}`}</span>
                        <span>{`${addressDeliveryRestaurant.adress.complement}, ${addressDeliveryRestaurant.adress.zip_code}`}</span>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          )}
        </div>

        {!!isClienteTakeat && (
          <div className="pt-3">
            {TitleMethodPayment('Dados', 'informacao')}
            <div className="border-b pb-3">
              <div className="flex items-center gap-2 font-semibold">
                <IconUserFilled className="text-2xl fill-takeat-neutral-dark" />
                <span>{isClienteTakeat?.name}</span>
              </div>
              <div className="flex flex-col font-medium text-takeat-neutral-default">
                <span>{isClienteTakeat?.tel}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <ContinueComponents params={restaurant} route="pedido-realizado" finishOrder textButon="Enviar Pedido" />
      <CashbackDrawer openDrawer={openDrawer} setOpenDrawer={() => setOpenDrawer(!openDrawer)} />
    </InternalPages>
  );
} 