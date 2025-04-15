export interface IInfoPedidos {
  id: number;
  order_status: string;
  basket_id: string;
  total_price: string;
  total_service_price: string;
  start_time: string;
  close_time: string | null;
  canceled_at: string | null;
  orders: {
    id: number;
    details: string | null;
    observation: string,
    amount: number;
    price: string;
    total_price: string;
    total_service_price: string;
    weight: string;
    use_weight: boolean;
    product: {
      id: number;
      name: string;
    };
    complement_categories: {
      id: number;
      complement_category: {
        id: number;
        name: string;
        available: boolean;
        question: string;
      };
      order_complements: {
        id: number;
        amount: number;
        price: string;
        complement: {
          id: number;
          name: string;
          price: string;
        };
      }[];
    }[];
  }[];
  attendance_password: number;
  fantasy_name: string;
  delivery_tax_price: string;
  with_withdrawal: boolean;
  motoboy: string | null;
}