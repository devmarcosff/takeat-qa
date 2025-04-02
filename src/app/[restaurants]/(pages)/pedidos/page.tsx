"use client"
import MenuComponent from "@/components/menu/menu.component";
import { TakeatPage } from "@/components/theme/ThemeProviderWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InternalPages from "@/components/uiComponents/InternalPageHeader/internal_pages.header";
import { api_create_order } from "@/utils/apis";
import dayjs from "dayjs";
import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight } from "lucide-react";
import { use, useEffect, useState } from "react";
import { formatPrice } from "takeat-design-system-ui-kit";

interface Props {
  params: Promise<{ restaurants: string, id?: string }>;
}

type Basket = NonNullable<IBills["order_baskets"]>[number];

export default function PedidoConfirmadoPage({ params }: Props) {
  const restaurant = use(params)?.restaurants;
  const tokenClient = `@tokenUserTakeat:${restaurant}`;
  const [activeTab, setActiveTab] = useState("andamentos");
  const [resumeCart, setResumeCart] = useState<IRequested[]>([]);
  const token = localStorage.getItem(tokenClient);
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const filterByTab = (basket: Basket, tab: string) => {
    if (!basket) return false;
    const { order_status, scheduled_to } = basket;
    if (scheduled_to) return tab === 'agendados';
    if (tab === 'andamentos') return ['pending', 'accepted', 'ready', 'delivered'].includes(order_status ?? '');
    if (tab === 'finalizados') return ['finished', 'canceled'].includes(order_status ?? '');
    return false;
  };


  useEffect(() => {
    api_create_order.get('/sessions', config).then(res => {
      setResumeCart(res.data);
    }).catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <InternalPages title="Pedidos">
        <div className="mt-3">
          <Tabs defaultValue="andamentos" value={activeTab} onValueChange={setActiveTab} className="relative w-full bg-transparent h-[410px]">
            <TabsList className="w-full bg-transparent flex relative">
              <TabsTrigger value="andamentos" className="w-full flex justify-center py-2 relative data-[state=active]:shadow-none">Em andamento</TabsTrigger>
              <TabsTrigger value="agendados" className="w-full flex justify-center py-2 relative data-[state=active]:shadow-none">Agendados</TabsTrigger>
              <TabsTrigger value="finalizados" className="w-full flex justify-center py-2 relative data-[state=active]:shadow-none">Finalizados</TabsTrigger>

              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                  position: "absolute",
                  bottom: 0,
                  height: "2px",
                  background: "#c8131b",
                  width: "33%",
                  left: activeTab === "andamentos" ? "0%" : activeTab === "agendados" ? "33%" : '66%',
                }}
              />
            </TabsList>
            {['andamentos', 'agendados', 'finalizados'].map(tab => {
              const filteredBaskets = resumeCart.flatMap((e) =>
                e.bills.flatMap((req) =>
                  req.order_baskets?.filter((basket) => filterByTab(basket, tab)).map((basket) => ({
                    basket,
                    userChange: e.user_change
                  })) || []
                )
              );

              return (
                <TabsContent key={tab} value={tab} className="pb-32">
                  {filteredBaskets.length > 0 ? (
                    filteredBaskets.map(({ basket, userChange }) => (
                      <YourCardComponent key={basket.id} basket={basket} userChange={userChange} />
                    ))
                  ) : (
                    <div className="w-full py-12 text-center text-sm text-gray-500">
                      NENHUM PEDIDO ENCONTRADO ATÉ O MOMENTO.
                    </div>
                  )}
                </TabsContent>
              )
            }
            )}
          </Tabs>
        </div>
      </InternalPages>

      <TakeatPage>
        <MenuComponent params={restaurant} />
      </TakeatPage>
    </div>
  );
}

type OrderBasketItem = NonNullable<IBills["order_baskets"]>[number];

