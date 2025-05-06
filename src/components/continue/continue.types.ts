// Definição do tipo de complemento dentro da categoria
export interface Complement {
    id: number;
    name: string;
    price: string;
    amount: number;
}

// Definição do tipo de categoria de complementos
export interface ComplementCategory {
    id: number;
    complements: Complement[];
    additional: boolean;
    more_expensive_only?: boolean;
    use_average?: boolean;
}

// Definição do tipo do pedido (produto no carrinho)
export interface OrderItem {
    id: number;
    amount: number;
    observation?: string;
    weight?: string;
    use_weight?: boolean;
    complement_categories?: ComplementCategory[];
}

// Definição do tipo do produto no `localStorage`
export interface Product {
    categoryId: number;
    qtd: number;
    observation: string;
    weight?: string;
    use_weight?: boolean;
    complements?: {
        complementId: string;
        name: string;
        price: string;
        qtd: number;
        categoryId: string;
        additional: boolean;
        more_expensive_only?: boolean;
        use_average?: boolean;
    }[];
}