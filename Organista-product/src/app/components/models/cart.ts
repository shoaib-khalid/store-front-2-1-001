export interface Cart {
    id: string;
    customerId: string;
    storeId: string;
    isOpen: boolean;
}
export interface CartItem {
    "cartId": string,
    "id": "",
    "itemCode": string,
    "price": number,
    "productId": string,
    "productPrice": number,
    "quantity": number,
    "SKU": string,
    "specialInstruction": string
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