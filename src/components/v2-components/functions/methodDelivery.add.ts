interface TestProps {
  restaurantId: string;
  method: string;
}

export const AddMethodDelivery = ({ restaurantId, method }: TestProps) => {
  const parsedValue = {
    method: method
  }
  localStorage.setItem(`@methodDeliveryTakeat:${restaurantId}`, JSON.stringify(parsedValue))
}