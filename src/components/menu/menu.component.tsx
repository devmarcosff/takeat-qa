"use client"
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { formatPrice } from "takeat-design-system-ui-kit";
import { ICart } from "../addProducts/addProducts.types";
import { BottomMenu } from "./bottomMenu.tags.component";
import { AnimationMenu, CartUpdate, CircleNotificationMenu, MenuContainer, MenuTags, NotificationIconMenu, NotificationMenuContainer, NotificationMenuInfo } from "./menu.style";

interface Props {
  params: string;
}

export default function MenuComponent({ params }: Props) {
  const takeatBagKey = `@deliveryTakeat:${params}TakeatBag`;
  const { push } = useRouter()
  const [cart, setCart] = useState(0)
  const [qtd, setQtd] = useState(0)

  const updateStorageData = useCallback(() => {
    const storedBag = localStorage.getItem(takeatBagKey);
    const parsedBag = storedBag ? JSON.parse(storedBag)?.products || [] : [];

    const total = parsedBag.reduce((acc: number, item: ICart) => acc + (item.price * item.qtd), 0);
    setCart(total);
    setQtd(parsedBag.length)
  }, [takeatBagKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      updateStorageData();

      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === takeatBagKey) {
          updateStorageData();
        }
      };

      window.addEventListener("storage", handleStorageChange);

      const interval = setInterval(() => {
        updateStorageData();
      }, 500);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
        clearInterval(interval);
      };
    }
  }, [takeatBagKey, updateStorageData]);

  return (
    <MenuContainer>
      {
        qtd > 0 && (
          <AnimationMenu>
            <NotificationMenuContainer onClick={() => push(`/${params}/carrinho`)}>
              <NotificationMenuInfo>
                <CartUpdate>
                  <NotificationIconMenu />
                  <CircleNotificationMenu>{qtd}</CircleNotificationMenu>
                </CartUpdate>
                <span className="text-[16px]">Fazer Pedido</span>
              </NotificationMenuInfo>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={cart}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "backInOut" }}
                >
                  <span className="text-[16px]">{formatPrice(cart)}</span>
                </motion.span>
              </AnimatePresence>
            </NotificationMenuContainer>
          </AnimationMenu>
        )
      }

      <MenuTags>
        <BottomMenu params={params} />
      </MenuTags>
    </MenuContainer>
  )
}
