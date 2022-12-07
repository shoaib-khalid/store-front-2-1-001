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

export interface DeliveryDetails {
    deliveryContactName: string;
    deliveryAddress: string;
    deliveryPostcode: string;
    deliveryContactEmail: string;
    deliveryContactPhone: string;
    deliveryState: string;
    deliveryCity: string;
    deliveryCountry: string;
    deliveryNotes: string;
}
export interface MarkerDragEvent {
    coords: {
        lat: number;
        lng: number;
    };
}

export interface DeliveryProvider
{
    deliveryPeriod  : {
        id          : string;
        description : string;
        name        : string;
    };
    deliveryType    : string;
    isError         : boolean;
    message?        : string;
    price           : number;
    providerId      : string;
    providerImage   : string;
    providerName    : string;
    refId           : string;
    validUpTo       : string;
}