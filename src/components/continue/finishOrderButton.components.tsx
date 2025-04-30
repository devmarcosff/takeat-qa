import { IAgendamento } from '@/app/[restaurants]/(pages)/confirmar-pedido/page';
import { useDelivery } from '@/context/DeliveryContext';
import { usePayment } from '@/context/PaymentContext';
import { api_confirm_pix, api_create_order, api_scheduling } from '@/utils/apis';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Copy, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { formatPrice, IconChevronRight, IconTicketFilled, Modal } from 'takeat-design-system-ui-kit';
import { ActionProducts, AddProductsContainer, AddProductsPriceInfoItem, AddProductsPriceItem, AddProductsQuantity, ButtonProductsDiscount, ProductsDiscount, ProductsDiscountContainer, ProductsDiscountText, TextAddProductsQuantity } from '../addProducts/addProducts.style';
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
type RestaurantRef = { id: string };
type AddressRef = { id: string; delivery_tax_price: string };
type CartRef = { products: Product[] };
type MethodPaymentRef = { keyword: string; id?: number };

export default function FinishOrderButton({
  params,
  textButon,
  desconto,
  finishOrder
}: Props) {
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
  const { push } = useRouter();
  const { cuponValue, cashbackValue, setPaymentOrderId, setOrderId } = useDelivery()
  const { paymentStatus, paymentOrderId, connectWebhook } = usePayment();

  const cardTokenRef = useRef<string | null>(null);
  const restaurantIdRef = useRef<RestaurantRef | null>(null);
  const addressClientRef = useRef<AddressRef | null>(null);
  const cartRef = useRef<CartRef | null>(null);
  const methodPaymentRef = useRef<MethodPaymentRef | null>(null);

  const updateStorageData = useCallback(() => {
    const storedBag = localStorage.getItem(takeatBagKey);
    const parsedBag = storedBag ? JSON.parse(storedBag)?.products || [] : [];

    const total = parsedBag.reduce((acc: number, item: ICart) => acc + (item.price * item.qtd), 0);
    setTotalPrice(Number(total.toFixed(2)));
  }, [takeatBagKey]);

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
            acc[categoryId] = {
              id: Number(categoryId),
              complements: [],
              additional: complement.additional || false
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
        orderItem.complement_categories = Object.values(complementsByCategory);
      }

      return orderItem;
    });

    const payload = {
      payment_method: parsedMethodPayment?.keyword, // Método de pagamento
      payment_method_id: parsedMethodPayment?.id || null, // ID do método de pagamento
      payment_token: cardToken ? JSON.parse(cardToken) : null, //  Token do cartão
      restaurant_id: parsedRestaurantId?.id, // ID do restaurante
      buyer_address_id: parsedAddressClient?.id ? Number(parsedAddressClient.id) : null, // Se Delivery ou agendamento de Delivery
      with_withdrawal: isMethodDelivery.method === 'Agendamento Retirada' || isMethodDelivery.method === 'retirarBalcao' ? true : false, // Se for agendamento de entrega
      will_receive_sms: true, // Se receber SMS
      details: "", // Detalhes do pedido
      coupon_code: cuponValue.code || '', // Código do cupom
      rescue: cashbackValue || '', // Cashback
      scheduled_time: scheduling.hour || '', // Se for agendamento de retirada
      user_change: troco || 0, // Se existir troco
      order: orders, // Objeto de produtos
    };

    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (scheduling.method === 'Agendamento Delivery' || scheduling.method === 'Agendamento Retirada') {
      api_scheduling.post('/orders', payload, config)
        .then(res => {
          if (res.data?.data?.session?.id && res.data?.pix_info) {
            const sessionId = res.data.data.session.id;
            const zoopId = res.data.pix_info.zoop_id;
            setPaymentOrderId(sessionId);
            // Connect to webhook com os IDs específicos do PIX
            if (token) {
              connectWebhook(token, sessionId, zoopId);
            }
            setModalGen(res.data.pix_info);
            setOpenModal(true);
          } else {
            const orderId = res.data.data.session.id;
            setOrderId(orderId);
            push(`/${params}/pedido-realizado`);
            setTimeout(() => {
              localStorage.removeItem(takeatBagKey);
              localStorage.removeItem(MethodPaymentTakeat);
              localStorage.removeItem(methodDeliveryTakeat);
              localStorage.removeItem(storageTakeat);
              localStorage.removeItem(useChange);
            }, 1000)
          }
        })
        .catch(err => {
          setOpenErrorModal(true)
          console.log(err)
          setErrorInfo((err.response?.data?.message || 'Erro ao processar o pedido'))
        });
    } else {
      api_create_order.post('/orders', payload, config)
        .then(res => {
          if (res.data?.data?.session?.id && res.data?.pix_info) {
            const sessionId = res.data.data.session.id;
            const zoopId = res.data.pix_info.zoop_id;
            setPaymentOrderId(sessionId);
            // Connect to webhook com os IDs específicos do PIX
            if (token) {
              connectWebhook(token, sessionId, zoopId);
            }
            setModalGen(res.data.pix_info);
            setOpenModal(true);
          } else {
            const orderId = res.data.data.session.id;
            setOrderId(orderId);
            push(`/${params}/pedido-realizado`);
            setTimeout(() => {
              localStorage.removeItem(takeatBagKey);
              localStorage.removeItem(MethodPaymentTakeat);
              localStorage.removeItem(methodDeliveryTakeat);
              localStorage.removeItem(storageTakeat);
              localStorage.removeItem(useChange);
            }, 1000)
          }
        })
        .catch(err => {
          setOpenErrorModal(true)
          setErrorInfo((err.response?.data?.message || 'Erro ao processar o pedido'))
        });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // const parsedStorage = localStorage.getItem(storageTakeat);
      // if (parsedStorage) {
      //   setActive(Number(parsedStorage));
      // }

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

  // Add effect to handle payment status changes
  useEffect(() => {
    if (paymentStatus === 'confirmed' && paymentOrderId) {
      push(`/${params}/pedido-realizado?orderId=${paymentOrderId}`);
      setTimeout(() => {
        localStorage.removeItem(takeatBagKey);
        localStorage.removeItem(MethodPaymentTakeat);
        localStorage.removeItem(methodDeliveryTakeat);
        localStorage.removeItem(storageTakeat);
        localStorage.removeItem(useChange);
      }, 1000);
    }
  }, [paymentStatus, paymentOrderId, params, push]);

  const HeightCheckout = () => {
    if (isMethodDelivery.method === 'retirarBalcao' || isMethodDelivery.method === 'Agendamento Retirada') {
      if (cuponValue.code || cashbackValue) return 170;
      return 150
    }

    if (isMethodDelivery.method === 'delivery' || isMethodDelivery.method === 'Agendamento Delivery') {
      if (cuponValue.code || cashbackValue) return 200;
      return 170
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
        const orderId = res.data.data.session.id;
        setOrderId(orderId);
        push(`/${params}/pedido-realizado`);
      } else {
        setConfirmPix(false)
      }
    }).catch(() => setConfirmPix(false))
  }

  const handleAddCupom = () => {
    // Se for delivery ou agendamento delivery, inclui taxa de entrega
    const includeDeliveryTax = isMethodDelivery.method === "delivery" || isMethodDelivery.method === "Agendamento Delivery";
    let total = includeDeliveryTax ? totalPrice + parseAddress : totalPrice;

    // Aplica desconto do cupom se existir
    if (cuponValue.code) {
      if (cuponValue.discount_type === 'percentage') {
        total = total - (totalPrice * cuponValue.discount);
      } else if (cuponValue.discount_type === 'absolute') {
        total = total - cuponValue.discount;
      } else if (cuponValue.discount_type === 'free-shipping') {
        total = totalPrice;
      }
    }

    // Aplica desconto do cashback se existir
    if (cashbackValue) {
      total = total - Number(cashbackValue);
    }

    return formatPrice(total);
  };

  const [showPixSteps, setShowPixSteps] = useState(false);

  return (
    <AddProductsContainer flex_direction={"column"} height={HeightCheckout()}>
      <AddProductsPriceItem>
        {/* Delivery e Agendamento Delivery */}
        {(isMethodDelivery.method === "delivery" || isMethodDelivery.method === "Agendamento Delivery") && (
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
            {cuponValue.code && (
              <AddProductsPriceInfoItem textsize={16}>
                <span>Cupom</span>
                {cuponValue.discount_type === 'percentage' ? (
                  <span className="text-takeat-red-default">-{formatPrice(totalPrice * cuponValue.discount)}</span>
                ) : cuponValue.discount_type === 'absolute' ? (
                  <span className="text-takeat-red-default">-{formatPrice(cuponValue.discount)}</span>
                ) : (
                  <span className="text-takeat-green-default">FRETE GRATIS</span>
                )}
              </AddProductsPriceInfoItem>
            )}
            {cashbackValue && (
              <AddProductsPriceInfoItem textsize={16}>
                <span>Resgate de cashback</span>
                <span className="text-takeat-red-default">-{formatPrice(Number(cashbackValue))}</span>
              </AddProductsPriceInfoItem>
            )}
          </>
        )}

        {/* Retirada no Balcão e Agendamento Retirada */}
        {(isMethodDelivery.method === "retirarBalcao" || isMethodDelivery.method === "Agendamento Retirada") && (
          <>
            <AddProductsPriceInfoItem textsize={16}>
              <span>Subtotal:</span>
              <span>{formatPrice(totalPrice)}</span>
            </AddProductsPriceInfoItem>
            {cuponValue.code && (
              <AddProductsPriceInfoItem textsize={16}>
                <span>Cupom</span>
                {cuponValue.discount_type === 'percentage' ? (
                  <span className="text-takeat-red-default">-{formatPrice((totalPrice * (cuponValue.discount * 100)) / 100)}</span>
                ) : cuponValue.discount_type === 'absolute' ? (
                  <span className="text-takeat-red-default">-{formatPrice(cuponValue.discount)}</span>
                ) : <span className="text-takeat-green-default">FRETE GRATIS</span>}
              </AddProductsPriceInfoItem>
            )}
            {cashbackValue && (
              <AddProductsPriceInfoItem textsize={16}>
                <span>Resgate de cashback</span>
                <span className="text-takeat-red-default">-{formatPrice(Number(cashbackValue))}</span>
              </AddProductsPriceInfoItem>
            )}
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
              {handleAddCupom()}
            </motion.span>
          </AnimatePresence>
        </AddProductsPriceInfoItem>
      </AddProductsPriceItem>

      {!!desconto && (
        <ProductsDiscount>
          <ButtonProductsDiscount onClick={() => alert("Desconto inesistente!!!")}>
            <ProductsDiscountContainer>
              <IconTicketFilled className="fill-takeat-neutral-dark text-2xl" />
              <ProductsDiscountText>Adicionar desconto</ProductsDiscountText>
            </ProductsDiscountContainer>
            <IconChevronRight className="fill-takeat-neutral-dark text-lg" />
          </ButtonProductsDiscount>
        </ProductsDiscount>
      )}

      <ActionProducts>
        {!!finishOrder && (
          <AddProductsQuantity style={{ height: 48 }}>
            <TextAddProductsQuantity disabled={loading} onClick={handleCreateOrder}>
              {loading ? <Loader2 className='animate-spin flex w-full justify-center items-center' /> : textButon}
            </TextAddProductsQuantity>
          </AddProductsQuantity>
        )
        }
      </ActionProducts>

      <Modal open={openModal} toggle={() => {
        setOpenModal(!openModal)
        setLoading(false)
      }} style={{
        height: "fit-content"
      }}>
        <Modal.Header className='text-center'>
          <h2>Pagamento via PIX</h2>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
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

            <div className={`${showPixSteps && 'border rounded-lg'}`}>
              <button
                onClick={() => setShowPixSteps(!showPixSteps)}
                className="w-full flex items-center justify-between p-2 hover:bg-takeat-neutral-lightest rounded-lg"
              >
                <span className='text-sm'>Como pagar com PIX</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showPixSteps ? 'rotate-180' : ''}`} />
              </button>

              {showPixSteps && (
                <div className="p-4 pt-0">
                  <ol className="list-decimal pl-4 space-y-2 text-sm text-takeat-neutral-darker">
                    <li>Abra o aplicativo do seu banco</li>
                    <li>Selecione a opção PIX</li>
                    <li>Escolha a opção &quot;Pix Copia e Cola&quot;</li>
                    <li>Cole o código PIX copiado</li>
                    <li>Confirme os dados e finalize o pagamento</li>
                    <li>Após o pagamento, clique em &quot;Confirmar pagamento&quot;</li>
                  </ol>
                </div>
              )}
            </div>

            <div className="flex w-full gap-3 pt-2">
              <button onClick={() => handleConfirmPix()} className='px-3 py-2 w-full border rounded-lg font-semibold text-white bg-takeat-primary-default hover:bg-takeat-primary-default/80 text-center flex items-center justify-center'>
                {!confirmPix ? "Confirmar pagamento" : <Loader2 className='animate-spin' />}
              </button>
            </div>
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