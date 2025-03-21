export interface Avatar {
    url: string;
    url_thumb: string;
    id: number;
    name: string;
    path: string;
    path_thumb: string;
    createdAt: string;
    updatedAt: string;
}

export interface Address {
    id: number;
    street: string;
    number: number;
    complement: string;
    state: string;
    city: string;
    zip_code: string;
    neighborhood: string;
    latitude: number;
    longitude: number;
    inscricao_estadual: string;
    createdAt: string;
    updatedAt: string;
}

export interface DeliveryInfo {
    id: number;
    is_delivery_active: boolean;
    is_delivery_allowed: boolean;
    is_withdrawal_active: boolean;
    is_withdrawal_allowed: boolean;
    time_to_delivery: number;
    time_to_withdrawal: number;
    is_delivery_by_distance: boolean;
    delivery_minimum_price: string;
    withdrawal_minimum_price: string;
    has_sms_service: boolean;
    is_sms_service_optional: boolean;
    client_pay_sms: boolean;
    sms_service_price: string;
    notify_whatsapp: boolean;
    payment_at_withdrawal: boolean;
    is_distance_by_path: boolean;
    delimit_by_area: boolean;
    allow_delivery_addresses: boolean;
    auto_accept: boolean;
    cep_required: boolean;
}

export interface RestaurantMethod {
    delivery_accepts: boolean;
    withdrawal_accepts: boolean;
    available: boolean;
}

export interface PaymentMethod {
    id: number;
    name: string;
    keyword: string;
    restaurant_method: RestaurantMethod[];
}

export interface Restaurant {
    id: number;
    name: string;
    fantasy_name: string;
    phone: string;
    has_service_tax: boolean;
    service_tax: string;
    opened: boolean;
    latitude: string;
    longitude: string;
    is_location_limited: boolean;
    auto_print_orders: boolean;
    auto_print_delivery: boolean;
    print_bills_on_web: boolean;
    is_printed_on_web: boolean;
    print_canceled: boolean;
    print_transfer: boolean;
    print_separate_itens: boolean;
    has_nfce: boolean;
    regime_tributario: string;
    nfce_token: string;
    cnpj: string;
    instagram: string;
    has_pix: boolean;
    has_stone_pos: boolean;
    table_limit_type: string;
    asaas_id: string;
    has_credit_card: boolean;
    currency: string;
    table_type: string;
    print_balcony_default: boolean;
    ifood_merchant_uuid: string;
    has_ifood: boolean;
    ifood_auto_accept: boolean;
    ifood_active: boolean;
    greeting_message: string;
    suspension_alert: boolean;
    is_distribution_center: boolean;
    is_order_scheduling_active: boolean;
    financial_email: string;
    only_qrcode: boolean;
    has_clube: boolean;
    token_clube: string;
    only_delivery: boolean;
    enable_translations: boolean;
    credit_register_with_nfce: boolean;
    is_active: boolean;
    pixel_id: string;
    meta_access_token: string;
    pixel_id2: string;
    meta_access_token2: string;
    avatar: Avatar;
    adress: Address;
    delivery_info: DeliveryInfo;
    payment_methods: PaymentMethod[];
}