import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscountAlertModal from "@/components/uiComponents/Modal/discountAlert.modal";
import { useDelivery } from "@/context/DeliveryContext";
import { api_Club } from "@/utils/apis";
import axios from "axios";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { formatPrice } from "takeat-design-system-ui-kit";
import { IClientClube, IClienteTakeat } from "./page";
import { ICashbackDrawer } from "./types";

interface ICashProps {
  openDrawer?: boolean;
  setOpenDrawer?: () => void;
  isClientClube: IClientClube,
  isClienteTakeat?: IClienteTakeat
}

export default function CashbackDrawer({ openDrawer, setOpenDrawer, isClientClube, isClienteTakeat }: ICashProps) {
  const params = useParams()
  const [birthdate, setBirthdate] = useState('');
  const [cashbackDrawer, setCashbackDrawer] = useState<ICashbackDrawer[]>([]);
  const [cuponSelect, setCuponSelect] = useState<ICashbackDrawer>({} as ICashbackDrawer);
  const [confirmCashback, setConfirmCashback] = useState<ICashbackDrawer>({} as ICashbackDrawer);
  const [isRescue, setIsRescue] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [showDiscountAlert, setShowDiscountAlert] = useState(false);
  const [discountType, setDiscountType] = useState<'coupon' | 'cashback'>('coupon');
  const [discountValue, setDiscountValue] = useState('');

  const { setCuponValue, setCashbackValue } = useDelivery()

  useEffect(() => {
    const restaurant = `@deliveryTakeatRestaurant:${params.restaurants}`
    const getRestaurantId = localStorage.getItem(restaurant)
    if (getRestaurantId) {
      const parsedRestaurant = JSON.parse(getRestaurantId)
      setConfirmCashback(parsedRestaurant)
      axios.get(`https://backend-gd.takeat.app/public/discount-coupons/restaurant/${parsedRestaurant.id}/delivery`).then(res => {
        // Filtra apenas cupons ativos
        const activeCoupons = res.data.filter((coupon: ICashbackDrawer) => coupon.is_active);
        setCashbackDrawer(activeCoupons);
      }).catch(err => console.log(err))
    }

    // Pega o preço total do carrinho
    const takeatBagKey = `@deliveryTakeat:${params.restaurants}TakeatBag`;
    const storedBag = localStorage.getItem(takeatBagKey);
    if (storedBag) {
      const parsedBag = JSON.parse(storedBag)?.products || [];
      const total = parsedBag.reduce((acc: number, item: { price: number, qtd: number }) => acc + (item.price * item.qtd), 0);
      setTotalPrice(Number(total.toFixed(2)));
    }
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Remove todos os caracteres que não sejam dígitos
    let input = e.target.value.replace(/\D/g, '');
    // Insere a barra após os 2 primeiros dígitos (dia)
    if (input.length > 2) {
      input = input.slice(0, 2) + '/' + input.slice(2);
    }
    // Insere a segunda barra após os próximos 2 dígitos (mês)
    if (input.length > 5) {
      input = input.slice(0, 5) + '/' + input.slice(5);
    }
    // Limita para 10 caracteres (DD/MM/AAAA)
    setBirthdate(input.slice(0, 10));
  };

  const handleSelect = (item: ICashbackDrawer) => {
    // Verifica se o preço total atende ao preço mínimo do cupom
    if (item.minimum_price && Number(totalPrice) < Number(item.minimum_price)) {
      alert(`Este cupom só pode ser aplicado em pedidos acima de ${formatPrice(item.minimum_price)}`);
      return;
    }
    setCuponSelect(item);
  };

  const handleCashbackSelect = () => {
    if (isRescue) {
      setCashbackValue(isClientClube.totalClientCashback);
      setDiscountType('cashback');
      setDiscountValue(formatPrice(isClientClube.totalClientCashback));
      setShowDiscountAlert(true);
    }
  }

  const handleAddCupom = () => {
    if (!cuponSelect.id) return;

    // Verifica se o preço total atende ao preço mínimo do cupom
    if (cuponSelect.minimum_price && Number(totalPrice) < Number(cuponSelect.minimum_price)) {
      alert(`Este cupom só pode ser aplicado em pedidos acima de ${formatPrice(cuponSelect.minimum_price)}`);
      return;
    }

    // Verifica se o desconto não ultrapassa o máximo permitido
    if (cuponSelect.discount_type === 'percentage' && cuponSelect.maximum_discount) {
      const discountValue = totalPrice * cuponSelect.discount;
      if (discountValue > Number(cuponSelect.maximum_discount)) {
        alert(`O desconto máximo para este cupom é de ${formatPrice(cuponSelect.maximum_discount)}`);
        return;
      }
    }

    setCuponValue(cuponSelect);
    setDiscountType('coupon');
    setDiscountValue(cuponSelect.code);
    setShowDiscountAlert(true);
  };

  const ViewTab = () => {
    const hasCashback = isClientClube.clientExist === true &&
      isClientClube.clientBelongsToStore === true &&
      Number(isClientClube.totalClientCashback) > Number(isClientClube.minimum_rescue);
    const hasCoupons = cashbackDrawer.length > 0;

    if (!hasCashback && !hasCoupons) {
      return (
        <div className="w-full text-center py-4">
          <p className="text-takeat-neutral-darker">Não existem cupons disponíveis.</p>
        </div>
      );
    }

    if (hasCashback) {
      const tel = isClienteTakeat ? isClienteTakeat.tel.replace(/[-\s]/g, '') : ''
      const payload = {
        birthday: birthdate,
        phone: tel,
        token: confirmCashback.token_clube
      }
      api_Club.post('/takeat/confirm-birthday', payload).then(res => setIsRescue(res.data.success ? true : false)).catch(err => console.log(err))
    }

    return (
      <>
        {hasCashback && (
          <TabsTrigger value="cashback" className="w-full py-2 m-0 border border-takeat-neutral-darker rounded-r-none data-[state=active]:!bg-takeat-neutral-darker data-[state=active]:!text-white">
            Cashback
          </TabsTrigger>
        )}
        {hasCoupons && (
          <TabsTrigger value="cupons" className={`w-full py-2 m-0 border border-takeat-neutral-darker ${hasCashback ? 'rounded-l-none' : ''} data-[state=active]:!bg-takeat-neutral-darker data-[state=active]:!text-white`}>
            Cupons
          </TabsTrigger>
        )}
      </>
    );
  }

  return (
    <>
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Escolha uma opção de desconto</DrawerTitle>
          </DrawerHeader>

          <div className="w-full px-4">
            <Tabs defaultValue={Number(isClientClube.totalClientCashback) != 0 ? 'cashback' : 'cupons'} className="w-full flex flex-col">

              <TabsList className="bg-transparent">
                {ViewTab()}
              </TabsList>

              <TabsContent value="cashback">
                <div className="bg-takeat-neutral-lightest py-5 rounded-xl flex flex-col px-4 gap-2">
                  <span>Saldo de Cashback:</span>
                  <span className="text-takeat-green-default font-semibold">{formatPrice(isClientClube.totalClientCashback)}</span>
                </div>

                <div>
                  <Label className="text-lg">Data de nascimento:</Label>
                  <input
                    type="text"
                    value={birthdate}
                    onChange={handleInputChange}
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="DD/MM/AAAA"
                    className="w-full border border-gray-500 rounded-xl py-2 px-4" />
                </div>

                <DrawerFooter className="flex flex-row w-full justify-between items-center">
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-2/4 text-[16px]">Cancelar</Button>
                  </DrawerClose>
                  <DrawerClose asChild onClick={handleCashbackSelect} disabled={!isRescue && !cuponSelect.id}>
                    <Button className="w-full disabled:bg-takeat-neutral-lighter disabled:text-takeat-neutral-darker text-[16px]">Resgatar</Button>
                  </DrawerClose>
                </DrawerFooter>
              </TabsContent>

              <TabsContent value="cupons">
                <div>
                  <span>Cupons disponíveis:</span>

                  <div className="flex flex-col gap-1 overflow-y-scroll max-h-[350px] my-2 pt-2 border-t">
                    {cashbackDrawer.length === 0 ? (
                      <div className="text-center py-4 text-takeat-neutral-darker">
                        Não há cupons disponíveis no momento.
                      </div>
                    ) : (
                      cashbackDrawer.map((item, index) => {
                        const isSelected = cuponSelect.id === item.id;
                        const isDisabled = item.minimum_price && Number(totalPrice) < Number(item.minimum_price);

                        const DiscountTypes = () => {
                          if (item.discount_type === 'percentage') {
                            return `Desconto ${item.discount * 100}%`
                          } else if (item.discount_type === 'absolute') {
                            return `Desconto ${formatPrice(item.discount)}`
                          } else {
                            return `FRETE GRATIS`
                          }
                        }

                        return (
                          <div
                            key={index}
                            className={`bg-takeat-neutral-white p-4 rounded-xl border ${isSelected ? 'border-takeat-primary-default' : 'border-gray-300'
                              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <RadioGroup onClick={() => !isDisabled && handleSelect(item)}>
                              <label htmlFor={`radio-${index}`} className="cursor-pointer">
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="font-semibold">{item.code}</span>
                                    <span>{DiscountTypes()}</span>
                                    {isDisabled && (
                                      <span className="text-sm text-takeat-neutral-darker">
                                        Pedido mínimo: {formatPrice(item.minimum_price)}
                                      </span>
                                    )}
                                    {item.maximum_discount && (
                                      <span className="text-sm text-takeat-neutral-darker">
                                        Desconto máximo: {formatPrice(item.maximum_discount)}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <RadioGroupItem
                                      id={`radio-${index}`}
                                      value={item.code}
                                      checked={isSelected}
                                      className={isSelected ? 'border-takeat-primary-default text-takeat-primary-default' : 'border-gray-300'}
                                      aria-readonly
                                    />
                                  </div>
                                </div>
                              </label>
                            </RadioGroup>
                            <div className="pt-1 border-t border-gray-300">
                              <Accordion type="single" collapsible>
                                <AccordionItem value="rules" className="border-none">
                                  <AccordionTrigger className="py-2 hover:no-underline">
                                    <span className="flex items-center justify-start gap-2 text-sm text-takeat-neutral-darker">
                                      Ver regras
                                    </span>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="text-sm text-takeat-neutral-darker">
                                      <ul className="list-disc pl-6 space-y-1">
                                        {item.maximum_discount && <li>Máximo de desconto de {formatPrice(item.maximum_discount)}</li>}
                                        {item.minimum_price && <li>{`Pedidos a partir de ${formatPrice(item.minimum_price)}`}</li>}
                                      </ul>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>

                <DrawerFooter className="flex flex-row w-full justify-between items-center">
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-2/4 text-[16px]">Cancelar</Button>
                  </DrawerClose>
                  <DrawerClose asChild onClick={handleAddCupom} disabled={!isRescue && !cuponSelect.id}>
                    <Button className="w-full disabled:bg-takeat-neutral-lighter disabled:text-takeat-neutral-darker text-[16px]">Resgatar</Button>
                  </DrawerClose>
                </DrawerFooter>
              </TabsContent>

            </Tabs>
          </div>
        </DrawerContent>
      </Drawer>
      <DiscountAlertModal
        openModal={showDiscountAlert}
        setOpenModal={setShowDiscountAlert}
        type={discountType}
        value={discountValue}
      />
    </>
  )
}
