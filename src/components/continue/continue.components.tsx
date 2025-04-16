import { IAgendamento } from '@/app/[restaurants]/(pages)/confirmar-pedido/page';
import { useDelivery } from '@/context/DeliveryContext';
import { api_confirm_pix, api_create_order, api_scheduling } from '@/utils/apis';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { formatPrice, IconChevronRight, IconTicketFilled, Modal } from 'takeat-design-system-ui-kit';
import { ActionProducts, AddProductsContainer, AddProductsPriceInfoItem, AddProductsPriceItem, AddProductsQuantity, ButtonProductsDiscount, ProductsDiscount, ProductsDiscountContainer, ProductsDiscountText, SelectAddProducts, TextAddProductsQuantity } from '../addProducts/addProducts.style';
import { ICart } from '../addProducts/addProducts.types';
import { ComplementCategory, OrderItem, Product } from './continue.types';

interface Props {
  params: string,
  route?: string,
  clear?: boolean,
  textButon?: string,
  taxservice?: number,
  desconto?: boolean,
  finishOrder?: boolean,
}
type RestaurantRef = { id: string }; // ou o que vier do seu localStorage
type AddressRef = { id: string; delivery_tax_price: string }; // ajuste conforme necessário
// type Product = {
//   categoryId: number;
//   qtd: number;
//   complements?: {
//     categoryId: number;
//     complementId: number;
//     name: string;
//     price: number;
//     qtd: number;
//   }[];
// };
type CartRef = { products: Product[] };
type MethodPaymentRef = { keyword: string; id?: number };


