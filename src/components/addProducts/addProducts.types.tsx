import { Complement, Product } from "@/types/categories.types";

export interface IProducts {
    product: Product | undefined;
    cart: { [key: string]: ICart };
    params: string;
    observation: string;
    disabled: boolean;
}

export interface ICart {
    id: string,
    limit: number,
    name: string,
    qtd: number,
    price: number,
    categoryId: string,
    complementId: string,
    observation: string,
    complements: Complement[]
} 