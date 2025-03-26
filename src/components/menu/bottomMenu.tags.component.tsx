import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconTClipboard,
  IconTDiscount,
  IconTFilled,
  IconTHome,
  StyledLink
} from "./menu.style";

export const BottomMenu = ({ params }: { params: string }) => {
  const pathname = usePathname();

  const links = [
    { href: `/${params}`, label: "Início", icon: IconTHome },
    { href: `/${params}/destaques`, label: "Destaques", icon: IconTDiscount },
    { href: `/${params}/desconto`, label: "Desconto", icon: IconTFilled },
    { href: `/${params}/pedidos`, label: "Pedidos", icon: IconTClipboard },
  ];

  return (
    <ul className="flex w-full h-full items-center justify-evenly border-t">
      {links.map(({ href, label, icon: Icon }) => (
        <li key={href}>
          <Link href={href} passHref>
            <StyledLink $active={pathname === href}>
              <Icon $active={pathname === href} />
              <span>{label}</span>
            </StyledLink>
          </Link>
        </li>
      ))}
    </ul>
  );
};