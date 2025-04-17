import { useDelivery } from "@/context/DeliveryContext";
import { MdKeyboardArrowRight } from "react-icons/md";
import { formatPrice, IconCardFront, IconClock, IconDeliveryBag, IconDeliveryBagSchedule, IconDeliverySchedule, IconMoney, IconMotorcycle, IconPix, IconTicketFilled } from 'takeat-design-system-ui-kit';
import { InfoButton, InfoContainerButton } from './informationButton.style';


type IconNames = "IconCardFront" | "IconMotorcycle" | "IconDeliveryBag" | "IconDeliverySchedule" | "IconDeliveryBagSchedule" | "IconPix" | "IconMoney" | "IconTicketFilled" | 'Nothing';

interface IconProps {
  name: IconNames | null;
  size?: number;
  fill?: string;
  className?: string;
}

const ICONS_MAP = {
  IconMotorcycle: IconMotorcycle,
  IconDeliveryBag: IconDeliveryBag,
  IconDeliverySchedule: IconDeliverySchedule,
  IconDeliveryBagSchedule: IconDeliveryBagSchedule,
  IconPix: IconPix,
  IconMoney: IconMoney,
  IconTicketFilled: IconTicketFilled,
  IconCardFront: IconCardFront,
  Nothing: () => null,
};

export default function InformationButton({ onClick, value, title, description, time, icon, fill }: { onClick?: () => void, value?: string, title: string, description?: string, time?: number, icon?: IconNames | undefined, fill?: string, arrow?: boolean }) {
  const { cuponValue, setCuponValue, cashbackValue, setCashbackValue } = useDelivery()

  const handleRemoveContext = () => {
    setCuponValue({
      id: 0,
      name: "",
      title: "",
      description: "",
      code: "",
      discount_type: null,
      discount: 0,
      minimum_price: "",
      maximum_discount: "",
      buyer_limit_buy: 0,
      currency: "",
      is_active: false,
      is_public: false,
      limit_date: null,
      limit_amount: null,
      distance_limit: "",
      used_amount: 0,
      deleted_at: null,
      is_campaign: false,
      accepted_channels: [],
      start_time: null,
      end_time: null,
      createdAt: "",
      updatedAt: "",
      restaurant_id: 0,
    })

    setCashbackValue('')
  }

  const DiscountTypes = () => {
    if (cuponValue.discount_type === 'percentage') {
      return `${description} - ${cuponValue.discount}%`
    } else if (cuponValue.discount_type === 'absolute') {
      return `${description} - ${formatPrice(cuponValue.discount)}`
    } else if (cuponValue.discount_type === 'free-shipping') {
      return `${description} - FRETE GRATIS`
    } else {
      return `${formatPrice(description || '')}`
    }
  }

  const RemoveOrIcon = () => {
    return (
      cuponValue.code ? (
        <InfoContainerButton>
          <span className="text-sm font-semibold" onClick={handleRemoveContext}>Remover</span>
        </InfoContainerButton>
      ) : cashbackValue ? (
        <InfoContainerButton>
          <span className="text-sm font-semibold" onClick={handleRemoveContext}>Remover</span>
        </InfoContainerButton>
      ) : <InfoContainerButton>
        <MdKeyboardArrowRight className="text-2xl" />
      </InfoContainerButton>
    )
  }

  return (
    <InfoButton onClick={!cuponValue.code && !cashbackValue ? onClick : () => null} value={value}>
      <InfoContainerButton>
        <CustomIcon name={icon || null} fill={fill} />
        <div className="flex flex-col justify-start items-start">
          <span className={`${cuponValue.code || cashbackValue ? 'text-takeat-green-default text-sm font-semibold' : 'text-takeat-neutral-darker'}`}>{title}</span>
          <span className={`${cuponValue.code || cashbackValue ? 'text-sm font-semibold' : 'text-takeat-neutral-darker'}`}>{cuponValue.code || cashbackValue ? DiscountTypes() : ''}</span>
        </div>
      </InfoContainerButton>
      {
        !!time && (
          <InfoContainerButton>
            <IconClock />
            <span>{time} min.</span>
          </InfoContainerButton>
        )
      }
      {RemoveOrIcon()}
    </InfoButton>
  )
}

const CustomIcon: React.FC<IconProps> = ({ name, size = 28, fill }) => {
  const IconComponent = ICONS_MAP[name || 'Nothing'];

  return <IconComponent style={{ fontSize: size, fill }} />;
};