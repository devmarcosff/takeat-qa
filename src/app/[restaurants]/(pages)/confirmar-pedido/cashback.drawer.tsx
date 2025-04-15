import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangeEvent, useState } from "react";
import { formatPrice, IconChevronDown } from "takeat-design-system-ui-kit";

interface ICashProps {
  openDrawer?: boolean;
  setOpenDrawer?: () => void;
}

export default function CashbackDrawer({ openDrawer, setOpenDrawer }: ICashProps) {
  const [birthdate, setBirthdate] = useState('');

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

  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Escolha uma opção de desconto</DrawerTitle>
        </DrawerHeader>

        <div className="w-full px-4">
          <Tabs defaultValue="cashback" className="w-full flex flex-col">

            <TabsList className="bg-transparent">
              <TabsTrigger value="cashback" className="w-full py-2 m-0 border border-takeat-neutral-darker rounded-r-none data-[state=active]:!bg-takeat-neutral-darker data-[state=active]:!text-white">Cashback</TabsTrigger>
              <TabsTrigger value="cupons" className="w-full py-2 m-0 border border-takeat-neutral-darker rounded-l-none data-[state=active]:!bg-takeat-neutral-darker data-[state=active]:!text-white">Cupons</TabsTrigger>
            </TabsList>

            <TabsContent value="cashback">
              <div className="bg-takeat-neutral-lightest py-5 rounded-xl flex flex-col px-4 gap-2">
                <span>Saldo de Cashback:</span>
                <span className="text-takeat-green-default font-semibold">{formatPrice(10)}</span>
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
            </TabsContent>

            <TabsContent value="cupons">
              <div className="overflow-y-scroll h-full">
                <span>Cupons disponíveis:</span>

                <div className="flex flex-col gap-1">
                  {
                    Array.from({ length: 5 }, (_, index) => {
                      return (
                        <div key={index} className="bg-takeat-neutral-white p-4 rounded-xl border">
                          <RadioGroup>
                            <label htmlFor={`${index}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="font-semibold">BEMVINDO15</span>
                                  <span>Desconto 15%</span>
                                </div>
                                <div>
                                  <RadioGroupItem value={`${index}`} id={`${index}`} />
                                </div>
                              </div>
                            </label>
                          </RadioGroup>
                          <div className="pt-1 border-t">
                            <span className="flex items-center justify-start gap-2">Ver regras <IconChevronDown /></span>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </TabsContent>

          </Tabs>
        </div>

        <DrawerFooter className="flex flex-row w-full justify-between items-center">
          <DrawerClose asChild>
            <Button variant="outline" className="w-2/4 text-[16px]">Cancelar</Button>
          </DrawerClose>
          <Button className="w-full disabled:bg-takeat-neutral-lighter disabled:text-takeat-neutral-darker text-[16px]" disabled>Resgatar</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
