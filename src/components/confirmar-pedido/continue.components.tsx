import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { formatPrice } from 'takeat-design-system-ui-kit';
import { ActionProducts, AddProductsContainer, AddProductsPriceInfoItem, AddProductsPriceItem, AddProductsQuantity, SelectAddProducts, TextAddProductsQuantity } from '../addProducts/addProducts.style';
import { ICart } from '../addProducts/addProducts.types';

interface Props {
  params: string,
  route?: string,
  clear?: boolean,
  textButon?: string,
  taxservice?: number,
  desconto?: boolean,
  finishOrder?: boolean,
}

export default function ContinueComponents({ params, textButon }: Props) {
  const takeatBagKey = `@deliveryTakeat:${params}TakeatBag`;
  const storageTakeat = `@deliveryTakeat:${params}`;
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [active, setActive] = useState()
  const { push } = useRouter();

  const updateStorageData = useCallback(() => {
    const storedBag = localStorage.getItem(takeatBagKey);
    const parsedBag = storedBag ? JSON.parse(storedBag)?.products || [] : [];

    const total = parsedBag.reduce((acc: number, item: ICart) => acc + (item.price * item.qtd), 0);
    setTotalPrice(Number(total.toFixed(2)));
  }, [takeatBagKey]);

  useEffect(() => {
    updateStorageData();

    const parsedStorage = localStorage.getItem(storageTakeat);
    if (parsedStorage) {
      const minimum_price = JSON.parse(parsedStorage).delivery_minimum_price;
      setActive(minimum_price);
    }

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
  }, [updateStorageData]);

  return (
    <AddProductsContainer flex_direction={"column"} height={110}>
      <AddProductsPriceItem>
        <AddProductsPriceInfoItem weight={"600"}>
          <span>Total:</span>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={totalPrice}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "backInOut" }}
            >
              {formatPrice(totalPrice)}
            </motion.span>
          </AnimatePresence>
        </AddProductsPriceInfoItem>
      </AddProductsPriceItem>

      <ActionProducts>
        <SelectAddProducts style={{ height: 48 }}>
          <button onClick={() => localStorage.removeItem(takeatBagKey)}>
            <span className='text-takeat-primary-default font-semibold'>Limpar</span>
          </button>
        </SelectAddProducts>
        <AddProductsQuantity disabled={!(totalPrice > Number(active))} style={{ height: 48 }}>
          <TextAddProductsQuantity disabled={!(totalPrice > Number(active))} onClick={() => push(`/${params}/informacao`)}>
            {!(totalPrice > Number(active)) ? `Pedido mín: ${formatPrice(`${active}`)}` : `${textButon || 'Continuar Pedido'}`}
          </TextAddProductsQuantity>
        </AddProductsQuantity>
      </ActionProducts>

    </AddProductsContainer>
  )
}