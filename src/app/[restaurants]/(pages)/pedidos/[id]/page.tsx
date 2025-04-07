"use client"
import { ICart } from "@/components/addProducts/addProducts.types";
import MenuComponent from "@/components/menu/menu.component";
import { ProductInternalWrapper } from "@/components/restaurants/product/products.style";
import { TakeatApp, TakeatPage } from "@/components/theme/ThemeProviderWrapper";
import PageWrapper from "@/hook/pageWrapper";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { formatPrice, IconCardFront, IconChevronLeft, IconLocationFilled, IconMoney, IconPix, IconRoundChat } from "takeat-design-system-ui-kit";
import { IAddress } from "../../confirmar-pedido/page";
import { IPaymentsProps } from "../../pagamento/page";

interface Props {
  params: Promise<{ restaurants: string, id?: string }>;
}

export default function PedidoConfirmadoPage({ params }: Props) {
  const restaurant = use(params)?.restaurants;
  // const pageId = use(params)?.id;
  // const takeatBagKey = `@deliveryTakeat:${restaurant}TakeatBag`;
  // const tokenClient = `@tokenUserTakeat:${restaurant}`
  const addressClientDeliveryTakeat = `@addressClientDeliveryTakeat:${restaurant}`;
  const MethodPaymentTakeat = `@methodPaymentTakeat:${restaurant}`;
  // const clienteTakeat = `@clienteTakeat:${restaurant}`;
  // const deliveryTakeat = `@deliveryTakeat:${restaurant}`;
  const methodDeliveryTakeat = `@methodDeliveryTakeat:${restaurant}`;
  const [showStickyHeader, setShowStickyHeader] = useState(false);
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
  const [resumeCart] = useState<ICart[]>([])

  useEffect(() => {
    // if (typeof window !== "undefined") {
    const getAddressDelivery = localStorage.getItem(addressClientDeliveryTakeat);
    const getMethodDeliveryTakeat = localStorage.getItem(methodDeliveryTakeat);
    const getMethodPaymentTakeat = localStorage.getItem(MethodPaymentTakeat);

    if (getMethodDeliveryTakeat) {
      setMethodDelivery(getMethodDeliveryTakeat);
    }

    if (getAddressDelivery) {
      const parsedGetAddressDelivery = JSON.parse(getAddressDelivery);
      setAddressDelivery(parsedGetAddressDelivery);
    }

    if (getMethodPaymentTakeat) {
      const parsedGetMethodPaymentTakeat = JSON.parse(getMethodPaymentTakeat);
      setParsedMethodPayment(parsedGetMethodPaymentTakeat);
    }
    // }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 250;
      setShowStickyHeader(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const TitleMethodPayment = (title: string, restaurant: string, url: string) => {
    return (
      <div className="flex pb-3 items-center justify-between">
        <h2 className="font-semibold text-lg">{title}</h2>
        <Link className="font-semibold text-lg text-takeat-primary-default" href={`/${restaurant}/${url}`}>Alterar</Link>
      </div>
    )
  }

  return (
    <div className="pb-10">
      <PageWrapper>
        {showStickyHeader ? (
          <div
            className={`sticky top-0 z-30 bg-white shadow px-4 py-3 flex items-center gap-3 transition-all duration-300 ${showStickyHeader ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <Link href={'/'} className="flex items-center justify-center bg-white rounded-lg p-2">
              <IconChevronLeft />
            </Link>
            <h2 className="text-base font-semibold truncate">Pedidos</h2>
          </div>
        ) : (
          <div>

            <div className="fixed top-6 left-0 z-20 flex justify-between px-4 items-center w-full">
              <Link href={`/${restaurant}/pedidos`}><IconChevronLeft className="text-3xl" /></Link>

              <Link href={`#`} className="bg-takeat-primary-default text-white px-4 py-2 rounded-lg border-none font-semibold">Ajuda</Link>
            </div>

            <div className="fixed top-0 left-0 w-full h-[300px] z-1">
              <div>
                Imagem
              </div>
            </div>

          </div>
        )}
      </PageWrapper >

      <ProductInternalWrapper className="shadow-[0_-5px_10px_rgba(0,0,0,0.1)] w-full">

        <div className="flex items-center justify-between w-full my-3">
          <h2 className="font-semibold text-md">Detalhes do Pedido</h2>
          <h2 className="font-semibold text-md">Senha 483</h2>
        </div>

        <div className="flex items-center justify-between w-full border-t">
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
                          <h3 className="font-semibold text-sm">{item.name}</h3>

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

        <div className="flex items-center justify-between w-full">
          <div className="pt-3 border-t w-full">
            {TitleMethodPayment('Pagamento', restaurant, 'pagamento')}
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
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="pt-3 border-t w-full">
            {/* {TitleMethodPayment('Pagamento', restaurant, 'pagamento')} */}
            <div className="border-b pb-3 flex items-center justify-between gap-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-2 justify-between items-start">
                  <span className="text-sm">Pedido feito em</span>
                  <span className="font-semibold">12/02/25 - 18:49</span>
                </div>
                <div className="flex flex-col gap-2 justify-between items-end">
                  <span className="text-sm">Total</span>
                  <span className="font-semibold">R$ 42,00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full">
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
        </div>
      </ProductInternalWrapper>

      <TakeatPage>
        <MenuComponent params={restaurant} />
      </TakeatPage>
    </div >
  )
}
