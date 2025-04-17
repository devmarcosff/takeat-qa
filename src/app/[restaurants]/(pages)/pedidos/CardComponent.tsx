'use client';

import dayjs from 'dayjs';
import { motion, MotionProps } from 'framer-motion';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from 'takeat-design-system-ui-kit';
import { IPedidos, OrderBasket, PixPayment } from './types';

interface Props {
  pedido: IPedidos;
  basket: OrderBasket;
  restaurant: string;
  userChange?: string;
  pixPayments?: PixPayment[];
}

export const CardComponent = ({ basket, pedido, restaurant, userChange, pixPayments }: Props) => {
  const { push } = useRouter();

  const statusMap = {
    canceled: 'Pedido cancelado',
    canceled_waiting_payment: 'Tempo de espera excedido',
    pending: 'Aguardando confirmação da loja',
    accepted: 'Pedido em preparo',
    ready: 'Pedido pronto',
    delivered: 'Pedido está a caminho',
    finished: 'Pedido finalizado',
  };

  const paymentMethod = pixPayments?.length
    ? 'PIX'
    : userChange && parseFloat(userChange) > 0
      ? `Dinheiro (troco R$ ${parseFloat(userChange).toFixed(2).replace('.', ',')})`
      : 'Cartão de crédito';

  const formattedTime = basket.start_time ? dayjs(basket.start_time).format('HH[h]mm') : '--:--';
  const formattedTimeFinished = basket.start_time ? dayjs(basket.start_time).format('DD/MM/YY - HH[h]mm') : '--:--';

  const MotionDiv: React.FC<React.HTMLAttributes<HTMLDivElement> & MotionProps> = motion.div;

  return (
    <div
      className="max-w-3xl rounded-2xl bg-white shadow-md overflow-hidden cursor-pointer my-4 border"
      onClick={() => push(`/${restaurant}/pedidos/${pedido.id}`)}
    >
      <div className="flex justify-between items-center w-full bg-takeat-neutral-lighter p-3">
        <h2 className="font-bold text-gray-800">
          {basket.with_withdrawal ? 'Retirada' : 'Entrega'}
        </h2>
        <p className="text-sm text-gray-800 font-semibold">Senha {basket.basket_id}</p>
      </div>

      <div className="p-4" onClick={() => localStorage.setItem(`@infoPedidosTakeat:${restaurant}`, JSON.stringify(pedido))}>
        {/* STATUS */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${basket.order_status !== 'finished' ? 'animate-pulse' : ''
                } ${['canceled'].includes(basket.order_status ?? '')
                  ? 'bg-takeat-red-default'
                  : ['pending'].includes(basket.order_status ?? '')
                    ? 'bg-takeat-orange-default'
                    : ['accepted', 'ready', 'delivered'].includes(basket.order_status ?? '')
                      ? 'bg-takeat-green-default'
                      : basket.order_status === 'finished'
                        ? 'hidden'
                        : 'bg-takeat-red-default'
                }`}
            />
            <CheckCircle
              className={`w-6 h-6 text-green-500 ${basket.order_status !== 'finished' ? 'hidden' : 'flex'
                }`}
            />

            <div className="flex items-center justify-between w-full">
              <p className="font-medium text-gray-800 w-full text-sm truncate">
                {statusMap[basket.order_status as keyof typeof statusMap] || 'Status desconhecido'}
              </p>
              <p className="text-gray-600 mt-1 w-full text-sm text-end">
                {basket.order_status !== 'finished'
                  ? `Feito às ${formattedTime}`
                  : formattedTimeFinished}
              </p>
            </div>
          </div>
        </div>

        {/* ETAPAS */}
        {
          basket.order_status !== 'canceled' && (
            <div
              className={`w-full justify-between gap-1 items-center ${basket.order_status !== 'finished' ? 'flex' : 'hidden'
                }`}
            >
              {[0, 1, 2].map((step) => {
                const status = basket.order_status;
                const isActive =
                  (step === 0 && ['accepted', 'ready', 'finished', 'delivered'].includes(status || '')) ||
                  (step === 1 && ['accepted', 'ready', 'finished', 'delivered'].includes(status || '')) ||
                  (step === 2 && ['ready', 'finished', 'delivered'].includes(status || ''));

                const shouldAnimate =
                  (status === 'accepted' && step === 1) ||
                  (status === 'ready' && step === 2) ||
                  (status === 'delivered' && step === 1);

                const solidBg =
                  (status === 'accepted' && step < 1) ||
                  (status === 'ready' && step < 2) ||
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
                  <MotionDiv
                    key={step}
                    initial={{ opacity: 0.3, scaleX: 0.9 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.4, delay: step * 0.1 }}
                    className={`h-2 w-1/3 rounded-full relative overflow-hidden mx-${step === 1 ? '1' : '0'} ${getMotionBg()}`}
                  >
                    {shouldAnimate && basket.order_status !== 'finished' && (
                      <MotionDiv
                        className='absolute inset-0 bg-gradient-to-r from-transparent via-takeat-primary-default to-transparent'
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                      />
                    )}
                  </MotionDiv>
                );
              })}
            </div>
          )
        }

        {/* FINALIZADO - ITENS */}
        {basket.order_status === 'finished' && (
          <div className="mt-4 border-t pt-3">
            <div className="flex justify-between items-end">
              <div className="flex flex-col justify-between mt-1 gap-2">
                {basket.orders?.map((order) => (
                  <div
                    key={order.id}
                    className="text-gray-600 text-md flex items-center justify-start gap-3"
                  >
                    <span className="bg-takeat-neutral-lightest font-semibold text-sm py-1 px-2 rounded-lg flex items-center justify-center">
                      {order.amount}x
                    </span>
                    <h2 className="font-semibold">{order.product?.name}</h2>
                  </div>
                ))}
              </div>
              <ChevronRight className="text-gray-400 h-6 w-6" />
            </div>
          </div>
        )}

        {/* EM ANDAMENTO - PAGAMENTO */}
        {basket.order_status !== 'finished' && (
          <div className="mt-4 border-t pt-3">
            <p className="text-gray-600 text-md">Pagamento</p>
            <div className="flex justify-between items-center mt-1">
              <div>
                <p className="font-medium text-gray-800">{paymentMethod}</p>
                <div className="flex items-center mt-2">
                  <p className="font-semibold text-gray-800">{formatPrice(`${pedido.total_delivery_price}`)}</p>
                  <span className="text-gray-500 ml-2">
                    / {basket.orders?.length ?? 0} {basket.orders?.length > 1 ? 'itens' : 'item'}
                  </span>
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
