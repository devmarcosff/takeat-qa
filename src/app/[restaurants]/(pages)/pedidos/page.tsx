import MenuComponent from "@/components/menu/menu.component";
import { TakeatPage } from "@/components/theme/ThemeProviderWrapper";
import { use } from "react";

interface Props {
    params: Promise<{ restaurants: string }>;
}

export default function PedidosPage({ params }: Props) {
    const restaurant = use(params)?.restaurants;

    return (
        <TakeatPage>
            <MenuComponent params={restaurant} />
        </TakeatPage>
    )
}
