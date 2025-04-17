export interface ICashbackDrawer {
    id: number;
    name: string;
    title: string;
    description: string;
    code: string;
    discount_type: "percentage" | 'absolute' | 'free-shipping' | string | null;
    discount: number;
    minimum_price: string;
    maximum_discount: string;
    buyer_limit_buy: number;
    currency: string;
    is_active: boolean;
    is_public: boolean;
    limit_date: string | null;
    limit_amount: string | null;
    distance_limit: string;
    used_amount: number;
    deleted_at: string | null;
    is_campaign: boolean;
    accepted_channels: string[];
    start_time: string | null;
    end_time: string | null;
    createdAt: string;
    updatedAt: string;
    restaurant_id: number;
    token_clube?: string
}
