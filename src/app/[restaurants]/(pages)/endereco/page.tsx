import AddressClientComponent from "@/components/restaurants/address/address.component";
import InternalPages from "@/components/uiComponents/InternalPageHeader/internal_pages.header";

export default function EnderecoPage() {
  return (
    <InternalPages title="Endereço" button description="Confira abaixo a disponibilidade de delivery para o seu endereço.">
      <AddressClientComponent />
    </InternalPages>
  );
}
