import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Restaurant } from "@/types/restaurant.types";
import { motion } from "framer-motion";
import { useState } from "react";
import { formatPrice, IconDollarSign, IconInstagram, IconLocationFilled, IconWhatsapp } from "takeat-design-system-ui-kit";
import { deliveryInfo } from "./header.components";

export function DrawerHeaderComponent({ openDrawer, setOpenDrawer, restaurant }: { openDrawer: boolean, setOpenDrawer: (value: boolean) => void, restaurant: Restaurant | null }) {
  const [activeTab, setActiveTab] = useState("sobre")

  return (
    <Drawer open={openDrawer} onClose={() => setOpenDrawer(!openDrawer)}>
      <DrawerContent>
        <Tabs defaultValue="sobre" value={activeTab} onValueChange={setActiveTab} className="relative w-full bg-transparent p-4 h-[410px]">
          <TabsList className="w-full bg-transparent flex relative">
            <TabsTrigger
              value="sobre"
              className="w-full flex justify-center py-2 relative data-[state=active]:shadow-none"
            >
              <DrawerTitle className="font-medium text-sm">Sobre</DrawerTitle>
            </TabsTrigger>
            <TabsTrigger
              value="horarios"
              className="w-full flex justify-center py-2 relative data-[state=active]:shadow-none"
            >
              <DrawerTitle className="font-medium text-sm">Horários</DrawerTitle>
            </TabsTrigger>

            {/* Barrinha animada */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                position: "absolute",
                bottom: 0,
                height: "2px",
                background: "#c8131b",
                width: "50%",
                left: activeTab === "sobre" ? "0%" : "50%",
              }}
            />
          </TabsList>
          {/* TAB SOBRE */}
          <TabsContent value="sobre">
            {/* Descrição */}
            <div className="pt-1">
              <h2 className="font-semibold text-takeat-neutral-darker mb-2">Descrição</h2>
              <p className="text-sm">
                {restaurant?.greeting_message || "Não existe descrição para este restaurante."}
              </p>
              {deliveryInfo({ restaurant })}
            </div>
            {/* Localização */}
            <div className="py-3">
              <h2 className="font-semibold flex items-center gap-1 text-takeat-neutral-darker mb-2"><IconLocationFilled className="size-6 fill-takeat-neutral-dark" /> Localização</h2>
              <p className="text-sm">{restaurant?.adress.street}, {restaurant?.adress.number}</p>
              <p className="text-sm">{restaurant?.adress.neighborhood}, {restaurant?.adress.city} - {restaurant?.adress.state}</p>
              <p className="text-sm">{restaurant?.adress.zip_code}</p>
            </div>
            {/* Pedido Mínimo */}
            <div className="py-3">
              <h2 className="font-semibold flex items-center gap-1 text-takeat-neutral-darker mb-2"><IconDollarSign className="size-6 fill-takeat-neutral-dark" /> Pedido Mínimo</h2>
              <p className="text-sm">Delivery {formatPrice(`${restaurant?.delivery_info.delivery_minimum_price}`)} | Retirada {formatPrice(`${restaurant?.delivery_info.withdrawal_minimum_price}`)}</p>
            </div>

            {/* Redes Sociais */}
            <div className="py-3">
              <div className="flex items-center gap-3 justify-between w-full">
                <Button
                  variant='outline'
                  onClick={() => {
                    const url = `https://api.whatsapp.com/send?phone=${restaurant?.phone}&text=%F0%9F%8D%94%20Ol%C3%A1%2C%20vim%20atrav%C3%A9s%20do%20link%20app%20Takeat%20${restaurant?.fantasy_name}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                  className="font-semibold"><IconWhatsapp className="!size-6" />Fale com a loja</Button>
                <Button
                  variant='outline'
                  onClick={() => {
                    const url = `https://www.instagram.com/${restaurant?.instagram}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                  className="border-takeat-neutral-darker text-takeat-neutral-darker fill-takeat-neutral-darker"><IconInstagram className="!size-6" />Siga-nos</Button>
              </div>
            </div>
          </TabsContent>
          {/* TAB HORÁRIOS */}
          <TabsContent value="horarios">
            <div className="pt-1">
              <Table>
                <TableCaption>
                  Não existe horário de atendimento registrado para este restaurante.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dias da semana</TableHead>
                    <TableHead>Horário</TableHead>
                  </TableRow>
                </TableHeader>
                {/* <TableBody>
                  {Array.from({ length: 7 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-takeat-neutral-darker font-medium">Dia {(index + 1).toString().padStart(2, "0")}</TableCell>
                      <TableCell className="text-takeat-neutral-darker">Segunda-feira</TableCell>
                    </TableRow>
                  ))}
                </TableBody> */}
              </Table>

            </div>
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer >
  )
}