import { api_confirm_pix, api_create_order } from '@/utils/apis';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { formatPrice, IconChevronRight, IconTicketFilled, Modal } from 'takeat-design-system-ui-kit';
import { ActionProducts, AddProductsContainer, AddProductsPriceInfoItem, AddProductsPriceItem, AddProductsQuantity, ButtonProductsDiscount, ProductsDiscount, ProductsDiscountContainer, ProductsDiscountText, SelectAddProducts, TextAddProductsQuantity } from '../addProducts/addProducts.style';
import { ICart } from '../addProducts/addProducts.types';
import { ComplementCategory, OrderItem, Product } from '../continue/continue.types';

interface Props {
  params: string,
  route?: string,
  clear?: boolean,
  textButon?: string,
  taxservice?: number,
  desconto?: boolean,
  finishOrder?: boolean,
}

export default function ContinueComponents({ params, route, clear, textButon, taxservice, desconto, finishOrder }: Props) {
  const MethodPaymentTakeat = `@methodPaymentTakeat:${params}`;
  const takeatBagKey = `@deliveryTakeat:${params}TakeatBag`;
  const storageTakeat = `@deliveryTakeat:${params}`;
  const tokenClient = `@tokenUserTakeat:${params}`
  const tokenCard = `@tokenCardUserTakeat:${params}`;
  const addressClientDelivery = `@addressClientDeliveryTakeat:${params}`;
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [active, setActive] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [confirmPix, setConfirmPix] = useState(false)
  const [modalGen, setModalGen] = useState<{ qrcode: string, zoop_id: string }>()
  const [taxService, setTaxService] = useState<number>()
  const [parseAddress, setParseAddress] = useState<number>()
  const { push } = useRouter();

  const updateStorageData = useCallback(() => {
    const storedBag = localStorage.getItem(takeatBagKey);
    const parsedBag = storedBag ? JSON.parse(storedBag)?.products || [] : [];

    const total = parsedBag.reduce((acc: number, item: ICart) => acc + (item.price * item.qtd), 0);
    setTotalPrice(Number(total.toFixed(2)));
  }, [takeatBagKey]);


  const handleCreateOrder = () => {
    // TOKEN
    const storageCardToken = localStorage.getItem(tokenCard)

    // RestaurantId
    const storageRestaurantId = localStorage.getItem(`${storageTakeat}`)
    const parsedRestaurantId = JSON.parse(`${storageRestaurantId}`)

    // Address ID
    const storageAddressClientDelivery = localStorage.getItem(`${addressClientDelivery}`)
    const parsedAddressClientDelivery = JSON.parse(`${storageAddressClientDelivery}`)

    // Order
    // const storageCart = localStorage.getItem(`${takeatBagKey}`)
    // const parsedCart = JSON.parse(`${storageCart}`)
    const storageCart = localStorage.getItem(`${takeatBagKey}`);
    const parsedCart = storageCart ? JSON.parse(storageCart) : { products: [] };

    // Method => ex:"credito"
    const storageMethodPaymentTakeat = localStorage.getItem(MethodPaymentTakeat);
    const parsedMethodPaymentTakeat = JSON.parse(`${storageMethodPaymentTakeat}`)
    // eut.methods.keyword 

    const orders: OrderItem[] = parsedCart.products.map((product: Product) => {
      const orderItem: OrderItem = {
        id: product.categoryId, // ID do produto
        amount: product.qtd, // Quantidade do produto
        complement_categories: [] // Sempre existe no objeto, mesmo vazio
      };

      // Adicionando complementos apenas se existirem
      if (product.complements && product.complements.length > 0) {
        // Agrupar complementos por categoria
        const complementsByCategory: Record<string, ComplementCategory> = product.complements.reduce((acc, complement) => {
          const categoryId = complement.categoryId;
          if (!acc[categoryId]) {
            acc[categoryId] = {
              id: Number(categoryId),
              complements: [],
              additional: complement.additional
            };
          }
          acc[categoryId].complements.push({
            id: Number(complement.complementId),
            name: complement.name,
            price: complement.price,
            amount: complement.qtd,
          });
          return acc;
        }, {} as Record<string, ComplementCategory>);

        // Convertendo o objeto em array
        orderItem.complement_categories = Object.values(complementsByCategory);
      }

      return orderItem;
    });

    const payload = {
      payment_method: parsedMethodPaymentTakeat.keyword,
      payment_token: JSON.parse(`${storageCardToken}`) ? `${JSON.parse(`${storageCardToken}`)}` : null,
      payment_method_id: parsedMethodPaymentTakeat.id ? parsedMethodPaymentTakeat.id : null,
      restaurant_id: parsedRestaurantId.restaurantId,
      buyer_address_id: parsedAddressClientDelivery.id,
      with_withdrawal: false,
      details: "",
      coupon_code: "",
      rescue: 0,
      will_receive_sms: true,
      order: orders
    };

    const token = localStorage.getItem(tokenClient);
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    api_create_order.post('/orders', payload, config).then(res => {
      setModalGen(res.data.pix_info)
      if (res.data.pix_info) {
        setOpenModal(true)
      } else {
        localStorage.removeItem(takeatBagKey);
        // localStorage.removeItem(tokenClient);
        localStorage.removeItem(MethodPaymentTakeat);
        localStorage.removeItem(storageTakeat);
        push(`/${params}/pedido-realizado`)
      }
    }).catch(err => console.log(err))
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const parsedStorage = localStorage.getItem(storageTakeat);
      if (parsedStorage) {
        const minimum_price = JSON.parse(parsedStorage).delivery_minimum_price;
        setActive(minimum_price);
      }

      const address = localStorage.getItem(addressClientDelivery);
      if (address) {
        const parsedAddress = JSON.parse(address);
        const intTax = Number(parsedAddress.delivery_tax_price);
        setParseAddress(intTax);
      }

      setTaxService(taxservice);
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
  }, [
    addressClientDelivery,
    storageTakeat,
    takeatBagKey,
    taxservice,
    updateStorageData,
  ]);


  const HeightCheckout = () => {
    if (!parseAddress) return 120
    else if (desconto) return 230
    else return 170
  }

  const handleConfirmPix = () => {
    setConfirmPix(true)
    const token = localStorage.getItem(tokenClient);
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    api_confirm_pix.post('verify-pix', {
      zoop_id: modalGen?.zoop_id
    }, config).then(res => {
      if (res.data.paid == true) {
        push(`/${params}/pedido-realizado`)
      } else {
        setConfirmPix(false)
      }
    }).catch(() => setConfirmPix(false))
  }

  return (
    <AddProductsContainer flex_direction={"column"} height={HeightCheckout()}>
      <AddProductsPriceItem>
        {
          parseAddress && (
            <>
              <AddProductsPriceInfoItem textsize={16}>
                <span>Subtotal:</span>
                <span>{formatPrice(totalPrice)}</span>
              </AddProductsPriceInfoItem>
              <AddProductsPriceInfoItem textsize={16}>
                <span>Taxa de entrega:</span>
                {/* <span>{formatPrice(String(taxService)) || formatPrice(String(parseAddress))}</span> */}
                <span>R$ {taxService || parseAddress}</span>
              </AddProductsPriceInfoItem>
            </>
          )}
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
              {parseAddress ? formatPrice(totalPrice + parseAddress) : formatPrice(totalPrice)}
            </motion.span>
          </AnimatePresence>
        </AddProductsPriceInfoItem>
      </AddProductsPriceItem>

      {
        desconto ? (
          <ProductsDiscount>
            <ButtonProductsDiscount onClick={() => alert("Desconto inesistente!!!")}>
              <ProductsDiscountContainer>
                <IconTicketFilled className="fill-takeat-neutral-dark text-2xl" />
                <ProductsDiscountText>Adicionar desconto</ProductsDiscountText>
              </ProductsDiscountContainer>
              <IconChevronRight className="fill-takeat-neutral-dark text-lg" />
            </ButtonProductsDiscount>
          </ProductsDiscount>
        ) : ''}

      <ActionProducts>
        {
          clear && (
            <SelectAddProducts style={{ height: 48 }}>
              <button onClick={() => localStorage.removeItem(takeatBagKey)}>
                <span className='text-takeat-primary-default font-semibold'>Limpar</span>
              </button>
            </SelectAddProducts>
          )
        }
        {
          finishOrder ? (
            <AddProductsQuantity disabled={!(totalPrice > Number(active))} style={{ height: 48 }}>
              <TextAddProductsQuantity disabled={!(totalPrice > Number(active))} onClick={handleCreateOrder}>
                {!(totalPrice > Number(active)) ? `Pedido mín: ${formatPrice(`${active}`)}` : `${textButon || 'Continuar Pedido'}`}
              </TextAddProductsQuantity>
            </AddProductsQuantity>
          ) : (
            <AddProductsQuantity disabled={!(totalPrice > Number(active))} style={{ height: 48 }}>
              <TextAddProductsQuantity disabled={!(totalPrice > Number(active))} onClick={() => push(`/${params}/${route}`)}>
                {!(totalPrice > Number(active)) ? `Pedido mín: ${formatPrice(`${active}`)}` : `${textButon || 'Continuar Pedido'}`}
              </TextAddProductsQuantity>
            </AddProductsQuantity>
          )
        }
      </ActionProducts>

      <Modal open={openModal} style={{
        height: "fit-content"
      }}>
        <Modal.Header className='text-center'>
          <h2>Copie e cole o código pix</h2>
        </Modal.Header>
        <Modal.Body>
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-full gap-2">
              <input
                className='w-3/4 border p-3 rounded-lg cursor-pointer hover:bg-takeat-neutral-lightest'
                id="link"
                defaultValue={modalGen?.zoop_id}
                readOnly
                onClick={() => {
                  navigator.clipboard.writeText(modalGen?.zoop_id || "");
                  alert("Código copiado com sucesso!");
                }}
              />

              <button className='border p-3 rounded-lg hover:bg-takeat-neutral-lightest'
                onClick={() => {
                  navigator.clipboard.writeText(modalGen?.zoop_id || "");
                  alert("Código copiado com sucesso!");
                }}><Copy /></button>
            </div>
          </div>

          <div className="flex w-full gap-3 px-6 pt-6">
            <button onClick={() => handleConfirmPix()} className='px-3 py-2 w-full border rounded-lg font-semibold text-white bg-takeat-primary-default hover:bg-takeat-primary-default/80 text-center flex items-center justify-center'>{!confirmPix ? "Confirmar pagamento" : <Loader2 className='animate-spin' />}</button>
          </div>
        </Modal.Body>
      </Modal>
    </AddProductsContainer>
  )
}