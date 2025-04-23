"use client";
import AddressClientComponent from "@/components/restaurants/address/address.component";
import InternalPages from "@/components/uiComponents/InternalPageHeader/internal_pages.header";

interface Props {
  params: Promise<{ restaurants: string }>;
}

export default function EnderecoPage({ params }: Props) {
  return (
    <InternalPages title="Endereço" button description="Confira abaixo a disponibilidade de delivery para o seu endereço.">
      <AddressClientComponent params={params} />
    </InternalPages>
  );
}
