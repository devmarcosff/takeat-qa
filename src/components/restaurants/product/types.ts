export type IComplementDrawer = {
    price: string;
    amount: number;
};

export type IComplementCategoryDrawer = {
    additional: boolean;
    more_expensive_only: boolean;
    use_average: boolean;
    complements: IComplementDrawer[];
};

export type IProductDrawer = {
    price: string;
    amount: number;
    weight?: number | boolean | undefined;
    complement_categories?: IComplementCategoryDrawer[];
};