const YourCardComponent = ({ basket, userChange }: { basket: OrderBasketItem, userChange?: string }) => {
  const statusMap = {
    canceled: 'Pedido cancelado',
    pending: 'Aguardando o restaurante aceitar',
    accepted: 'Pedido em preparo',
    ready: 'Pedido pronto',
    delivered: 'Pedido está a caminho',
    finished: 'Pedido finalizado',
  };

  let paymentMethod = 'Cartão de crédito';
  if (basket.pix_payments?.length) {
    paymentMethod = 'PIX';
  } else if (userChange && parseFloat(userChange) > 0) {
    paymentMethod = `Dinheiro (troco R$ ${parseFloat(userChange).toFixed(2).replace('.', ',')})`;
  }

  const formattedTime = basket.start_time ? dayjs(basket.start_time).format('HH[h]mm') : '--:--';
  const formattedTimeFinished = basket.start_time ? dayjs(basket.start_time).format('DD/MM/YY - HH[h]mm') : '--:--';

  return (
    <div className="max-w-md rounded-2xl bg-white shadow-md overflow-hidden cursor-pointer my-4 border">
      <div className="flex justify-between items-center w-full bg-takeat-neutral-lighter p-3">
        <h2 className="font-bold text-gray-800">{basket.with_withdrawal ? 'Retirada' : 'Entrega'}</h2>
        <p className="text-sm text-gray-800 font-semibold">Senha {basket.basket_id}</p>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${basket.order_status !== 'finished' ? 'animate-pulse' : ''
                } ${['pending', 'canceled'].includes(basket.order_status ?? '')
                  ? 'bg-takeat-red-default'
                  : ['accepted', 'ready', 'delivered'].includes(basket.order_status ?? '')
                    ? 'bg-takeat-yellow-default'
                    : basket.order_status === 'finished'
                      ? 'hidden'
                      : ''
                }`}
            />

            <CheckCircle className={`w-6 h-6 text-green-500 ${basket.order_status !== 'finished' ? 'hidden' : 'flex'}`} />

            <div className="flex items-center justify-between w-full">
              <p className="font-medium text-gray-800 w-full text-sm truncate">
                {statusMap[basket.order_status as keyof typeof statusMap] || 'Status desconhecido'}
              </p>
              <p className="text-gray-600 mt-1 w-full text-sm text-end">{basket.order_status !== 'finished' ? `Feito às ${formattedTime}` : formattedTimeFinished}
              </p>
            </div>
          </div>
        </div>

        <div className={`w-full justify-between gap-1 items-center ${basket.order_status !== 'finished' ? 'flex' : 'hidden'}`}>
          {[0, 1, 2].map((step) => {
            const status = basket.order_status;

            const isActive =
              (step === 0 && ['accepted', 'ready', 'finished', 'delivered'].includes(status || '')) ||
              (step === 1 && ['ready', 'finished', 'delivered'].includes(status || '')) ||
              (step === 2 && ['finished', 'delivered'].includes(status || ''));

            const shouldAnimate =
              (status === 'accepted' && step === 0) ||
              (status === 'ready' && step === 1) ||
              (status === 'delivered' && step === 2);

            const solidBg =
              (status === 'accepted' && step < 1) ||
              (status === 'ready' && step < 1) ||
              (status === 'delivered' && step < 2) ||
              (status === 'finished' && step <= 2);

            const isCanceledOrPending = ['pending', 'canceled'].includes(status || '');

            const getMotionBg = () => {
              if (isCanceledOrPending) return 'bg-gray-200';
              if (solidBg) return 'bg-takeat-primary-default';
              if (isActive) return 'bg-gradient-to-r from-takeat-primary-default to-transparent';
              return 'bg-gray-200';
            };

            return (
              <motion.div
                key={step}
                initial={{ opacity: 0.3, scaleX: 0.9 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.4, delay: step * 0.1 }}
                {...{ className: `h-2 w-1/3 rounded-full relative overflow-hidden mx-${step === 1 ? '1' : '0'} ${getMotionBg()}` }}
              >
                {shouldAnimate && basket.order_status !== 'finished' && (
                  <motion.div
                    {... { className: "absolute inset-0 bg-gradient-to-r from-transparent via-takeat-primary-default to-transparent" }}
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {basket.order_status === 'finished' && (
          <div className="mt-4 border-t pt-3">

            <div className="flex justify-between items-end">
              <div className="flex flex-col justify-between mt-1 gap-2">
                {
                  basket.orders?.map((order: IOrders) => (
                    <div key={order.id} className="text-gray-600 text-md flex items-center justify-start gap-3">
                      <span className="bg-takeat-neutral-lightest font-semibold text-sm py-1 px-2 rounded-lg flex items-center justify-center">{order.amount}x</span>
                      <h2 className="font-semibold">{order.product?.name}</h2>
                    </div>
                  ))
                }
              </div>
              <ChevronRight className="text-gray-400 h-6 w-6" />
            </div>
          </div>
        )}
        {basket.order_status !== 'finished' && (
          <div className="mt-4 border-t pt-3">
            <p className="text-gray-600 text-md">Pagamento</p>
            <div className="flex justify-between items-center mt-1">
              <div>
                <p className="font-medium text-gray-800">{paymentMethod}</p>
                <div className="flex items-center mt-2">
                  <p className="font-semibold text-gray-800">{formatPrice(`${basket.total_price}`)}</p>
                  <span className="text-gray-500 ml-2">/ {basket.orders?.length ?? 0} {basket.orders.length > 1 ? 'itens' : 'item'}</span>
                </div>
              </div>
              <ChevronRight className="text-gray-400 h-6 w-6" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

interface IRequested {
  id?: number;
  status?: string;
  key?: string;
  total_price?: string;
  start_time?: string;
  scheduled_to?: string | null;
  user_change?: string;
  bills: IBills[];
}

interface IBills {
  id?: number;
  order_baskets?: {
    id?: number;
    order_status?: string;
    basket_id?: string;
    total_price?: string;
    start_time?: string;
    scheduled_to?: string | null;
    fantasy_name?: string;
    with_withdrawal?: string;
    pix_payments?: string[];
    orders: {
      id?: number;
      amount?: number;
      price?: string;
      total_price?: string;
      product?: {
        id?: number;
        name?: string;
      };
    }[];
  }[];
}


interface IOrders {
  id?: number;
  amount?: number;
  price?: string;
  total_price?: string;
  product?: {
    id?: number;
    name?: string;
  };
}