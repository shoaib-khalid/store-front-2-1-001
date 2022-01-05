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
    itemCode: string;
    price: number;
    quantity: number;
    productId: string;
    sku: string;
    productInventoryItems: ProductInventoryItem;
}

export class ProductInventoryItem {
    itemCode: string;
    productVariantAvailableId: string;
}

export class ProductAsset {
    id: string;
    itemCode: string;
    name: string;
    url: string;
    productId: string;
    isThumbnail: boolean;
}

export class ProductDeliveryDetail {
    productId: string;
    type: string;
    itemType: string;
}