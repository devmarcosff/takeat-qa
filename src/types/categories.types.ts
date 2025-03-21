export interface Image {
    url: string;
    url_thumb: string;
    id: number;
    name: string;
    path: string;
    path_thumb: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    price_promotion: string | null;
    sold_off: boolean;
    custom_order: number;
    promotion: string;
    use_weight: boolean;
    has_starting_price: boolean;
    is_combo: boolean;
    available: boolean;
    available_in_delivery: boolean;
    delivery_price: string;
    delivery_price_promotion: string | null;
    charge_service_tax: boolean;
    is_unitary: boolean;
    start_time: string;
    end_time: string;
    active_days: string;
    enable_times: boolean;
    available_multistore: boolean;
    image: Image;
    complement_categories: ComplementCategory[];
}

export interface Category {
    id: number;
    name: string;
    preparation_time: number;
    available: boolean;
    available_in_delivery: boolean;
    is_exclusive: boolean;
    custom_order: number;
    start_time: string;
    end_time: string;
    active_days: string;
    enable_times: boolean;
    tablet_icon: string;
    available_multistore: boolean;
    image: Image;
    products: Product[];
}

export interface Complement {
    id: number;
    name: string;
    description: string;
    price: string;
    limit: number;
    show_on_report: boolean;
    available: boolean;
    created_at: string;
    delivery_price: string;
    is_cmv_manual: boolean;
    current_cmv: string;
    start_time: string | null;
    end_time: string | null;
    active_days: string;
    enable_times: boolean;
    available_multistore: boolean;
    image: Image | null;
    checkAmount: number;
    available_in_delivery: boolean;
}

export interface ComplementCategory {
    id: number;
    name: string;
    available: boolean;
    available_in_delivery: boolean;
    question: string;
    limit: number;
    minimum: number;
    optional: boolean;
    additional: boolean;
    use_average: boolean;
    single_choice: boolean;
    more_expensive_only: boolean;
    start_time: string | null;
    end_time: string | null;
    active_days: string;
    enable_times: boolean;
    is_exclusive: boolean;
    available_multistore: boolean;
    complements: Complement[];
    ProductComplement: {
        id: number;
    };
}