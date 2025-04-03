"use client";
import { ICart } from "@/components/addProducts/addProducts.types";
import ContinueComponents from "@/components/continue/continue.components";
import { TakeatApp } from "@/components/theme/ThemeProviderWrapper";
import InformationButton from "@/components/uiComponents/Buttons/informationButton.component";
import InternalPages from "@/components/uiComponents/InternalPageHeader/internal_pages.header";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { formatPrice, IconCardFront, IconLocationFilled, IconMoney, IconPix, IconRoundChat, IconUserFilled } from "takeat-design-system-ui-kit";
import { IPaymentsProps } from "../pagamento/page";

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

export default function ConfirmarPedidoPage({ params }: Props) {
  const restaurant = use(params)?.restaurants;
  const takeatBagKey = `@deliveryTakeat:${restaurant}TakeatBag`;
  const addressClientDeliveryTakeat = `@addressClientDeliveryTakeat:${restaurant}`;
  const MethodPaymentTakeat = `@methodPaymentTakeat:${restaurant}`;
  const clienteTakeat = `@clienteTakeat:${restaurant}`;
  const deliveryTakeat = `@deliveryTakeat:${restaurant}`;
  const methodDeliveryTakeat = `@methodDeliveryTakeat:${restaurant}`;
  const [resumeCart, setResumeCart] = useState<ICart[]>();
  const [isClienteTakeat, setIsClienteTakeat] = useState<IClienteTakeat>();
  const [parsedMethodPayment, setParsedMethodPayment] = useState<IPaymentsProps>();
  const [methodDelivery, setMethodDelivery] = useState<string>();
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getTakeatBag = localStorage.getItem(takeatBagKey);
      const getAddressDelivery = localStorage.getItem(addressClientDeliveryTakeat);
      const getClienteTakeat = localStorage.getItem(clienteTakeat);
      const getMethodDeliveryTakeat = localStorage.getItem(methodDeliveryTakeat);
      const getMethodPaymentTakeat = localStorage.getItem(MethodPaymentTakeat);

      if (getTakeatBag) {
        const parsedGetTakeatBag = JSON.parse(getTakeatBag);
        setResumeCart(parsedGetTakeatBag.products);
      }

      if (getMethodDeliveryTakeat) {
        setMethodDelivery(getMethodDeliveryTakeat);
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
        <h2 className="font-semibold text-lg">{title}</h2>
        <Link className="font-semibold text-lg text-takeat-primary-default" href={`/${restaurant}/${url}`}>Alterar</Link>
      </div>
    )
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
                          <div className="flex items-center justify-center text-sm rounded-lg overflow-hidden bg-takeat-neutral-lightest w-[28px] h-[28px] font-semibold p-4">
                            <span>{item.qtd}x</span>
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
              <span>{parsedMethodPayment?.method_online == true ? 'Pagamento Online' : 'Pagamento na entrega'}</span>
            </div>
            <InformationButton onClick={() => alert('Adicionar desconto')} title="Adicionar desconto" icon="IconTicketFilled" fill="#7a7a7a" arrow />
          </div>
        </div>

        <div className="pt-3">
          {TitleMethodPayment('Delivery', 'entrega')}
          {methodDelivery === 'delivery' ? (
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
                <span>
                  {`${methodDelivery == 'retirarBalcao' ? 'Retirar no balcão' : methodDelivery == 'agendamentoDelivery' ? 'Agendamento de entrega' : methodDelivery == 'agendamentoRetirada' ? 'Agendamento de retirada' : 'Delivery'}`}
                </span>
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
    </InternalPages>
  );
} 