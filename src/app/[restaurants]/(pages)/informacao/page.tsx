"use client";

import { SelectAddProducts } from "@/components/addProducts/addProducts.style";
import InternalPages from "@/components/uiComponents/InternalPageHeader/internal_pages.header";
import { phoneMask } from '@/hook/phone.mask';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IconError, IconPhoneFilled, IconUser } from "takeat-design-system-ui-kit";
import { ButtonTakeatBottom, ButtonTakeatContainer, InputContainer, InputTakeat, TextButtonTakeat } from "./informacao.style";

interface Props {
  params: Promise<{ restaurants: string }>;
}

type FormData = {
  tel: string | number;
  name: string;
};

export default function ProductPage({ params }: Props) {
  const [isDisabled, setIsDisabled] = useState(false);
  const restaurant = React.use(params)?.restaurants;
  const clientTakeat = `@clienteTakeat:${restaurant}`;
  const { push } = useRouter();
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>();
  const phone = phoneMask<FormData>(setValue, 'tel');

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storage = localStorage.getItem(clientTakeat);

      if (storage) {
        const clientData: FormData = JSON.parse(storage);
        setValue("tel", clientData.tel);
        setValue("name", clientData.name);
        setIsDisabled(true);
      }
    }
  }, [clientTakeat, setValue]);

  const onSubmit = (data: FormData) => {
    localStorage.setItem(clientTakeat, JSON.stringify(data));
    setIsDisabled(true);

    push(`/${restaurant}/entrega`)
  };

  const handleClearData = () => {
    localStorage.removeItem(clientTakeat);
    reset();
    setIsDisabled(false);
  };

  return (
    <InternalPages title="Informações" button description="Preencha seus dados abaixo para continuar com o seu pedido.">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputContainer>
          <div className="flex flex-col w-full gap-3 font-semibold text-takeat-neutral-dark">
            <div className="text-start">
              <label htmlFor="tel">Celular</label>
              <InputTakeat>
                <IconPhoneFilled />
                <input
                  {...register("tel", { required: true, minLength: 11 })}
                  id="tel"
                  className="w-full bg-transparent"
                  placeholder="DDD + seu número"
                  {...phone}
                  disabled={isDisabled}
                />
                {errors.tel && <IconError className="fill-takeat-primary-default text-2xl" />}
              </InputTakeat>
              {errors.tel && <span>{errors.name?.message}</span>}
            </div>
            <div className="text-start">
              <label htmlFor="name">Nome</label>
              <InputTakeat>
                <IconUser className="text-xl" />
                <input
                  {...register("name")}
                  id="name"
                  className="w-full bg-transparent"
                  placeholder="Digite seu nome"
                  disabled={isDisabled}
                />
                {errors.name && <span>{errors.name.message}</span>}
              </InputTakeat>
            </div>
          </div>
        </InputContainer>

        {isDisabled && (
          <div className="w-full flex justify-end text-end mt-5">
            <SelectAddProducts style={{ height: 48 }}>
              <button type="button" onClick={handleClearData}>
                <span className='text-takeat-primary-default font-semibold'>Limpar dados</span>
              </button>
            </SelectAddProducts>
          </div>
        )}

        <ButtonTakeatContainer>
          <ButtonTakeatBottom type="submit">
            <TextButtonTakeat>Confirmar</TextButtonTakeat>
          </ButtonTakeatBottom>
        </ButtonTakeatContainer>
      </form>
    </InternalPages>
  );
}
