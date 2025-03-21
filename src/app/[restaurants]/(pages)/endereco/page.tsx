"use client";
import AddressClientComponent from "@/components/restaurants/address/address.component";
import InternalPages from "@/components/uiComponents/InternalPageHeader/internal_pages.header";
import React, { useEffect, useState } from "react";

interface Props {
  params: Promise<{ restaurants: string }>;
}

export interface methodDeliveryProps {
  delimit_by_area: boolean
  is_delivery_by_distance: boolean
}

export default function EnderecoPage({ params }: Props) {
  const restaurant = React.use(params)?.restaurants;
  const deliveryTakeatStorage = `@deliveryTakeat:${restaurant}`;
  const [methodDelivery, setMethodDelivery] = useState<methodDeliveryProps>(
    {
      delimit_by_area: false,
      is_delivery_by_distance: false
    }
  );

  useEffect(() => {
    const methodDelivery = localStorage.getItem(deliveryTakeatStorage);

    if (methodDelivery) {
      const newMethodDelivery = JSON.parse(methodDelivery);

      setMethodDelivery(newMethodDelivery)
    }
  }, [deliveryTakeatStorage])

  return (
    <InternalPages title="Endereço" button description="Confira abaixo a disponibilidade de delivery para o seu endereço.">
      <AddressClientComponent params={params} methodDelivery={methodDelivery} />
    </InternalPages>
  );
}
