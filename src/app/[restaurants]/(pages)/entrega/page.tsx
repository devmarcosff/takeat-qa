"use client";
import InformationButton from "@/components/uiComponents/Buttons/informationButton.component";
import InternalPages from "@/components/uiComponents/InternalPageHeader/internal_pages.header";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  params: Promise<{ restaurants: string }>;
}

// INFORMAÇÃO DOS STATUS DA ENTREGA
// 1 => Delivery
// 2 => Retirar no Balcão
// 3 => Agendamento Delivery
// 4 => Agendamento Retirada

export default function EntregaPage({ params }: Props) {
  const restaurant = React.use(params)?.restaurants;
  const methodDeliveryTakeat = `@methodDeliveryTakeat:${restaurant}`;
  const { push } = useRouter();

  const add = (e: string) => {
    localStorage.setItem(methodDeliveryTakeat, e)
    push(`/${restaurant}/endereco`)
  }

  return (
    <InternalPages title="Entrega" button description="Escolha uma opção de entrega">
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 12, marginTop: 20 }}>
        <InformationButton onClick={() => add('delivery')} title="Delivery" icon="IconMotorcycle" fill="#C8131B" time={12} />
        <InformationButton onClick={() => add('retirarBalcao')} title="Retirar no Balcão" icon="IconDeliveryBag" fill="#C8131B" time={44} />
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
        <InformationButton onClick={() => add('agendamentoDelivery')} title="Agendamento Delivery" icon="IconDeliverySchedule" fill="#C8131B" />
        <InformationButton onClick={() => add('agendamentoRetirada')} title="Agendamento Retirada" icon="IconDeliveryBagSchedule" fill="#C8131B" />
      </div>
    </InternalPages>
  );
}
