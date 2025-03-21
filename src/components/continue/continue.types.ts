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
}

// Definição do tipo do pedido (produto no carrinho)
export interface OrderItem {
    id: number;
    amount: number;
    complement_categories?: ComplementCategory[];
}

// Definição do tipo do produto no `localStorage`
export interface Product {
    categoryId: number;
    qtd: number;
    complements?: {
        complementId: string;
        name: string;
        price: string;
        qtd: number;
        categoryId: string;
    }[];
}

// Definição do tipo do carrinho recuperado do `localStorage`
// interface Cart {
//     products: Product[];
// }
