'use client';

import dayjs from 'dayjs';
import { motion, MotionProps } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatPrice } from 'takeat-design-system-ui-kit';
import { statusMap } from './statusMap';
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

  const statusInfo = statusMap[basket.order_status as keyof typeof statusMap] || statusMap.default;

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
              className={`h-2.5 w-2.5 rounded-full ${basket.order_status !== 'finished' ? 'animate-pulse' : ''}
                ${['pending'].includes(basket.order_status ?? '')
                  ? 'bg-takeat-orange-default'
                  : ['accepted', 'ready', 'delivered', 'ongoing'].includes(basket.order_status ?? '')
                    ? 'bg-takeat-green-default'
                    : 'hidden'
                }`}
            />

            {/* Ícone de status finalizado ou cancelado */}
            {basket.order_status === 'finished' && (
              <Image width={18} height={18} src={'/assets/success.svg'} alt={'Pedido finalizado'} className="w-[18px] h-[18px] text-green-500" />
            )}
            {(basket.order_status === 'canceled' || basket.order_status === 'canceled_waiting_payment') && (
              <Image width={18} height={18} src={'/assets/close.svg'} alt={'Pedido cancelado'} className="w-[18px] h-[18px] text-red-500" />
            )}

            <div className="flex items-center justify-between w-full">
              <p className="font-medium text-gray-800 w-full text-sm truncate">
                {statusInfo.label}
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
          !['canceled', 'canceled_waiting_payment', 'finished'].includes(basket.order_status) && (
            <div className="w-full justify-between gap-1 items-center flex">
              {[0, 1, 2].map((step) => {
                const status = basket.order_status;

                // Lógica de animação conforme status
                let animateStep = [false, false, false];
                if (status === 'pending') {
                  animateStep = [true, false, false];
                } else if (['accepted', 'ongoing'].includes(status)) {
                  animateStep = [true, true, false];
                } else if (['delivered', 'ready'].includes(status)) {
                  animateStep = [true, true, true];
                }

                const isActive = animateStep[step];

                // Descobrir o último card ativo
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