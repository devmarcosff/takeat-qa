"use client";
import InternalPages from "@/components/uiComponents/InternalPageHeader/internal_pages.header";
import AgendamentoDrawerComponent from "@/components/v2/entregas/agendamento.drawer";
import Link from "next/link";
import React, { useState } from "react";
import { IconClock, IconDeliveryBag, IconDeliveryBagSchedule, IconDeliverySchedule, IconMotorcycle } from "takeat-design-system-ui-kit";

interface Props {
  params: Promise<{ restaurants: string }>;
}

export default function EntregaPage({ params }: Props) {
  const restaurant = React.use(params)?.restaurants;
  const methodDeliveryTakeat = `@methodDeliveryTakeat:${restaurant}`;
  const [openDrawer, setOpenDrawer] = useState(false)
  const [title, setTitle] = useState<string>('')
  const add = (e: string) => {
    localStorage.setItem(methodDeliveryTakeat, e)
  }

  return (
    <InternalPages title="Entrega" button description="Escolha uma opção de entrega">
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 12, marginTop: 20 }}>
        <Link href={`/${restaurant}/endereco`} onClick={() => add('delivery')}
          className="
          flex items-center justify-between w-full h-[60px]
          border border-takeat-neutral-light rounded-xl px-4
          ">
          <div className="flex items-center gap-3">
            <IconMotorcycle className="fill-takeat-primary-default text-2xl" />
            <span>Delivery</span>
          </div>
          <div className="flex items-center gap-3">
            <IconClock />
            <span>13 min.</span>
          </div>
        </Link>
        <Link href={`/${restaurant}/pagamento`} onClick={() => add('retirarBalcao')}
          className="
          flex items-center justify-between w-full h-[60px]
          border border-takeat-neutral-light rounded-xl px-4">
          <div className="flex items-center gap-3">
            <IconDeliveryBag className="fill-takeat-primary-default text-2xl" />
            <span>Retirar no Balcão</span>
          </div>
          <div className="flex items-center gap-3">
            <IconClock />
            <span>13 min.</span>
          </div>
        </Link>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: 12
          }}>
          <hr style={{
            height: 2,
            width: "100%",
            backgroundColor: "#EDEDED",
            borderRadius: '50px'
          }}
          />
          <span>Agendamento</span>
          <hr style={{
            height: 2,
            width: "100%",
            backgroundColor: "#EDEDED",
            borderRadius: '50px'
          }} />
        </div>
        <Link href={''} onClick={() => {
          setTitle('Agendamento Delivery')
          setOpenDrawer(!openDrawer)
        }}
          className="
          flex items-center justify-between w-full h-[60px]
          border border-takeat-neutral-light rounded-xl px-4
          ">
          <div className="flex items-center gap-3">
            <IconDeliverySchedule className="fill-takeat-primary-default text-2xl" />
            <span>Agendamento Delivery</span>
          </div>
          <div className="flex items-center gap-3">
            <IconClock />
            <span>13 min.</span>
          </div>
        </Link>
        <Link href={''} onClick={() => {
          setTitle('Agendamento Retirada')
          setOpenDrawer(!openDrawer)
        }}
          className="
          flex items-center justify-between w-full h-[60px]
          border border-takeat-neutral-light rounded-xl px-4
          ">
          <div className="flex items-center gap-3">
            <IconDeliveryBagSchedule className="fill-takeat-primary-default text-2xl" />
            <span>Agendamento Retirada</span>
          </div>
          <div className="flex items-center gap-3">
            <IconClock />
            <span>13 min.</span>
          </div>
        </Link>
      </div>

      <AgendamentoDrawerComponent restaurant={restaurant} openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} title={title} description="Escolha o dia e horário para o agendamento" />
    </InternalPages>
  );
}