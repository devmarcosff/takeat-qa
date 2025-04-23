import CashbackDrawer from "@/app/[restaurants]/(pages)/confirmar-pedido/cashback.drawer";
import { IClientClube, IClienteTakeat } from "@/app/[restaurants]/(pages)/confirmar-pedido/page";
import PromocaoModal from "@/components/v2/promocao/promocao.modal";
import { Category } from "@/types/categories.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IconTClipboard,
  IconTDiscount,
  IconTFilled,
  IconTHome,
  StyledLink
} from "./menu.style";

interface BottomMenuProps {
  params: string;
  categories?: Category[];
  isClienteTakeat?: IClienteTakeat;
  isClientClube?: IClientClube;
}

export const BottomMenu = ({
  params,
  isClienteTakeat = { tel: '' },
  isClientClube = {
    clientExist: false,
    clientEmail: null,
    clientBelongsToStore: false,
    minimum_rescue: '0',
    totalClientCashback: '0',
    totalClientPoints: null
  }
}: BottomMenuProps) => {
  const pathname = usePathname();
  const [openModal, setOpenModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const links = [
    { href: `/${params}`, label: "Início", icon: IconTHome },
    { href: `/${params}/promocoes`, label: "Promoções", icon: IconTDiscount, onClick: () => setOpenModal(true) },
    { href: `/${params}/descontos`, label: "Desconto", icon: IconTFilled, onClick: () => setOpenDrawer(true) },
    { href: `/${params}/pedidos`, label: "Pedidos", icon: IconTClipboard },
  ];

  return (
    <>
      <ul className="flex w-full h-full items-center justify-evenly border-t">
        {links.map(({ href, label, icon: Icon, onClick }) => (
          <li key={href}>
            {onClick ? (
              <StyledLink $active={pathname === href} onClick={onClick}>
                <Icon $active={pathname === href} />
                <span>{label}</span>
              </StyledLink>
            ) : (
              <Link href={href} passHref>
                <StyledLink $active={pathname === href}>
                  <Icon $active={pathname === href} />
                  <span>{label}</span>
                </StyledLink>
              </Link>
            )}
          </li>
        ))}
      </ul>
      <PromocaoModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        params={params}
      />
      <CashbackDrawer
        isClienteTakeat={isClienteTakeat}
        isClientClube={isClientClube}
        openDrawer={openDrawer}
        setOpenDrawer={() => setOpenDrawer(!openDrawer)}
      />
    </>
  );
};