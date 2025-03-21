import { usePathname } from "next/navigation";
import { IconTClipboard, IconTDiscount, IconTFilled, IconTHome, StyledLink } from "./menu.style";

export const BottomMenu = ({ params }: { params: string }) => {
  const pathname = usePathname();

  return (
    <ul className="flex w-full h-full items-center justify-evenly border-t">
      <li>
        <StyledLink $active={pathname === `/${params}`} href={`/${params}`}>
          <IconTHome $active={pathname === `/${params}`} />
          <span>Início</span>
        </StyledLink>
      </li>
      <li>
        <StyledLink $active={pathname === `/${params}/destaques`} href={`/${params}/destaques`}>
          <IconTDiscount $active={pathname === `/${params}/destaques`} />
          <span>Destaques</span>
        </StyledLink>
      </li>
      <li>
        <StyledLink $active={pathname === `/${params}/desconto`} href={`/${params}/desconto`}>
          <IconTFilled $active={pathname === `/${params}/desconto`} />
          <span>Desconto</span>
        </StyledLink>
      </li>
      <li>
        <StyledLink $active={pathname === `/${params}/pedidos`} href={`/${params}/pedidos`}>
          <IconTClipboard $active={pathname === `/${params}/pedidos`} />
          <span>Pedidos</span>
        </StyledLink>
      </li>
    </ul>
  );
};