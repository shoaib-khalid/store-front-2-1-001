export class Product {
    allowOutOfStockPurchases: boolean;
    categoryId: string;
    productid: number;
    name: string;
    description: string;
    price: number;
    thumbnailUrl: string;
    status: boolean;
    id: any;
    productInventories: ProductInventory[];
    sku: string;
}
export class ProductInventory {
    productId: string;
    price: number;
    sku: string;
}