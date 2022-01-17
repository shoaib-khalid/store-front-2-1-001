export interface DeliveryCharge {
    deliveryType: string;
    isError: boolean;
    price: number;
    providerId: number;
    providerImage: string;
    providerName: string;
    refId: number;
    validUpTo: string;
}