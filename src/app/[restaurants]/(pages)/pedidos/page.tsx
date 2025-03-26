import MenuComponent from "@/components/menu/menu.component";
import { TakeatPage } from "@/components/theme/ThemeProviderWrapper";
import PageWrapper from "@/hook/pageWrapper";
import { use } from "react";

interface Props {
  params: Promise<{ restaurants: string }>;
}

export default function PedidosPage({ params }: Props) {
  const restaurant = use(params)?.restaurants;

  return (
    <PageWrapper>
      <h2>Marcos </h2>
      <TakeatPage>
        <MenuComponent params={restaurant} />
      </TakeatPage>
    </PageWrapper>
  )
}
