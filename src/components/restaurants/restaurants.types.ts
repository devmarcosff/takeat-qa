import { Category } from "@/types/categories.types";

export interface CategoriesProps {
    categories: Category[],
    scrolling?: number;
    loading?: boolean,
    isFixed?: boolean
    heightSearch?: number;
    params: string;
}

export interface ProductsProps {
    loading?: boolean
} 