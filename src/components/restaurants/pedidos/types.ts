export type OrderStatus = 'pending' | 'ongoing' | 'accepted' | 'ready' | 'delivered' | 'finished' | 'canceled' | 'canceled_waiting_payment' | string;

export interface PixPayment {
    id: number;
    code: string;
}

export interface Product {
    id: number;
    name: string;
}

export interface Order {
    id: number;
    details: string;
    amount: number;
    price: string;
    total_price: string;
    total_service_price: string;
    weight: string;
    use_weight: boolean;
    product: Product;
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
}

export interface OrderBasket {
    id: number;
    order_status: OrderStatus;
    basket_id: string;
    total_price: string;
    total_service_price: string;
    start_time: string;
    close_time: string | null;
    canceled_at: string | null;
    orders: Order[];
    attendance_password: number;
    fantasy_name: string;
    delivery_tax_price: string;
    with_withdrawal: boolean;
    motoboy: string | null;
}

export interface Bill {
    id: number;
    total_price: string;
    total_service_price: string;
    status: string;
    start_time: string;
    close_time: string | null;
    service_tax: boolean;
    rescued_clube: boolean;
    rescues: number; // Tipar se necessário
    order_baskets: OrderBasket[];
}

export interface IPedidos {
    id: number;
    status: string;
    key: string;
    total_price: string;
    total_service_price: string;
    start_time: string;
    end_time: string | null;
    rescued_clube: boolean;
    old_total_price: string | null;
    discount_percent: string | null;
    discount_total: string | null;
    discount_obs: string | null;
    completed_at: string | null;
    createdAt: string;
    updatedAt: string;
    is_delivery: boolean;
    with_withdrawal: boolean;
    user_change: string;
    sms_service_price: string;
    delivery_tax_price: string;
    total_delivery_price: string;
    attendance_password: number;
    delivery_canceled_at: string | null;
    scheduled_to: string | null;
    ifood_on_demand_id: string | null;
    pix_payments: PixPayment[];
    restaurant_id: number;
    bills: Bill[];
    basket: OrderBasket;
}
