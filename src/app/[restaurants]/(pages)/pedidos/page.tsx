'use client';
import MenuComponent from "@/components/menu/menu.component";
import { TakeatPage } from "@/components/theme/ThemeProviderWrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InternalPages from "@/components/uiComponents/InternalPageHeader/internal_pages.header";
import { api_create_order } from "@/utils/apis";
import { TabsContent } from "@radix-ui/react-tabs";
import { motion } from 'framer-motion';
import { use, useEffect, useState } from "react";
import { CardComponent } from "./CardComponent";
import { IPedidos } from "./types";

interface Props {
  params: Promise<{ restaurants: string, id?: string }>;
}

export default function Pedidos({ params }: Props) {
  const restaurant = use(params)?.restaurants;
  const [activeTab, setActiveTab] = useState("andamentos");
  const [resumeCart, setResumeCart] = useState<IPedidos[]>([]);
  const token = localStorage.getItem(`@tokenUserTakeat:${restaurant}`);
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    api_create_order.get('/sessions', config)
      .then(res => setResumeCart(res.data))
      .catch(error => console.log(error));
  }, []);

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


  return (
    <div>
      <InternalPages title="Pedidos">
        <div className="mt-3">
          <Tabs defaultValue="andamentos" value={activeTab} onValueChange={setActiveTab} className="relative w-full h-full bg-transparent mb-16">
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

            <TabsContent value="andamentos">
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
            </TabsContent>

            <TabsContent value="agendados">
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
            </TabsContent>

            <TabsContent value="finalizados">
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
            </TabsContent>
          </Tabs>
        </div>
      </InternalPages>

      <TakeatPage>
        <MenuComponent params={restaurant} />
      </TakeatPage>
    </div>
  );
}