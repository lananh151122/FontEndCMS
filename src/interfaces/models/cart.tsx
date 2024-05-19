import { CartByStoreResponse, CartResponse, ProductComboDetailResponse } from "../interface";

export interface CartResponseInterface extends CartResponse{
    isSelected : boolean;
    isDisable : boolean;
    isInCombo : boolean | false;
    isDuplicateInCombo : boolean | false;
}

export interface CartByStoreResponseInterface extends CartByStoreResponse{
    cartResponses: CartResponseInterface[];
    combos: ProductComboDetailResponseInterface[];
    bestCombo: ProductComboDetailResponseInterface;
    selectedCombo: ProductComboDetailResponseInterface | null;
}
export interface CartPaymentDto {
    comboId : string | undefined;
    note : string | undefined;
    transaction : CartPaymentTransaction[] | [{}]
}

export interface ProductComboDetailResponseInterface extends ProductComboDetailResponse {
    isUse : boolean | false;
    canUseCombo : boolean | false;
}

export interface CartPaymentTransaction {
    productDetailId : string;
    storeId : string;
    cartId : string;
    voucherCodeId : string | undefined;
    note : string | undefined;
    address : string;
}