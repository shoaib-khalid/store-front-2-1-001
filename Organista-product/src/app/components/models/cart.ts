import { ProductInventory } from "./product";

export interface Cart {
    id: string;
    customerId: string;
    storeId: string;
    isOpen: boolean;
}
export interface CartItem {
    SKU: string,
    cartId: string,
    discountCalculationType: string,
    discountCalculationValue: string,
    discountId: number,
    discountLabel: number,
    id: string,
    itemCode: string,
    price: number,
    productId: string,
    productName: string,
    productPrice: number,
    quantity: number,
    specialInstruction: string,
    weight: number,

    productInventory: ProductInventory,
}
export interface CartSubItem {
    id: string;
    quantity: number;
    cartItemId: string;
    productId: string;
    itemCode: string;
    price: number;
    productPrice: number;
    weight: number;
    SKU: string;
    productName: string;
    specialInstruction: string;
}