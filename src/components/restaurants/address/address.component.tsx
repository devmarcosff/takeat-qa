"use client";
import { methodDeliveryProps } from "@/app/[restaurants]/(pages)/endereco/page";
import { ButtonTakeatBottom, ButtonTakeatContainer, TextButtonTakeat } from "@/app/[restaurants]/(pages)/informacao/informacao.style";
import { SelectAddProducts } from "@/components/addProducts/addProducts.style";
import { api_delivery_address, api_public, api_validate_address } from "@/utils/apis";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Select, { SingleValue } from 'react-select';
import { DEFAULT_THEME, getAddressByCep, IconLocationFilled, Modal } from "takeat-design-system-ui-kit";
import { ButtonTakeatModal } from "./address.style";

interface SelectStateProps {
  value: string;
  label: string;
  cities?: { name: string }[];
};

interface Props {
  params: Promise<{ restaurants: string }>;
  methodDelivery: methodDeliveryProps
}

export default function AddressClientComponent({ params, methodDelivery }: Props) {
  const restaurant = React.use(params)?.restaurants;
  const addressClientDeliveryTakeat = `@addressClientDeliveryTakeat:${restaurant}`;

  const [isDisabled, setIsDisabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [restaurantId, setRestaurantId] = useState('');
  const [isNotZipCode, setIsNotZipCode] = useState(true);
  const [stateOptions, setStateOptions] = useState<SelectStateProps[]>([]);
  const [cityOptions, setCityOptions] = useState<SelectStateProps[]>([]);
  const [selectedState, setSelectedState] = useState<SelectStateProps>();

  const [getInfoCep, setGetInfoCep] = useState('');
  const [getInfoCity, setGetInfoCity] = useState('');
  const [getInfoLogradouro, setGetInfoLogradouro] = useState('');
  const [getInfoNum, setGetInfoNum] = useState('');
  const [getInfoBairro, setGetInfoBairro] = useState('');
  const [getInfoComplemento, setGetInfoComplemento] = useState('');
  const [getInfoReferencia, setGetInfoReferencia] = useState('');
  const [InfoClient, setInfoClient] = useState<{ tel: string, name?: string }>({ tel: '', name: '' });

  const { push } = useRouter();
  const addressMethodDelivery = methodDelivery.delimit_by_area || methodDelivery.is_delivery_by_distance;

  const onSubmit = () => {
    setIsDisabled(true)
    const payload = {
      "country": "BR",
      "state": `${selectedState?.value}`,
      "city": `${getInfoCity}`,
      "neighborhood": `${getInfoBairro}`,
      "street": `${getInfoLogradouro}`,
      "number": `${getInfoNum}`,
      "complement": `${getInfoComplemento}`,
      "reference": `${getInfoReferencia}`,
      "zip_code": `${getInfoCep}`,
      "restaurant_id": restaurantId
    }

    api_public.post(`/sessions`, {
      "phone": `${InfoClient.tel}`
    }).then(res => {
      const token = res.data.token;
      localStorage.setItem(`@tokenUserTakeat:${restaurant}`, token);
      api_validate_address.post('/validate-and-save', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        const valid_address = res.data.valid_address
        const address = res.data.address
        if (valid_address == true) {
          localStorage.setItem(addressClientDeliveryTakeat, JSON.stringify(address));
          push(`/${restaurant}/pagamento`)
        }
      }).catch(() => setModalOpen(true)).finally(() => setIsDisabled(false))
    }).catch(() => setModalOpen(true)).finally(() => setIsDisabled(false))
  };

  const getAddressWithCep = async (cep: string) => {
    try {
      await getAddressByCep(cep).then(res => {
        // if (response?.uf && response?.localidade) {
        //   const foundState = stateOptions.find(state => state.value === response.uf);
        //   setSelectedState(foundState || null);

        //   if (foundState) {
        //     const formattedCities = foundState.cities.map(city => ({
        //       value: city.name,
        //       label: city.name,
        //     }));
        //     setCityOptions(formattedCities);

        //     const foundCity = formattedCities.find(city => city.value === response.localidade);
        //     setGetInfoCity(foundCity || ''); // Atualiza a cidade automaticamente
        //   }
        // }

        setGetInfoCity(res.localidade)
      })
    } catch (err) { return err }
  };

  useEffect(() => {
    const getInfoClient = localStorage.getItem(`@clienteTakeat:${restaurant}`);
    const parsedGetInfoClient = JSON.parse(getInfoClient || '');
    setInfoClient(parsedGetInfoClient)
  }, [])

  useEffect(() => {
    const fetchRestaurant = async () => {
      const restaurantTest = localStorage.getItem(`@deliveryTakeat:${restaurant}`);
      if (!restaurantTest) return;

      try {
        const restaurantId = JSON.parse(restaurantTest);
        const response = await api_delivery_address.get(`/${restaurantId.restaurantId}`);

        const formattedStates = response.data.countries.flatMap((country: { states: { name: string, cities: string }[] }) =>
          country.states.map((state) => ({
            value: state.name,
            label: state.name,
            cities: state.cities,
          }))
        );

        setRestaurantId(restaurantId.restaurantId);
        setStateOptions(formattedStates);
      } catch (error) {
        console.error("Erro ao buscar os estados:", error);
      }
    };

    fetchRestaurant();
  }, [addressClientDeliveryTakeat, restaurant]);

  const handleStateChange = (newValue: SingleValue<SelectStateProps>) => {
    const selectedOption = newValue ?? undefined;
    setSelectedState(selectedOption);

    const formattedCities = selectedOption?.cities?.map(city => ({
      value: city.name,
      label: city.name
    })) || [];

    setCityOptions(formattedCities);
  };

  const cityChange = (newValue: SingleValue<SelectStateProps>) => {
    if (newValue) {
      setGetInfoCity(newValue.value);
    }
  };

  return (
    <div className="flex flex-col gap-5 pt-7 mt-7 border-t pb-20">
      {
        !addressMethodDelivery ? (
          <div>
            <div className="mt-3">
              <label htmlFor="uf" className="font-semibold">Estado (UF)</label>
              <Select
                className="basic-single text-md"
                classNamePrefix="select"
                placeholder="Selecione o estado"
                name="uf"
                id="uf"
                isSearchable={true}
                options={stateOptions}
                value={selectedState}
                onChange={handleStateChange}
                styles={{
                  control: (baseStyles, state) => ({
                    borderRadius: 12,
                    display: 'flex',
                    height: 48,
                    border: "solid 1px",
                    borderColor: state.isFocused ? '#016999' : '#7A7A7A',
                  })
                }}
              />
            </div>

            <div className="mt-3">
              <label htmlFor="localidade" className="font-semibold">Cidade</label>
              <Select
                className="basic-single text-md"
                classNamePrefix="select"
                placeholder="Selecione a cidade"
                name="localidade"
                id="localidade"
                isSearchable={true}
                options={cityOptions}
                onChange={cityChange}
                styles={{
                  control: (baseStyles, state) => ({
                    borderRadius: 12,
                    display: 'flex',
                    height: 48,
                    border: "solid 1px",
                    borderColor: state.isFocused ? '#016999' : '#7A7A7A',
                  })
                }}
              />
            </div>

            <div className="mt-3">
              <label htmlFor="bairro" className="font-semibold">Bairro</label>
              <input
                value={getInfoBairro}
                onChange={e => setGetInfoBairro(e.target.value)}
                id="bairro"
                placeholder="Digite o bairro"
                className="
                  peer w-full h-12 bg-transparent placeholder:text-slate-400 text-md
                  text-slate-700 border border-takeat-neutral-default rounded-xl
                  px-3 py-2transition duration-300 ease shadow-sm
                  focus:outline-none focus:border-takeat-blue-darker hover:border-takeat-blue-darker focus:shadow"
              />
            </div>

            <div className="flex gap-3 items-center w-full justify-between">
              <div className="mt-3 w-2/3">
                <label htmlFor="logradouro" className="font-semibold">Logradouro</label>
                <input
                  id="logradouro"
                  placeholder="Digite o logradouro"
                  value={getInfoLogradouro}
                  onChange={e => setGetInfoLogradouro(e.target.value)}
                  className="
                  peer w-full h-12 bg-transparent placeholder:text-slate-400 text-md
                  text-slate-700 border border-takeat-neutral-default rounded-xl
                  px-3 py-2transition duration-300 ease shadow-sm
                  focus:outline-none focus:border-takeat-blue-darker hover:border-takeat-blue-darker focus:shadow"
                />
              </div>
              <div className="mt-3 w-1/3">
                <label htmlFor="numero" className="font-semibold">Número</label>
                <input
                  id="numero"
                  type="number"
                  placeholder="N°"
                  value={getInfoNum}
                  onChange={e => setGetInfoNum(e.target.value)}
                  className="
                  peer w-full h-12 bg-transparent placeholder:text-slate-400 text-md
                  text-slate-700 border border-takeat-neutral-default rounded-xl
                  px-3 py-2transition duration-300 ease shadow-sm
                  focus:outline-none focus:border-takeat-blue-darker hover:border-takeat-blue-darker focus:shadow"
                />
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="complemento" className="font-semibold">Complemento</label>
              <input
                value={getInfoComplemento}
                onChange={e => setGetInfoComplemento(e.target.value)}
                id="complemento"
                placeholder="Ex: Casa 3, fundos"
                className="
                  peer w-full h-12 bg-transparent placeholder:text-slate-400 text-md
                  text-slate-700 border border-takeat-neutral-default rounded-xl
                  px-3 py-2transition duration-300 ease shadow-sm
                  focus:outline-none focus:border-takeat-blue-darker hover:border-takeat-blue-darker focus:shadow"
              />
            </div>

            <div className="mt-3">
              <label htmlFor="referencia" className="font-semibold">Referência (Opcional)</label>
              <input
                value={getInfoReferencia}
                onChange={e => setGetInfoReferencia(e.target.value)}
                id="referencia"
                placeholder="Digite a referência"
                className="
                  peer w-full h-12 bg-transparent placeholder:text-slate-400 text-md
                  text-slate-700 border border-takeat-neutral-default rounded-xl
                  px-3 py-2transition duration-300 ease shadow-sm
                  focus:outline-none focus:border-takeat-blue-darker hover:border-takeat-blue-darker focus:shadow"
              />
            </div>

          </div>
        ) : (
          <div>
            <div>
              {isNotZipCode && (
                <div>
                  <label htmlFor="cep" className="font-semibold">CEP</label>
                  <input
                    id="cep"
                    placeholder="00.000-0000"
                    value={getInfoCep}
                    onChange={(e) => {
                      setGetInfoCep(e.target.value)
                      getAddressWithCep(e.target.value)
                    }}
                    className={`
                    ${!getInfoCity ? '' : 'border-takeat-green-default'}
                      transition-all peer w-full h-12 bg-transparent placeholder:text-slate-400
                      text-slate-700 border border-takeat-neutral-default rounded-xl
                      px-3 py-2 duration-300 ease shadow-sm
                      focus:outline-none focus:border-takeat-blue-darker hover:border-takeat-blue-darker focus:shadow
                    `}
                  />
                </div>
              )}

              <div className={`w-full flex justify-start text-end ${isNotZipCode ? 'mt-3' : 'mt-0'}`}>
                <SelectAddProducts style={{ height: 48, width: isNotZipCode ? 180 : 250 }} onClick={() => setIsNotZipCode(!isNotZipCode)}>
                  <span className='text-takeat-primary-default font-semibold'>{!isNotZipCode ? 'Quero informar meu CEP' : 'Não sei meu CEP'}</span>
                </SelectAddProducts>
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="localidade" className="font-semibold">Cidade</label>
              <input
                id="localidade"
                value={getInfoCity ?? ""}
                onChange={(e) => setGetInfoCity(e.target.value)}
                placeholder="Informe sua cidade"
                readOnly={!!isNotZipCode}
                className="
                  peer w-full h-12 bg-transparent placeholder:text-slate-400
                  text-slate-700 border border-takeat-neutral-default rounded-xl
                  px-3 py-2 transition duration-300 ease shadow-sm
                  focus:outline-none focus:border-takeat-blue-darker hover:border-takeat-blue-darker focus:shadow"
              />
            </div>

            <div className="mt-3">
              <label htmlFor="localidade" className="font-semibold">Bairro</label>
              <input
                id="localidade"
                value={getInfoBairro}
                onChange={e => setGetInfoBairro(e.target.value)}
                placeholder="Informe sua cidade"
                readOnly={!!isNotZipCode}
                className="
                  peer w-full h-12 bg-transparent placeholder:text-slate-400
                  text-slate-700 border border-takeat-neutral-default rounded-xl
                  px-3 py-2 transition duration-300 ease shadow-sm
                  focus:outline-none focus:border-takeat-blue-darker hover:border-takeat-blue-darker focus:shadow"
              />
            </div>

            <div className="flex gap-3 items-center w-full justify-between">
              <div className="mt-3 w-2/3">
                <label htmlFor="logradouro" className="font-semibold">Logradouro</label>
                <input
                  id="logradouro"
                  placeholder="Informe seu logradouro"
                  value={getInfoLogradouro}
                  onChange={e => setGetInfoLogradouro(e.target.value)}
                  className="
                    peer w-full h-12 bg-transparent placeholder:text-slate-400
                    text-slate-700 border border-takeat-neutral-default rounded-xl
                    px-3 py-2transition duration-300 ease shadow-sm
                    focus:outline-none focus:border-takeat-blue-darker hover:border-takeat-blue-darker focus:shadow"
                />
              </div>
              <div className="mt-3 w-1/3">
                <label htmlFor="numero" className="font-semibold">Número</label>
                <input
                  value={getInfoNum}
                  onChange={e => setGetInfoNum(e.target.value)}
                  id="numero"
                  type="number"
                  placeholder="N°"
                  className="
                    peer w-full h-12 bg-transparent placeholder:text-slate-400
                    text-slate-700 border border-takeat-neutral-default rounded-xl
                    px-3 py-2transition duration-300 ease shadow-sm
                    focus:outline-none focus:border-takeat-blue-darker hover:border-takeat-blue-darker focus:shadow"
                />
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="bairro" className="font-semibold">Bairro</label>
              <input
                value={getInfoBairro}
                onChange={e => setGetInfoBairro(e.target.value)}
                id="bairro"
                placeholder="Informe seu bairro"
                className="
                  peer w-full h-12 bg-transparent placeholder:text-slate-400
                  text-slate-700 border border-takeat-neutral-default rounded-xl
                  px-3 py-2transition duration-300 ease shadow-sm
                  focus:outline-none focus:border-takeat-blue-darker hover:border-takeat-blue-darker focus:shadow"
              />
            </div>

            <div className="mt-3">
              <label htmlFor="complemento" className="font-semibold">Complemento</label>
              <input
                value={getInfoComplemento}
                onChange={e => setGetInfoComplemento(e.target.value)}
                id="complemento"
                placeholder="Ex: Casa 3, fundos"
                className="
                  peer w-full h-12 bg-transparent placeholder:text-slate-400
                  text-slate-700 border border-takeat-neutral-default rounded-xl
                  px-3 py-2transition duration-300 ease shadow-sm
                  focus:outline-none focus:border-takeat-blue-darker hover:border-takeat-blue-darker focus:shadow"
              />
            </div>

            <div className="mt-3">
              <label htmlFor="referencia" className="font-semibold">Referência (Opcional)</label>
              <input
                value={getInfoReferencia}
                onChange={e => setGetInfoReferencia(e.target.value)}
                id="referencia"
                placeholder="Informe sua referência"
                className="
                  peer w-full h-12 bg-transparent placeholder:text-slate-400
                  text-slate-700 border border-takeat-neutral-default rounded-xl
                  px-3 py-2transition duration-300 ease shadow-sm
                  focus:outline-none focus:border-takeat-blue-darker hover:border-takeat-blue-darker focus:shadow"
              />
            </div>

          </div>
        )
      }

      <ButtonTakeatContainer>
        <ButtonTakeatBottom type="submit" disabled={isDisabled} onClick={onSubmit}>
          {!isDisabled ? <TextButtonTakeat>Cadastrar</TextButtonTakeat>
            : <div className="flex items-center gap-3 text-white"><div className="h-4 w-4 p-2 flex border rounded-full animate-pulse" />Verificando endereço</div>}
        </ButtonTakeatBottom>
      </ButtonTakeatContainer>

      <Modal open={modalOpen} toggle={() => setModalOpen(!modalOpen)} style={{
        height: "fit-content"
      }}>
        <Modal.Header>
          <div className="flex items-center justify-center relative pt-6">
            <IconLocationFilled style={{ fill: DEFAULT_THEME.colors.primary.default, fontSize: "28px" }} />
            <div className="bg-red-500/10 p-2 animate-pulse rounded-full absolute">
              <div className="bg-red-500/10 p-7 rounded-full">
              </div>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="-mb-4">
          <p className="text-lg text-center font-semibold text-takeat-neutral-darker">
            Infelizmente, não realizamos entregas no endereço informado.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <ButtonTakeatModal width={50} textcolor={DEFAULT_THEME.colors.primary.default} color="white" onClick={() => setModalOpen(!modalOpen)}>Fechar</ButtonTakeatModal>
          <ButtonTakeatModal onClick={() => setModalOpen(!modalOpen)}>
            Retirar no Balcão
          </ButtonTakeatModal>
        </Modal.Footer>
      </Modal>
    </div>
  );
}