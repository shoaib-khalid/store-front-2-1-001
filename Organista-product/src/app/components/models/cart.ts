export interface Cart {
    id: string;
    customerId: string;
    storeId: string;
    isOpen: boolean;
}
export interface CartItem {
    id: string;
    quantity: number;
    cartId: string;
    productId: string;
    itemCode: string;
    price: number;
    productPrice: number;
    weight: number;
    SKU: string;
    productName: string;
    specialInstruction: string;
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