'use client';
import MenuComponent from "@/components/menu/menu.component";
import { CardComponent } from "@/components/restaurants/pedidos/CardComponent";
import { IPedidos } from "@/components/restaurants/pedidos/types";
import { TakeatPage } from "@/components/theme/ThemeProviderWrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InternalPages from "@/components/uiComponents/InternalPageHeader/internal_pages.header";
import { api_create_order } from "@/utils/apis";
import { TabsContent } from "@radix-ui/react-tabs";
import { useGesture } from '@use-gesture/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PedidosPage() {
  const params = useParams();
  const restaurant = params?.restaurants as string;
  const [activeTab, setActiveTab] = useState("andamentos");
  const [resumeCart, setResumeCart] = useState<IPedidos[]>([]);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const token = localStorage.getItem(`@tokenUserTakeat:${restaurant}`);
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const tabOrder = ['andamentos', 'agendados', 'finalizados'];

  useEffect(() => {
    api_create_order.get('/sessions', config)
      .then(res => setResumeCart(res.data))
      .catch(error => console.log(error));
  }, []);

  // Função para trocar de tab via swipe
  const handleSwipe = (direction: 'left' | 'right') => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (direction === 'left' && currentIndex < tabOrder.length - 1) {
      setSwipeDirection('left');
      setActiveTab(tabOrder[currentIndex + 1]);
    }
    if (direction === 'right' && currentIndex > 0) {
      setSwipeDirection('right');
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  // Hook do use-gesture (apenas gestos horizontais)
  const bind = useGesture({
    onDragEnd: ({ swipe: [swipeX, swipeY] }) => {
      if (Math.abs(swipeX) > Math.abs(swipeY)) { // só troca se for horizontal
        if (swipeX === -1) handleSwipe('left');
        if (swipeX === 1) handleSwipe('right');
      }
    }
  });

  const andamentoCards = resumeCart
    .filter(pedido => !pedido.scheduled_to)
    .flatMap(pedido =>
      pedido.bills.flatMap(bill =>
        bill.order_baskets
          .filter(basket =>
            !['finished', 'canceled', 'canceled_waiting_payment'].includes(basket.order_status)
          )
          .map(basket => ({
            pedido,
            basket,
            pix_payments: pedido.pix_payments,
            user_change: pedido.user_change,
          }))
      )
    );

  const agendadosCards = resumeCart
    .filter(pedido => !!pedido.scheduled_to)
    .flatMap(pedido =>
      pedido.bills.flatMap(bill =>
        bill.order_baskets.map(basket => ({
          pedido,
          basket,
          pix_payments: pedido.pix_payments,
          user_change: pedido.user_change,
        }))
      )
    );

  const finalizadosCards = resumeCart
    .flatMap(pedido =>
      pedido.bills.flatMap(bill =>
        bill.order_baskets
          .filter(basket =>
            ['finished', 'canceled', 'canceled_waiting_payment'].includes(basket.order_status)
          )
          .map(basket => ({
            pedido,
            basket,
            pix_payments: pedido.pix_payments,
            user_change: pedido.user_change,
          }))
      )
    );

  // Animação de transição mais suave
  const variants = {
    initial: (direction: 'left' | 'right' | null) => ({
      x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
      opacity: 0
    }),
    animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: (direction: 'left' | 'right' | null) => ({
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      opacity: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    })
  };

  return (
    <div>
      <InternalPages title="Pedidos">
        <div className="mt-3">
          <div {...bind()} style={{ touchAction: 'pan-y' }}>
            <Tabs
              defaultValue="andamentos"
              value={activeTab}
              onValueChange={tab => { setSwipeDirection(null); setActiveTab(tab); }}
              className="relative w-full h-full bg-transparent mb-16"
            >
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
                    width: `calc(100% / 3 - 22px)`,
                    left:
                      activeTab === "andamentos"
                        ? `calc(0% + 16px)`
                        : activeTab === "agendados"
                          ? `calc(33.3333% + 16px)`
                          : `calc(66.6666% + 16px)`,
                    borderRadius: 2,
                  }}
                />
              </TabsList>
              <AnimatePresence custom={swipeDirection} mode="wait">
                {activeTab === 'andamentos' && (
                  <TabsContent value="andamentos" forceMount key="andamentos">
                    <motion.div
                      custom={swipeDirection}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {andamentoCards.length ? andamentoCards.map((item, i) => (
                        <CardComponent
                          key={i}
                          pedido={item.pedido}
                          basket={item.basket}
                          restaurant={restaurant}
                          userChange={item.user_change}
                          pixPayments={item.pix_payments}
                        />
                      )) : (
                        <p className="text-center text-sm text-gray-500 mt-8">Nenhum pedido em andamento até o momento</p>
                      )}
                    </motion.div>
                  </TabsContent>
                )}
                {activeTab === 'agendados' && (
                  <TabsContent value="agendados" forceMount key="agendados">
                    <motion.div
                      custom={swipeDirection}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {agendadosCards.length ? agendadosCards.map((item, i) => (
                        <CardComponent
                          key={i}
                          pedido={item.pedido}
                          basket={item.basket}
                          restaurant={restaurant}
                          userChange={item.user_change}
                          pixPayments={item.pix_payments}
                        />
                      )) : (
                        <p className="text-center text-sm text-gray-500 mt-8">Nenhum pedido agendado até o momento</p>
                      )}
                    </motion.div>
                  </TabsContent>
                )}
                {activeTab === 'finalizados' && (
                  <TabsContent value="finalizados" forceMount key="finalizados">
                    <motion.div
                      custom={swipeDirection}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {finalizadosCards.length ? finalizadosCards.map((item, i) => (
                        <CardComponent
                          key={i}
                          pedido={item.pedido}
                          basket={item.basket}
                          restaurant={restaurant}
                          userChange={item.user_change}
                          pixPayments={item.pix_payments}
                        />
                      )) : (
                        <p className="text-center text-sm text-gray-500 mt-8">Nenhum pedido finalizado até o momento</p>
                      )}
                    </motion.div>
                  </TabsContent>
                )}
              </AnimatePresence>
            </Tabs>
          </div>
        </div>
      </InternalPages>

      <TakeatPage>
        <MenuComponent params={restaurant} />
      </TakeatPage>
    </div>
  );
}