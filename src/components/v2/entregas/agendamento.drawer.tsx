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
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface Props {
  openDrawer: boolean,
  setOpenDrawer: (open: boolean) => void,
  title: string,
  description: string,
  restaurant: string
}

export default function AgendamentoDrawerComponent({ openDrawer, setOpenDrawer, title, description, restaurant }: Props) {
  const methodDeliveryTakeat = `@methodDeliveryTakeat:${restaurant}`;
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [hour, setHour] = useState<string>(`${new Date().getHours()}:${new Date().getMinutes()}`)
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const add = () => {
    const mountedAgendamento = {
      method: title,
      month: month,
      day: date?.getDate(),
      hour: hour
    }
    localStorage.setItem(methodDeliveryTakeat, JSON.stringify(mountedAgendamento))
  }
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

          <div className="flex flex-col gap-1">
            <label htmlFor="time" className="text-sm font-medium text-gray-700">
              Selecione o Horário
            </label>
            <input
              type="time"
              name="time"
              required={true}
              id="time"
              onChange={(e) => setHour(e.target.value)}
              className="border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-takeat-primary-default"
            />
          </div>
        </div>

        <DrawerFooter>
          <Button onClick={() => add()}>
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