import { type CartItemType } from "./CartItemType";

export type ProductType = {
    id: number;
    image: string;
    name: string;
    unit: string;
    mrp?: number;
    quantity: number;
    discountPrice: number;
    category: string;
    subCategory: string;
    cartItem: CartItemType;
};