"use client";
import { ButtonTakeatBottom, ButtonTakeatContainer, TextButtonTakeat } from "@/app/[restaurants]/(pages)/informacao/informacao.style";
import { AddMethodDelivery } from "@/components/v2-components/functions/methodDelivery.add";
import { Restaurant } from "@/types/restaurant.types";
import { api_delivery_address, api_validate_address } from "@/utils/apis";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import Select, { SingleValue } from 'react-select';
import { DEFAULT_THEME, getAddressByCep, IconLocationFilled, IconPencilFilled, Modal } from "takeat-design-system-ui-kit";
import { ButtonTakeatModal } from "./address.style";

interface Neighborhood {
  name: string;
  delivery_tax_price?: number;
}

interface SelectStateProps {
  value: string;
  label: string;
  cities?: {
    name: string;
    neighborhoods?: Neighborhood[];
  }[];
  neighborhoods?: Neighborhood[];
};

interface Props {
  params: Promise<{ restaurants: string }>;
}

export default function AddressClientComponent({ params }: Props) {
  const restaurant = React.use(params)?.restaurants;
  const addressClientDeliveryTakeat = `@addressClientDeliveryTakeat:${restaurant}`;
  const tokenUserTakeat = `@tokenUserTakeat:${restaurant}`;

  const [isDisabled, setIsDisabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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
  const [clientAddress, setClientAddress] = useState();
  const [neighborhoods, setNeighborhoods] = useState<{ value: string; label: string }[]>([]);
  const [openModalStreetMap, setOpenModalStreetMap] = useState<boolean>(false);
  const [latLong, setLatLong] = useState<MapProps>({ lat: 0, lng: 0 });
  const [methodDelivery, setMethodDelivery] = useState<Restaurant>({} as Restaurant);

  const { handleSubmit } = useForm<FormData>();

  const { push } = useRouter();
  const addressMethodDelivery = methodDelivery?.delivery_info?.delimit_by_area || methodDelivery?.delivery_info?.is_delivery_by_distance || false;

  const onSubmit = async () => {
    if (!methodDelivery?.id) return;

    const token = localStorage.getItem(tokenUserTakeat)

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
      "restaurant_id": methodDelivery.id
    }

    api_validate_address.post('/validate-and-save', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      const valid_address = res.data.valid_address
      const address = res.data.address
      setClientAddress(address)
      if (address.latitude && address.longitude) {
        setOpenModalStreetMap(true)
        setLatLong({
          lat: parseFloat(address.latitude) || 0,
          lng: parseFloat(address.longitude) || 0
        })
      } else {
        if (valid_address == true) {
          localStorage.setItem(addressClientDeliveryTakeat, JSON.stringify(address));
          push(`/${restaurant}/pagamento`)
        }
      }
    }).catch(() => setModalOpen(true)).finally(() => setIsDisabled(false))
  };

  const getAddressWithCep = async (cep: string) => {
    try {
      await getAddressByCep(cep).then(res => {
        setGetInfoCity(res.localidade)
        setGetInfoBairro(res.bairro)
        setGetInfoLogradouro(res.logradouro)
        setSelectedState({ value: res.uf, label: res.uf })
      })
    } catch (err) { return err }
  };

  useEffect(() => {
    const methodDelivery = localStorage.getItem(`@deliveryTakeatRestaurant:${restaurant}`);
    if (methodDelivery) {
      try {
        const parsedMethodDelivery = JSON.parse(methodDelivery);
        if (parsedMethodDelivery?.id) {
          setMethodDelivery(parsedMethodDelivery)
        }
      } catch (error) {
        console.error("Error parsing methodDelivery:", error);
      }
    }

    const fetchRestaurant = async () => {
      const methodDelivery = localStorage.getItem(`@deliveryTakeatRestaurant:${restaurant}`);
      if (!methodDelivery) return;

      try {
        const parsedMethodDelivery = JSON.parse(methodDelivery);
        if (!parsedMethodDelivery?.id) {
          console.error("No restaurant ID found in methodDelivery");
          return;
        }

        const response = await api_delivery_address.get(`/${parsedMethodDelivery.id}`);

        const formattedStates = response.data.countries.flatMap((country: { states: { name: string, cities: string }[] }) =>
          country.states.map((state) => ({
            value: state.name,
            label: state.name,
            cities: state.cities,
          }))
        );
        setStateOptions(formattedStates);
      } catch (error) {
        console.error("Erro ao buscar os estados:", error);
      }
    };

    fetchRestaurant();
  }, [addressClientDeliveryTakeat, restaurant])

  const handleStateChange = (newValue: SingleValue<SelectStateProps>) => {
    const selectedOption = newValue ?? undefined
    setSelectedState(selectedOption)

    const formattedCities = selectedOption?.cities?.map(city => ({
      value: city.name,
      label: city.name,
      neighborhoods: city.neighborhoods
    })) || [];

    setCityOptions(formattedCities)
  }

  const cityChange = (newValue: SingleValue<SelectStateProps>) => {
    if (newValue) {
      setGetInfoCity(newValue.value)
      setGetInfoBairro('')

      // Se a cidade tiver bairros, formata e seta no estado
      if (newValue.neighborhoods && newValue.neighborhoods.length > 0) {
        const formattedNeighborhoods = newValue.neighborhoods.map(neighborhood => ({
          value: neighborhood.name,
          label: `${neighborhood.name}`
        }));
        setNeighborhoods(formattedNeighborhoods);
      } else {
        setNeighborhoods([]);
      }
    }
  }

  const handleNeighborhoodChange = (newValue: SingleValue<{ value: string; label: string }>) => {
    if (newValue) {
      setGetInfoBairro(newValue.value)
    } else {
      setGetInfoBairro('')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                  required
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
                  required
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
                {neighborhoods.length > 0 ? (
                  <Select
                    className="basic-single text-md"
                    classNamePrefix="select"
                    placeholder="Selecione o bairro"
                    name="bairro"
                    id="bairro"
                    required
                    isSearchable={true}
                    options={neighborhoods}
                    value={neighborhoods.find(option => option.value === getInfoBairro)}
                    onChange={handleNeighborhoodChange}
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
                ) : (
                  <input
                    value={getInfoBairro}
                    onChange={e => setGetInfoBairro(e.target.value)}
                    required
                    id="bairro"
                    placeholder="Informe seu bairro"
                    className="
                    peer w-full h-12 bg-transparent placeholder:text-slate-400
                    text-slate-700 border border-takeat-neutral-default rounded-xl
                    px-3 py-2transition duration-300 ease shadow-sm
                    focus:outline-none focus:border-takeat-blue-darker hover:border-takeat-blue-darker focus:shadow"
                  />
                )}
              </div>

              <div className="flex gap-3 items-center w-full justify-between">
                <div className="mt-3 w-2/3">
                  <label htmlFor="logradouro" className="font-semibold">Logradouro</label>
                  <input
                    id="logradouro"
                    placeholder="Digite o logradouro"
                    value={getInfoLogradouro}
                    required
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
                    required
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
              <div className="relative w-full">
                {isNotZipCode && (
                  <div className="mb-3">
                    <label htmlFor="cep" className="font-semibold">CEP</label>
                    <input
                      id="cep"
                      placeholder="00.000-000"
                      value={getInfoCep}
                      required
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 8) {
                          value = value.replace(/^(\d{5})(\d)/, '$1-$2');
                          setGetInfoCep(value);
                          if (value.length === 9) {
                            getAddressWithCep(value.replace(/\D/g, ''));
                          }
                        }
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

                <div className={`absolute top-0 right-0`}>
                  <button onClick={() => setIsNotZipCode(!isNotZipCode)}>
                    <span className='text-takeat-primary-default font-semibold'>{!isNotZipCode ? 'Quero informar meu CEP' : 'Não sei meu CEP'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="localidade" className="font-semibold">Cidade</label>
                <input
                  id="localidade"
                  value={getInfoCity}
                  onChange={(e) => setGetInfoCity(e.target.value)}
                  placeholder="Informe sua cidade"
                  // readOnly={!!isNotZipCode}
                  required
                  className="
                  peer w-full h-12 bg-transparent placeholder:text-slate-400
                  text-slate-700 border border-takeat-neutral-default rounded-xl
                  px-3 py-2 transition duration-300 ease shadow-sm
                  focus:outline-none focus:border-takeat-blue-darker hover:border-takeat-blue-darker focus:shadow"
                />
              </div>

              <div className="mt-3">
                <label htmlFor="bairro" className="font-semibold">Bairro</label>
                {neighborhoods.length > 0 ? (
                  <Select
                    className="basic-single text-md"
                    classNamePrefix="select"
                    placeholder="Selecione o bairro"
                    name="bairro"
                    id="bairro"
                    required
                    isSearchable={true}
                    options={neighborhoods}
                    value={neighborhoods.find(option => option.value === getInfoBairro)}
                    onChange={handleNeighborhoodChange}
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
                ) : (
                  <input
                    value={getInfoBairro}
                    onChange={e => setGetInfoBairro(e.target.value)}
                    required
                    id="bairro"
                    placeholder="Informe seu bairro"
                    className="
                    peer w-full h-12 bg-transparent placeholder:text-slate-400
                    text-slate-700 border border-takeat-neutral-default rounded-xl
                    px-3 py-2transition duration-300 ease shadow-sm
                    focus:outline-none focus:border-takeat-blue-darker hover:border-takeat-blue-darker focus:shadow"
                  />
                )}
              </div>

              <div className="flex gap-3 items-center w-full justify-between">
                <div className="mt-3 w-2/3">
                  <label htmlFor="logradouro" className="font-semibold">Logradouro</label>
                  <input
                    id="logradouro"
                    placeholder="Informe seu logradouro"
                    value={getInfoLogradouro}
                    required
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
                    type="text"
                    required
                    inputMode="numeric"
                    // pattern="[0-9]"
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
          <ButtonTakeatBottom type="submit" disabled={isDisabled}>
            {!isDisabled ? <TextButtonTakeat>Cadastrar</TextButtonTakeat>
              : <div className="flex items-center gap-3 text-white"><LoaderCircle className="flex rounded-full animate-spin" />Analisando endereço</div>}
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
            <Link href={`/${restaurant}/pagamento`} onClick={() => AddMethodDelivery({ restaurantId: restaurant, method: 'retirarBalcao' })} className={`h-12 w-full flex items-center justify-center rounded-lg font-semibold border border-takeat-primary-default bg-takeat-primary-default text-takeat-neutral-white`}>
              Retirar no Balcão
            </Link>
          </Modal.Footer>
        </Modal>

        <Modal open={openModalStreetMap} toggle={() => setOpenModalStreetMap(false)} style={{
          height: "fit-content"
        }}>
          <Modal.Body className="-mb-4">
            <span className="font-semibold">Confirme seu endereço</span>

            <div className="mt-3">
              <MapPreview
                lat={latLong.lat}
                lng={latLong.lng}
                restaurantLat={methodDelivery?.latitude ? parseFloat(methodDelivery.latitude) : undefined}
                restaurantLng={methodDelivery?.longitude ? parseFloat(methodDelivery.longitude) : undefined}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <ButtonTakeatModal className="flex items-center gap-2" width={50} textcolor={DEFAULT_THEME.colors.primary.default} color="white" onClick={() => setOpenModalStreetMap(false)}><IconPencilFilled className="fill-takeat-primary-default" /> Editar</ButtonTakeatModal>
            <Link onClick={() => localStorage.setItem(addressClientDeliveryTakeat, JSON.stringify(clientAddress))} href={`/${restaurant}/pagamento`} className={`h-12 w-full flex items-center justify-center rounded-lg font-semibold border border-takeat-primary-default bg-takeat-primary-default text-takeat-neutral-white`}>
              Confirmar
            </Link>
          </Modal.Footer>
        </Modal>
      </div >
    </form>
  );
}

interface LeafletDefaultIconPrototype {
  _getIconUrl?: () => string;
}

delete (L.Icon.Default.prototype as LeafletDefaultIconPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

interface MapProps {
  lat: number;
  lng: number;
  restaurantLat?: number;
  restaurantLng?: number;
}

const MapPreview = ({ lat, lng, restaurantLat, restaurantLng }: MapProps) => {
  // Usa as coordenadas do restaurante como valores padrão ou fallback
  const defaultLat = restaurantLat || -20.3194400; // Latitude de Vitória - ES como fallback
  const defaultLng = restaurantLng || -40.3377800; // Longitude de Vitória - ES como fallback

  const validLat = lat || defaultLat;
  const validLng = lng || defaultLng;

  return (
    <MapContainer
      center={[validLat, validLng]}
      zoom={16}
      scrollWheelZoom={false}
      style={{ height: '300px', width: '100%', borderRadius: '10px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={[validLat, validLng]}>
        <Popup>Endereço selecionado</Popup>
      </Marker>
    </MapContainer>
  );
};