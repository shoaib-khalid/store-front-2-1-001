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

}

export class ProductInventory {
    itemCode: string;
    price: number;
    quantity: number;
    productId: string;
    sku: string;
    productInventoryItems: ProductInventoryItem[];
    product: Product;
    itemDiscount: ItemDiscount;
}

export class ItemDiscount {
    normalPrice: number;
    discountedPrice: number;
    discountAmount: number;
    calculationType: string;
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