export default function ContinueComponents({ params, route, clear, textButon, desconto, finishOrder }: Props) {
  const MethodPaymentTakeat = `@methodPaymentTakeat:${params}`;
  const takeatBagKey = `@deliveryTakeat:${params}TakeatBag`;
  const deliveryTakeatRestaurant = `@deliveryTakeatRestaurant:${params}`;
  const storageTakeat = `@deliveryTakeat:${params}`;
  const tokenClient = `@tokenUserTakeat:${params}`
  const methodDelivery = `@methodDeliveryTakeat:${params}`
  const tokenCard = `@tokenCardUserTakeat:${params}`;
  const addressClientDelivery = `@addressClientDeliveryTakeat:${params}`;
  const methodDeliveryTakeat = `@methodDeliveryTakeat:${params}`;
  const useChange = `@useChange:${params}`;
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [active, setActive] = useState<number>(0)
  const [openModal, setOpenModal] = useState(false)
  const [confirmPix, setConfirmPix] = useState(false)
  const [modalGen, setModalGen] = useState<{ qrcode: string, zoop_id: string }>()
  const [openErrorModal, setOpenErrorModal] = useState<boolean>()
  const [errorInfo, setErrorInfo] = useState<string>('')
  const [parseAddress, setParseAddress] = useState<number>(0)
  const [isMethodDelivery, setIsMethodDelivery] = useState<IAgendamento>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [scheduling, setScheduling] = useState<IAgendamento>({})
  const [troco, setTroco] = useState<number>(0)
  // const [cupomValue, setCupomValue] = useState<number>(0)
  const { push } = useRouter();

  const { cuponValue } = useDelivery()

  const updateStorageData = useCallback(() => {
    const storedBag = localStorage.getItem(takeatBagKey);
    const parsedBag = storedBag ? JSON.parse(storedBag)?.products || [] : [];

    const total = parsedBag.reduce((acc: number, item: ICart) => acc + (item.price * item.qtd), 0);
    setTotalPrice(Number(total.toFixed(2)));
  }, [takeatBagKey]);

  const cardTokenRef = useRef<string | null>(null);
  const restaurantIdRef = useRef<RestaurantRef | null>(null);
  const addressClientRef = useRef<AddressRef | null>(null);
  const cartRef = useRef<CartRef | null>(null);
  const methodPaymentRef = useRef<MethodPaymentRef | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      cardTokenRef.current = localStorage.getItem(tokenCard);

      const getMethodDeliveryTakeat = localStorage.getItem(methodDeliveryTakeat);
      if (getMethodDeliveryTakeat) {
        const parsedMethodDeliveryTakeat = JSON.parse(getMethodDeliveryTakeat);
        setScheduling(parsedMethodDeliveryTakeat)
      }

      const storageRestaurantId = localStorage.getItem(deliveryTakeatRestaurant);
      restaurantIdRef.current = JSON.parse(`${storageRestaurantId}`);

      const address = localStorage.getItem(addressClientDelivery);
      addressClientRef.current = address ? JSON.parse(address) : null;

      const cart = localStorage.getItem(takeatBagKey);
      cartRef.current = cart ? JSON.parse(cart) : { products: [] };

      const methodPayment = localStorage.getItem(MethodPaymentTakeat);
      methodPaymentRef.current = methodPayment ? JSON.parse(methodPayment) : null;
    }
  }, []);

  const handleCreateOrder = () => {
    setLoading(true)
    const token = localStorage.getItem(tokenClient);

    const parsedMethodPayment = methodPaymentRef.current;
    const parsedRestaurantId = restaurantIdRef.current;
    const parsedAddressClient = addressClientRef.current;
    const parsedCart = cartRef.current ?? { products: [] };
    const cardToken = cardTokenRef.current;

    const orders: OrderItem[] = parsedCart.products.map((product) => {
      const orderItem: OrderItem = {
        id: product.categoryId,
        amount: product.use_weight == false ? product.qtd : 1,
        weight: product.use_weight == true ? `${product.qtd}` : undefined,
        use_weight: product.use_weight,
        observation: product.observation,
        complement_categories: [],
      };

      if (product.complements?.length) {
        const complementsByCategory = product.complements.reduce((acc, complement) => {
          const categoryId = complement.categoryId;
          if (!acc[categoryId]) {
            acc[categoryId] = { id: Number(categoryId), complements: [] };
          }
          acc[categoryId].complements.push({
            id: Number(complement.complementId),
            name: complement.name,
            price: complement.price,
            amount: complement.qtd,
          });
          return acc;
        }, {} as Record<string, ComplementCategory>);
        orderItem.complement_categories = Object.values(complementsByCategory);
      }

      return orderItem;
    });

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const payload = {
      payment_method: parsedMethodPayment?.keyword, // Método de pagamento
      payment_method_id: parsedMethodPayment?.id || null, // ID do método de pagamento
      payment_token: cardToken ? JSON.parse(cardToken) : null, //  Token do cartão
      restaurant_id: parsedRestaurantId?.id, // ID do restaurante
      buyer_address_id: parsedAddressClient?.id || null, // Se Delivery ou agendamento de Delivery
      with_withdrawal: isMethodDelivery.method === 'Agendamento Retirada' || isMethodDelivery.method === 'retirarBalcao' ? true : false, // Se for agendamento de entrega
      will_receive_sms: true, // Se receber SMS
      details: "", // Detalhes do pedido
      coupon_code: cuponValue.code || '', // Código do cupom
      rescue: 0, // Resgate
      scheduled_time: scheduling.hour || '', // Se for agendamento de retirada
      user_change: troco || 0, // Se existir troco
      order: orders, // Objeto de produtos
    };

    if (scheduling.method === 'Agendamento Delivery' || scheduling.method === 'Agendamento Retirada') {
      api_scheduling.post('/orders', payload, config)
        .then(res => {
          setModalGen(res.data.pix_info);
          if (res.data.pix_info) {
            setOpenModal(true);
          } else {
            push(`/${params}/pedido-realizado`);
            setTimeout(() => {
              localStorage.removeItem(takeatBagKey);
              localStorage.removeItem(MethodPaymentTakeat);
              localStorage.removeItem(methodDeliveryTakeat);
              localStorage.removeItem(storageTakeat);
              localStorage.removeItem(useChange);
              // setLoading(false)
            }, 1000)
          }
        })
        .catch(err => {
          setOpenErrorModal(true)
          setErrorInfo((err.response.data.message))
        });

    } else {
      api_create_order.post('/orders', payload, config)
        .then(res => {
          setModalGen(res.data.pix_info);
          if (res.data.pix_info) {
            setOpenModal(true);
          } else {
            push(`/${params}/pedido-realizado`);
            localStorage.removeItem(takeatBagKey);
            localStorage.removeItem(MethodPaymentTakeat);
            localStorage.removeItem(methodDeliveryTakeat);
            localStorage.removeItem(storageTakeat);
            localStorage.removeItem(useChange);
          }
        })
        .catch(err => {
          setOpenErrorModal(true)
          setErrorInfo((err.response.data.message))
        });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const parsedStorage = localStorage.getItem(storageTakeat);
      if (parsedStorage) {
        setActive(Number(parsedStorage));
      }

      const getMethodDelivery = localStorage.getItem(methodDelivery);
      if (getMethodDelivery) {
        const parsedMethodDelivery = JSON.parse(getMethodDelivery);
        setIsMethodDelivery(parsedMethodDelivery);
      }

      const getTroco = localStorage.getItem(useChange);
      if (getTroco) {
        const parsedTroco = JSON.parse(getTroco);
        setTroco(parsedTroco);
      }

      const address = localStorage.getItem(addressClientDelivery);
      if (address) {
        const parsedAddress = JSON.parse(address);
        const intTax = Number(parsedAddress.delivery_tax_price);
        setParseAddress(intTax);
      }

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
    updateStorageData,
  ]);


  const HeightCheckout = () => {
    if (isMethodDelivery.method === "delivery" || isMethodDelivery.method === "Agendamento Delivery") {
      if (cuponValue.code) {
        return 200
      } else {
        return 170
      }
    } else {
      return 120
    }
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

  const handleAddCupom = () => {
    if (cuponValue.discount_type === 'percentage') {
      return formatPrice((totalPrice + parseAddress) - (totalPrice * cuponValue.discount / 100))
    } else if (cuponValue.discount_type === 'absolute') {
      return formatPrice((totalPrice + parseAddress) - cuponValue.discount)
    } else if (cuponValue.discount_type === 'free-shipping') {
      return formatPrice(totalPrice)
    }

    return formatPrice(totalPrice + parseAddress)
  };

  return (
    <AddProductsContainer flex_direction={"column"} height={HeightCheckout()}>
      <AddProductsPriceItem>
        {isMethodDelivery.method === "delivery" ? (
          <>
            <AddProductsPriceInfoItem textsize={16}>
              <span>Subtotal:</span>
              <span>{formatPrice(totalPrice)}</span>
            </AddProductsPriceInfoItem>
            <AddProductsPriceInfoItem textsize={16}>
              <span>Taxa de entrega:</span>
              <span>
                {cuponValue.discount_type === 'free-shipping' ? (
                  formatPrice(0)
                ) : (
                  formatPrice(parseAddress)
                )}
              </span>
            </AddProductsPriceInfoItem>
            {
              cuponValue.code && (
                <AddProductsPriceInfoItem textsize={16}>
                  <span>Cupom</span>
                  {
                    cuponValue.discount_type === 'percentage' ? (
                      <span>{formatPrice((totalPrice * cuponValue.discount) / 100)}</span>
                    ) : cuponValue.discount_type === 'absolute' ? (
                      <span>{totalPrice - cuponValue.discount < 0 ? `- ${formatPrice(totalPrice)}` : `- ${formatPrice(cuponValue.discount)}`}</span>
                    ) : (
                      <span>FRETE GRATIS</span>
                    )
                  }
                </AddProductsPriceInfoItem>
              )
            }

            {/* {cuponValue.code && handleAddCupom()} */}
          </>
        ) : isMethodDelivery.method === "Agendamento Delivery" ? (
          <>
            <AddProductsPriceInfoItem textsize={16}>
              <span>Subtotal:</span>
              <span>{formatPrice(totalPrice)}</span>
            </AddProductsPriceInfoItem>
            <AddProductsPriceInfoItem textsize={16}>
              <span>Taxa de entrega:</span>
              <span>{formatPrice(parseAddress)}</span>
            </AddProductsPriceInfoItem>
          </>
        ) : ''
        }

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
              {handleAddCupom()}
              {/* {isMethodDelivery.method === "delivery" || isMethodDelivery.method === "Agendamento Delivery" ? formatPrice(totalPrice + parseAddress) : formatPrice(totalPrice)} */}
            </motion.span>
          </AnimatePresence>
        </AddProductsPriceInfoItem>

      </AddProductsPriceItem>

      {!!desconto ? (
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
        {!!clear && (
          <SelectAddProducts style={{ height: 48 }}>
            <button onClick={() => localStorage.removeItem(takeatBagKey)}>
              <span className='text-takeat-primary-default font-semibold'>Limpar</span>
            </button>
          </SelectAddProducts>
        )}
        {!!finishOrder ? (
          <AddProductsQuantity style={{ height: 48 }}>
            <TextAddProductsQuantity disabled={loading} onClick={handleCreateOrder}>
              {
                !(totalPrice > Number(active)) ? `Pedido mín: ${formatPrice(`${active}`)}`
                  : <>
                    {loading ? <Loader2 className='animate-spin flex w-full justify-center items-center' /> : textButon}
                  </>}
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
          <div className="flex items-center w-full">
            <div className="flex items-center justify-center w-full gap-2">
              <input
                className='w-full border p-3 rounded-lg cursor-pointer hover:bg-takeat-neutral-lightest'
                id="link"
                defaultValue={modalGen?.qrcode}
                readOnly
                onClick={() => {
                  navigator.clipboard.writeText(modalGen?.qrcode || "");
                  alert("Código copiado com sucesso!");
                }}
              />

              <button className='border p-3 rounded-lg hover:bg-takeat-neutral-lightest'
                onClick={() => {
                  navigator.clipboard.writeText(modalGen?.qrcode || "");
                  alert("Código copiado com sucesso!");
                }}><Copy /></button>
            </div>
          </div>

          <div className="flex w-full gap-3 pt-6">
            <button onClick={() => handleConfirmPix()} className='px-3 py-2 w-full border rounded-lg font-semibold text-white bg-takeat-primary-default hover:bg-takeat-primary-default/80 text-center flex items-center justify-center'>{!confirmPix ? "Confirmar pagamento" : <Loader2 className='animate-spin' />}</button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal open={openErrorModal} style={{
        height: "fit-content"
      }}>
        <Modal.Header className='text-center'>
          <h2>Algo inesperado aconteceu!</h2>
        </Modal.Header>
        <Modal.Body>
          <span>{errorInfo}</span>
          <div className="flex w-full gap-3 pt-6">
            <Link href={`/${params}`} className='px-3 py-2 w-full border rounded-lg font-semibold text-white bg-takeat-primary-default hover:bg-takeat-primary-default/80 text-center flex items-center justify-center'>{!confirmPix ? "Voltar ao início" : <Loader2 className='animate-spin' />}</Link>
          </div>
        </Modal.Body>
      </Modal>
    </AddProductsContainer>
  )
}