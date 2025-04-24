"use client";
import InternalPages from "@/components/uiComponents/InternalPageHeader/internal_pages.header";
import { useDelivery } from "@/context/DeliveryContext";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

interface Props {
  params: Promise<{ restaurants: string, id: string }>;
}

export default function PedidoRealizadoPage({ params }: Props) {
  const restaurant = use(params)?.restaurants;
  const finalizar_pedido = "/assets/pedido-finalizado.svg"

  const { paymentOrderId } = useDelivery()

  return (
    <InternalPages>
      <div className="text-center flex flex-col justify-center items-center w-full h-screen gap-4">
        <div>
          <Image width={250} height={250} src={`${finalizar_pedido}`} alt="" />
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Pedido realizado com sucesso!</h2>
          <p>Acompanhe o status em {'\"'}Pedidos{'\"'}</p>
        </div>

        <div className="flex flex-col gap-3 w-full p-4">
          <Link href={`/${restaurant}/pedidos/${paymentOrderId}`} className="bg-takeat-primary-default p-3 shadow-md rounded-lg text-white font-semibold">
            <span>Detalhes do pedido</span>
          </Link>
          <Link href={`/${restaurant}`} className="text-takeat-primary-default font-semibold">
            <span>Página inicial</span>
          </Link>
        </div>
      </div>
    </InternalPages>
  );
}