import { ActiveState, ProductInfoResponse, VoucherStoreType } from "../interface";
import { DiscountType, ProductTransactionState, VoucherInfo } from '../interface';

export interface TypeInfo {
    type: string;
    color: string;
}

export interface ProductDetail {
    createdAt: number;
    updatedAt: number;
    id: string;
    productId: string;
    type: TypeInfo;
    quantity: number;
    imageUrl: string;
    originPrice: number;
    sellPrice: number;
    discountPercent: DiscountType;
    userId: string;
}

export interface StoreRate {
    totalPoint: number;
    totalRate: number;
    avgPoint: number;
}

export interface StoreInfo {
    createdAt: number;
    updatedAt: number;
    id: string;
    storeName: string;
    ownerStoreName: string;
    address: string;
    description: string;
    location: string;
    status: ActiveState;
    imageUrl: string;
    rate: StoreRate;
}

export interface ProductTransactionDetailResponse {
    id: string;
    productId : string;
    product : ProductInfoResponse;
    productDetailId: string;
    productDetail: ProductDetail;
    transactionId: string;
    storeId: string;
    store: StoreInfo;
    state: ProductTransactionState;
    quantity: number;
    totalPrice: number;
    note: string;
    voucherInfo: VoucherInfo;
    shipCod: null;
    address: string;
}

export interface ProductTransactionResponse {
    id : string;
    buyerUsername: string;
    totalPrice: number;
    note: number;
    createdAt: number;
    comboInfo : ComboInfo;
    details : ProductTransactionDetailResponse[]
}

export interface ComboInfo {
    isUseCombo: boolean;
    comboId?: string;
    comboName?: string;
    discountType?: DiscountType;
    value?: number;
    totalDiscount: number | 0;
    sellPrice: number | 0;
}
