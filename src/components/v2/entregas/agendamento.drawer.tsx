"use client"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api_token_card } from "@/utils/apis";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  openDrawer: boolean,
  setOpenDrawer: (open: boolean) => void,
  title: string,
  description: string,
  restaurant: string
}

export default function AgendamentoDrawerComponent({ openDrawer, setOpenDrawer, title, description, restaurant }: Props) {
  const methodDeliveryTakeat = `@methodDeliveryTakeat:${restaurant}`;
  const deliveryTakeatRestaurant = `@deliveryTakeatRestaurant:${restaurant}`;
  const tokenClient = `@tokenUserTakeat:${restaurant}`;
  const [isScheduling, setIsScheduling] = useState<string[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [hour, setHour] = useState<string>(``)
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const { push } = useRouter()

  const add = () => {
    const mountedAgendamento = {
      method: title,
      month: month,
      day: date?.getDate(),
      hour: hour
    }
    localStorage.setItem(methodDeliveryTakeat, JSON.stringify(mountedAgendamento))
    setOpenDrawer(false)
    if (title === 'Agendamento Retirada') {
      // console.log('Agendamento Retirada')
      push(`/${restaurant}/pagamento`)
    } else {
      // console.log('Agendamento Delivery')
      push(`/${restaurant}/endereco`)
    }
  }

  useEffect(() => {
    if (!date) return;

    const restaurantId = localStorage.getItem(deliveryTakeatRestaurant);
    if (!restaurantId) {
      console.error("No restaurant ID found in localStorage");
      return;
    }

    try {
      const parsedRestaurantId = JSON.parse(restaurantId);
      if (!parsedRestaurantId?.id) {
        console.error("Invalid restaurant ID format");
        return;
      }

      const token = localStorage.getItem(tokenClient);
      if (!token) {
        console.error("No token found");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const formattedDay = date.toISOString();

      api_token_card
        .get(`/order-scheduling/available-times?restaurant_id=${parsedRestaurantId.id}&day=${formattedDay}&with_withdrawal=${title === 'Agendamento Retirada'}`, config)
        .then((response) => {
          setIsScheduling(response.data.times);
        })
        .catch((error) => {
          console.error("Erro ao buscar horários:", error);
          setIsScheduling([]);
        });
    } catch (error) {
      console.error("Error parsing restaurant data:", error);
      setIsScheduling([]);
    }
  }, [date, deliveryTakeatRestaurant, tokenClient, title]);

  return (
    <Drawer open={openDrawer} onOpenChange={() => setOpenDrawer(!openDrawer)}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col w-full px-4 gap-4 my-4">
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="time" className="text-sm font-medium text-gray-700">
              Selecione uma data
            </label>
            <Calendar
              onMonthChange={(month) => setMonth(month?.getMonth() + 1)}
              locale={ptBR}
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow w-full"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="time" className="text-sm font-medium text-gray-700">
              {isScheduling.length > 0 ? 'Selecione o Horário' : 'Nenhum horário disponível'}
            </label>

            <RadioGroup className="grid grid-cols-4 gap-3" onValueChange={(value) => setHour(value)}>
              {isScheduling.map((item, index) => {
                const time = new Date(item).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit"
                })

                return (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={item} id={`time-${index}`} />
                    <Label htmlFor={`time-${index}`}>{time}</Label>
                  </div>
                )
              })}
            </RadioGroup>

          </div>
        </div>

        <DrawerFooter>
          <Button onClick={() => add()} className="w-full">
            Agendar
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Voltar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}