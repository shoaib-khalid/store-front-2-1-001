export interface PickupCharge {
    deliveryType: string;
    isError: boolean;
    price: number;
    providerId: number;
    providerImage: string;
    providerName: string;
    refId: number;
    validUpTo: string;
}
export interface PickupDetails 
{
    pickupContactName: string;
    pickupContactEmail: string;
    pickupContactPhone: string;
    deliveryNotes: string;
}

export interface Order
{
    appliedDiscount: number;
    appliedDiscountDescription: string;
    beingProcess: string;
    cartId: string;
    completionStatus: string;
    created: string;
    customer: string;
    customerId: string;
    customerNotes: string;
    deliveryCharges: number;
    deliveryDiscount: number;
    deliveryDiscountDescription: string;
    deliveryDiscountMaxAmount: number;
    deliveryType: string;
    discountCalculationType: string;
    discountCalculationValue: number;
    discountId: string;
    discountMaxAmount: number;
    id: string;
    invoiceId: string;
    klCommission: number;
    orderShipmentDetails: OrderShipmentDetails;
    orderPaymentDetail: OrderPaymentDetails
    paymentStatus: string;
    paymentType: string;
    privateAdminNotes: string;
    store: string;
    storeId: string;
    storeServiceCharges: number;
    storeShare: number;
    subTotal: number;
    total: number;
    updated: string;
}

export interface OrderShipmentDetails {
    address: string;
    city: string;
    country: string;
    customerTrackingUrl: string;
    deliveryProviderId: string;
    deliveryType: string;
    email: string;
    merchantTrackingUrl: string;
    orderId: string;
    phoneNumber: string;
    receiverName: string;
    state: string;
    storePickup: boolean;
    trackingNumber: string;
    trackingUrl: string;
    zipcode: string;
}

export interface OrderPaymentDetails {
    accountName: string;
    couponId: string;
    deliveryQuotationAmount:  number;
    deliveryQuotationReferenceId: string;
    gatewayId: string;
    orderId: string;
    time: string;
}