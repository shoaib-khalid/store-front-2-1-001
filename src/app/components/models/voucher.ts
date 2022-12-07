export interface CustomerVoucher
{
    id          : string;
    customerId  : string;
    voucherId   : string;
    isUsed      : boolean;
    created     : string;
    voucher     : Voucher;
}

export interface Voucher
{
    id                : string;
    name              : string;
    storeId           : string;
    discountValue     : number;
    maxDiscountAmount : number;
    voucherCode       : string;
    totalQuantity     : number;
    totalRedeem       : number;
    status            : string;
    voucherType       : string;
    discountType      : string;
    calculationType   : string;
    startDate         : string;
    endDate           : string;
    isNewUserVoucher  : boolean;
    voucherVerticalList : VoucherVerticalList[];
    voucherStoreList    : VoucherStoreList[];
    requireToClaim      : boolean;
}

export interface VoucherVerticalList
{
    id: string;
    regionVertical: {
        code: string;
        commissionPercentage: number;
        customerActivationNotice: string;
        defaultLogoUrl: string;
        description: string;
        domain: string;
        minChargeAmount: number;
        name: string;
        regionId: string;
        senderEmailAdress: string;
        senderEmailName: string;
        thumbnailUrl: string;
    };
    verticalCode: string;
    voucherId: string;
}

export interface VoucherStoreList
{
    id: string;
    storeId: string;
    voucherId: string;
}