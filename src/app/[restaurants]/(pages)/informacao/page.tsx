"use client";

import { SelectAddProducts } from "@/components/addProducts/addProducts.style";
import InternalPages from "@/components/uiComponents/InternalPageHeader/internal_pages.header";
import { usePhoneMask } from '@/hook/usePhoneMask';
import { api_public } from "@/utils/apis";
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
  const [isFocused, setIsFocused] = useState<{ tel?: string, name?: string }>();
  const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<FormData>();
  const phone = usePhoneMask<FormData>(setValue, 'tel');
  // const [InfoClient, setInfoClient] = useState<{ tel: string, name?: string }>({ tel: '', name: '' });

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

    const getInfoClient = localStorage.getItem(`@clienteTakeat:${restaurant}`);
    const parsedGetInfoClient = JSON.parse(`${getInfoClient}`);

    api_public.post(`/sessions`, {
      "phone": `${parsedGetInfoClient.tel}`
    }).then(res => {
      localStorage.setItem(`@tokenUserTakeat:${restaurant}`, res.data.token)

      // Gerar informação popup se o usuário for novo
    }).catch(err => alert(err.response.data.error)).finally(() => push(`/${restaurant}/entrega`));

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
              <InputTakeat className={`${isFocused?.tel ? "!border-takeat-primary-light" : ""} ${getValues('tel') && '!bg-takeat-neutral-lightest !border-none'}`}>
                <IconPhoneFilled />
                <input
                  {...register("tel", { required: true, minLength: 11 })}
                  id="tel"
                  onFocus={() => setIsFocused({ tel: "tel" })}
                  className="w-full bg-transparent"
                  placeholder="DDD + seu número"
                  {...phone}
                  disabled={isDisabled}
                />
                {errors.tel && <IconError className="fill-takeat-primary-default text-2xl" />}
              </InputTakeat>
              {errors.tel && <span>{errors.tel?.message}</span>}
            </div>
            <div className="text-start">
              <label htmlFor="name">Nome</label>
              <InputTakeat className={`${isFocused?.name ? "!border-takeat-primary-light" : ""} ${getValues('name') && '!bg-takeat-neutral-lightest !border-none'}`}>
                <IconUser className="text-xl" />
                <input
                  {...register("name")}
                  id="name"
                  onFocus={() => setIsFocused({ name: "name" })}
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
          <div className="w-full flex justify-end text-center mt-5">
            <SelectAddProducts width={200} style={{ height: 48 }}>
              <button type="button" onClick={handleClearData}>
                <span className='text-takeat-primary-default font-semibold w-full'>Limpar dados</span>
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
