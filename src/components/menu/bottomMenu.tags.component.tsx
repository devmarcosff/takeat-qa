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
}

export const BottomMenu = ({ params }: BottomMenuProps) => {
  const pathname = usePathname();
  const [openModal, setOpenModal] = useState(false);

  const links = [
    { href: `/${params}`, label: "Início", icon: IconTHome },
    { href: "#", label: "Promoções", icon: IconTDiscount, onClick: () => setOpenModal(true) },
    { href: `/${params}/desconto`, label: "Desconto", icon: IconTFilled },
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
    </>
  );
};