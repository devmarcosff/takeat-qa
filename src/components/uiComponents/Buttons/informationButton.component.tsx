import { MdKeyboardArrowRight } from "react-icons/md";
import { IconCardFront, IconClock, IconDeliveryBag, IconDeliveryBagSchedule, IconDeliverySchedule, IconMoney, IconMotorcycle, IconPix, IconTicketFilled } from 'takeat-design-system-ui-kit';
import { InfoButton, InfoContainerButton } from './informationButton.style';


type IconNames = "IconCardFront" | "IconMotorcycle" | "IconDeliveryBag" | "IconDeliverySchedule" | "IconDeliveryBagSchedule" | "IconPix" | "IconMoney" | "IconTicketFilled";

interface IconProps {
  name: IconNames;
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
};

export default function InformationButton({ onClick, value, title, time, icon, fill, arrow }: { onClick?: () => void, value?: string, title: string, time?: number, icon: IconNames, fill?: string, arrow?: boolean }) {

  return (
    <InfoButton onClick={onClick} value={value}>
      <InfoContainerButton>
        <CustomIcon name={icon} fill={fill} />
        <span className='text-takeat-neutral-darker'>{title}</span>
      </InfoContainerButton>
      {
        !!time && (
          <InfoContainerButton>
            <IconClock />
            <span>{time} min.</span>
          </InfoContainerButton>
        )
      }
      {
        !!arrow && (
          <InfoContainerButton>
            <MdKeyboardArrowRight className="text-2xl" />
          </InfoContainerButton>
        )
      }
    </InfoButton>
  )
}

const CustomIcon: React.FC<IconProps> = ({ name, size = 28, fill }) => {
  const IconComponent = ICONS_MAP[name];

  return <IconComponent style={{ fontSize: size, fill }} />;
};