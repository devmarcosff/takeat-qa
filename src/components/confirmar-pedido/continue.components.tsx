import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button, DEFAULT_THEME, formatPrice, Modal } from 'takeat-design-system-ui-kit';
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
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
          <button disabled={totalPrice === 0} onClick={() => setModalOpen(!modalOpen)}>
            <span className='text-takeat-primary-default font-semibold'>Limpar</span>
          </button>
        </SelectAddProducts>
        <AddProductsQuantity disabled={!(totalPrice > Number(active))} style={{ height: 48 }}>
          <TextAddProductsQuantity disabled={!(totalPrice > Number(active))} onClick={() => push(`/${params}/informacao`)}>
            {!(totalPrice > Number(active)) ? `Pedido mín: ${formatPrice(`${active}`)}` : `${textButon || 'Continuar Pedido'}`}
          </TextAddProductsQuantity>
        </AddProductsQuantity>
      </ActionProducts>


      <Modal open={modalOpen} toggle={() => setModalOpen(!modalOpen)} style={{ height: "fit-content" }}>
        <Modal.Header>
          <h1>Tem certeza que deseja limpar o carrinho?</h1>
        </Modal.Header>
        <Modal.Body>
          <p>Ao prosseguir, todos os itens do seu carrinho serão removidos.</p>
          <p>Esta ação não pode ser desfeita, mas você pode adicionar novos itens ao seu carrinho.</p>
        </Modal.Body>
        <Modal.Footer className='w-full !flex !items-center !justify-between'>
          <Button className='!w-1/3 !bg-transparent !text-takeat-neutral-dark !h-[48px]'
            style={{ border: `1px solid ${DEFAULT_THEME.colors.neutral.light}` }}
            onClick={() => setModalOpen(false)}>
            Cancelar
          </Button>
          <Button className='!w-full !h-[48px] disabled:!bg-takeat-primary-default/85'
            customColor={DEFAULT_THEME.colors.primary.default}
            disabled={loading}
            onClick={() => {
              setLoading(true);
              localStorage.removeItem(takeatBagKey)
              setTimeout(() => {
                setModalOpen(!modalOpen);
                setLoading(false);
              }, 600);
            }}
          >
            {loading ? <AiOutlineLoading3Quarters className='animate-spin' /> : 'Confirmar'}
          </Button>
        </Modal.Footer>
      </Modal>


    </AddProductsContainer>
  )
}