"use client";
import ContinueComponents from "@/components/continue/continue.components";
import LoadingTakeat from "@/components/theme/loading.component";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import InformationButton from "@/components/uiComponents/Buttons/informationButton.component";
import InternalPages from "@/components/uiComponents/InternalPageHeader/internal_pages.header";
import { api_delivery, api_token_card } from "@/utils/apis";
import { LoaderCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import errorAnimation from "../../../../../public/assets/erroranimation.json";
import successAnimation from "../../../../../public/assets/succesanimation.json";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface Props {
  params: Promise<{ restaurants: string }>;
}

export interface IPaymentsProps {
  id: number;
  keyword: string;
  brand: string;
  name: string;
  method_online?: boolean;
  restaurant_method: {
    available: boolean;
    delivery_accepts: boolean;
    withdrawal_accepts: boolean;
  }[];
}

interface ICardProps {
  number: string,
  expiryM: string,
  expiryA: string,
  cvc: string,
  name: string,
  focus: string,
}

export default function PagamentoPage({ params }: Props) {
  const restaurant = React.use(params)?.restaurants;
  const { back, push } = useRouter();
  const tokenClient = `@tokenUserTakeat:${restaurant}`;
  const clientCard = `@clientCardTakeat:${restaurant}`;
  const tokenCard = `@tokenCardUserTakeat:${restaurant}`;
  const MethodPaymentTakeat = `@methodPaymentTakeat:${restaurant}`;

  const [isDisabled, setIsDisabled] = useState(true);
  const [methodPayment, setMethodPayment] = useState<IPaymentsProps[]>([]);
  const [parseAddress, setParseAddress] = useState<number>(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "error" | null>(null);

  const [state, setState] = useState<ICardProps>({
    number: "",
    expiryM: "",
    expiryA: "",
    cvc: "",
    name: "",
    focus: "",
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      const address = localStorage.getItem(`@addressClientDeliveryTakeat:${restaurant}`);
      const parseAddress = JSON.parse(`${address}`);
      setParseAddress(Number(parseAddress.delivery_tax_price));

      const storageClientCard = localStorage.getItem(clientCard)
      const parsedCardClient = JSON.parse(`${storageClientCard}`)
      if (storageClientCard) setState(parsedCardClient)

      try {
        const res = await api_delivery.get(`/${restaurant}`);
        setMethodPayment(res.data.payment_methods);
        setIsDisabled(false);
      } catch (error) {
        alert(`Desculpe, ocorreu um erro ao buscar os métodos de pagamento do restaurante.${error}`,);
        back();
      }
    };

    const storedAcceptTerms = localStorage.getItem(`@acceptTerms:${restaurant}`);
    if (storedAcceptTerms) {
      setAcceptTerms(JSON.parse(storedAcceptTerms));
    }

    fetchRestaurant();
  }, [MethodPaymentTakeat, back, clientCard, restaurant]);

  if (isDisabled) return <LoadingTakeat />;

  // Ordenar métodos de pagamento garantindo que um item prioritário fique em primeiro
  const sortPaymentMethods = (methods: IPaymentsProps[], priority: string) => {
    return methods.sort((a, b) => {
      if (a.keyword === priority) return -1;
      if (b.keyword === priority) return 1;
      return 0;
    });
  };

  // Filtrar métodos para "Pagar Online" (PIX_AUTO primeiro)
  const onlinePayments = sortPaymentMethods(
    methodPayment.filter((method) =>
      method.restaurant_method.some((restaurantMethod) => restaurantMethod.delivery_accepts === true)
    ),
    "pix_auto"
  );

  // Filtrar métodos para "Pagar na Entrega" (Dinheiro primeiro)
  const offlinePayments = sortPaymentMethods(
    methodPayment.filter((method) =>
      method.restaurant_method.some((restaurantMethod) => restaurantMethod.withdrawal_accepts === true)
    ),
    "dinheiro"
  );

  const handleInputFocus = (evt: React.FocusEvent<HTMLInputElement>) => setState((prev) => ({ ...prev, focus: evt.target.name }));

  const handlePaymentClick = (method: IPaymentsProps) => {
    const methodPayload = {
      id: method.id,
      keyword: method.keyword,
      name: method.name,
      brand: method.brand,
      method_online: method.restaurant_method.map((restaurantMethod) => restaurantMethod.delivery_accepts).includes(true),
      restaurant_method: method.restaurant_method,
    };
    if (method.keyword === "credit_card_auto") {
      localStorage.setItem(MethodPaymentTakeat, JSON.stringify(methodPayload));
      setOpenDrawer(true);
      console.log("Selecionando método:", method);
    } else {
      localStorage.setItem(MethodPaymentTakeat, JSON.stringify(methodPayload));
      console.log("Selecionando método:", method);
    }
  };

  const handleSaveAndProceed = () => {
    localStorage.setItem(`@acceptTerms:${restaurant}`, JSON.stringify(true));
    setAcceptTerms(true);
    setOpenDialog(false);
    handleSubmit();
  };

  const handleSubmit = () => {
    setIsLoading(true);

    const payload = {
      "holder_name": state.name,
      "expiration_month": state.expiryM,
      "expiration_year": state.expiryA,
      "card_number": state.number,
      "security_code": state.cvc
    }
    const token = localStorage.getItem(tokenClient);
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    api_token_card.post('/token-card', payload, config)
      .then(res => {
        setPaymentStatus("success");
        localStorage.setItem(`@clientCardTakeat:${restaurant}`, JSON.stringify(state));
        localStorage.setItem(tokenCard, JSON.stringify(res.data.id));

        setOpenDrawer(false);
        setOpenResultDialog(true);
        setTimeout(() => {
          push(`/${restaurant}/confirmar-pedido`);
        }, 1500);
      })
      .catch(() => {
        setPaymentStatus("error");
        setOpenDrawer(false);
        setOpenResultDialog(true);
      }).finally(() => setIsLoading(false))
  };

  return (
    <InternalPages title="Pagamento" button>
      <div className="pt-3 mt-3 pb-[250px]">
        <h2 className="font-semibold text-lg">Pagar Online</h2>
        {onlinePayments.map((method) => (
          <InformationButton key={method.id} onClick={() => handlePaymentClick(method)} title={method.name} icon="IconMoney" fill="#27a84c" />
        ))}

        <h2 className="font-semibold text-lg mt-4">Pagar na Entrega</h2>
        {offlinePayments.map((method) => (
          <InformationButton key={method.id} onClick={() => handlePaymentClick(method)} title={method.name} icon="IconMoney" fill="#27a84c" />
        ))}
      </div>

      {/* Drawer para adicionar cartão de crédito */}
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent className="w-full">
          <DrawerHeader>
            <DrawerTitle>Adicionar Cartão de Crédito</DrawerTitle>
          </DrawerHeader>
          <div className="w-full h-full px-3">
            <Cards
              placeholders={{ name: "Nome completo" }}
              number={state.number}
              expiry={`${state.expiryM}/${state.expiryA}`}
              cvc={state.cvc}
              name={state.name}
            />

            {/* Inputs do cartão */}
            <div className="flex flex-col gap-3 w-full mt-3">
              <label htmlFor="number" className="font-medium">Número do cartão</label>
              <input id="number" className="border rounded-lg p-2 w-full" type="text" value={state.number} onChange={(e) => setState({ ...state, number: e.target.value })} onFocus={handleInputFocus} />

              <div className="flex gap-3">
                <div className="w-1/3">
                  <label htmlFor="expiryM" className="font-medium">Mês</label>
                  <input id="expiryM" className="border rounded-lg p-2 w-full" type="text" value={state.expiryM} onChange={(e) => setState({ ...state, expiryM: e.target.value })} onFocus={handleInputFocus} />
                </div>
                <div className="w-1/3">
                  <label htmlFor="expiryA" className="font-medium">Ano</label>
                  <input id="expiryA" className="border rounded-lg p-2 w-full" type="text" value={state.expiryA} onChange={(e) => setState({ ...state, expiryA: e.target.value })} onFocus={handleInputFocus} />
                </div>
                <div className="w-1/3">
                  <label htmlFor="cvc" className="font-medium">CVC</label>
                  <input id="cvc" className="border rounded-lg p-2 w-full" type="text" value={state.cvc} onChange={(e) => setState({ ...state, cvc: e.target.value })} onFocus={handleInputFocus} />
                </div>
              </div>

              <label htmlFor="name" className="font-medium">Nome do titular</label>
              <input id="name" className="border rounded-lg p-2 w-full uppercase" type="text" value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} onFocus={handleInputFocus} />
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose className="w-full border rounded-lg p-2">Cancelar</DrawerClose>
            {acceptTerms ? (
              <button className="w-full bg-takeat-primary-default text-white rounded-lg p-2 flex items-center justify-center" onClick={handleSubmit}>
                {isLoading ? <LoaderCircle className="animate-spin" /> : "Prosseguir"}
              </button>
            ) : (
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger className="w-full bg-takeat-primary-default text-white rounded-lg p-2">Salvar Cartão</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Deseja salvar os dados do cartão?</DialogTitle>
                    <DialogDescription>Os dados salvos são de total responsabilidade do titular.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <button onClick={handleSaveAndProceed} className="bg-green-500 text-white rounded-lg p-2 w-full">Salvar e Prosseguir</button>
                    <DialogClose asChild>
                      <button onClick={handleSubmit} className="border rounded-lg p-2 w-full">Usar desta vez</button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Modal de sucesso ou erro */}
      <Dialog open={openResultDialog} onOpenChange={setOpenResultDialog}>
        <DialogContent>
          <DialogTitle>
            <Lottie loop={false} animationData={paymentStatus === "success" ? successAnimation : errorAnimation} className="w-40 h-40 mx-auto" />
            <p className="text-center font-semibold text-sm">{paymentStatus === "success" ? "Seu cartão foi adicionado e validado com sucesso. Agora você pode utilizá-lo para pagamentos." : "Verifique se os dados do cartão estão corretos ou tente outra forma de pagamento."}</p>
          </DialogTitle>
        </DialogContent>
      </Dialog>

      <ContinueComponents taxservice={parseAddress} desconto params={restaurant} route="confirmar-pedido" />
    </InternalPages>
  );
}