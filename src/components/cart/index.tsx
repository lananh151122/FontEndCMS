import React, { useEffect, useState } from "react";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { NotificationType, formatCurrency, handleErrorResponse, showNotification } from "../../utils";
import { Avatar, Button, Checkbox, Col, Divider, Dropdown, Input, Menu, Modal, Popover, Row, Tag, Tooltip, Typography } from "antd";
import { ProCard } from "@ant-design/pro-components";
import QuantityInput from "../quantityInput";
import { CartByStoreResponseInterface, CartPaymentDto, CartPaymentTransaction, ProductComboDetailResponseInterface } from "../../interfaces/models/cart";
import { modalState } from "../../interfaces/models/data";
import { useNavigate } from "react-router-dom";
import { webRoutes } from "../../routes/web";
import { SyncLoader } from "react-spinners";
import { UserVoucherResponse } from "../../interfaces/interface";
import SelectVoucherModel from "./SelectVoucherModal";

const { Text } = Typography;

interface VoucherModalProps {
    cartId: string;
    open: boolean;
    productId: string;
    quantity: number;
}
const CardView = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadBuying, setLoadBuying] = useState<boolean>(false);
    const [cartItems, setCartItems] = useState<CartByStoreResponseInterface[]>([]);
    const [cartDto, setCartDto] = useState<CartPaymentDto[]>()
    const [paymentPrice, setPaymentPrice] = useState<number>(0);
    const [address, setAddress] = useState("");
    const [note, setNote] = useState("");
    const [voucherModal, setVoucherModal] = useState<VoucherModalProps>({
        cartId: "",
        open: false,
        productId: "",
        quantity: 0
    });
    const [modalProps, setModalProps] = useState<modalState>(
        {
            isOpen: false,
            title: '',
            content: ''
        }
    )
    const getCartItems = async () => {
        try {
            setLoading(true);
            const response = await http.get(`${apiRoutes.cart}`);
            const datas = response.data?.data as CartByStoreResponseInterface[];
            datas.forEach(data => {
                data.selectedCombo = data.bestCombo;
            })
            setPaymentPrice(0)
            setCartItems(datas || []);
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteCartItem = async (id: string) => {
        try {
            setLoading(true);
            const response = await http.delete(`${apiRoutes.cart}/${id}`);
            getCartItems();
            showNotification(response.data.message, NotificationType.SUCCESS);
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const removeVoucher = async (cartId: string) => {
        let updatedCartItem = [...cartItems]
        updatedCartItem.forEach(cartItem => {
            for(let item of cartItem.cartResponses){
                if(item.cartId == cartId){
                    item.voucherInfo.isUse = false;
                }
            }
        });
        setCartItems(updatedCartItem);
    };

    const updateCartItems = async (cartId: string, quantity: number | undefined, voucherId: string | undefined) => {
        try {
            const response = await http.put(`${apiRoutes.cart}/${cartId}`, {}, {
                params: {
                    quantity: quantity,
                    voucherCodeId: voucherId
                }
            });
            removeVoucher(cartId)
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const paymentCartItem = async () => {
        try {
            setLoadBuying(true)
            if(!cartDto || cartDto.length == 0 || cartDto[0].transaction.length == 0) {

                showNotification('Bạn chưa chon sản phẩm nào', NotificationType.ERROR);
                return;
            }
            const response = await http.post(`${apiRoutes.cart}/payment`, cartDto);
            setModalProps({
                isOpen: true,
                title: 'Thanh toán thành công',
                content: `Bạn đã thanh toán đơn hàng thành công`
            })
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            setLoading(false);
            setLoadBuying(false)
        }
    };

    const handleDto = () => {
        let cartDtos = [];
        for (let data of cartItems) {
            let cartDto: CartPaymentDto = {
                comboId: data.selectedCombo?.id,
                note: note,
                transaction: []
            };
            for (let item of data.cartResponses) {
                if (item.isSelected) {
                    let cardPaymentTransaction: CartPaymentTransaction = {
                        productDetailId: item.productDetailId,
                        storeId: item.storeId,
                        voucherCodeId: item.voucherInfo?.codeId,
                        cartId: item.cartId,
                        note: note,
                        address: address
                    };
                    cartDto.transaction.push(cardPaymentTransaction)
                }
            }
            cartDtos.push(cartDto);
        }
        console.log("----------------> xử lý kết quả để gửi lên sever thanh toán: ");
        console.log(cartDtos);

        setCartDto(cartDtos);
    }


    const updateSelectedCombo = () => {
        let updatedCartItems = [...cartItems];
        cartItems.forEach(cartItem => {
            cartItem.selectedCombo = cartItem.bestCombo;
        })
        setCartItems(updatedCartItems);
    }

    useEffect(() => {
        setLoading(true);
        getCartItems();
        updateSelectedCombo();
    }, []);

    useEffect(() => {
        
        handleDto();
        
    }, [cartItems, address, note]);

    const setComboInfo = (cartItems: CartByStoreResponseInterface[], storeId: string, combo: ProductComboDetailResponseInterface | null) => {
        if (!combo) {
            return;
        }
        let updatedCartItem = [...cartItems]
        let selectedProduct = new Set<string>();
        let productInCombos = new Set<string>(combo?.products?.map(item => item.id));
        updatedCartItem.forEach(cartItem => {
            if (cartItem.storeId === storeId) {
                cartItem.selectedCombo = combo;
                cartItem.cartResponses.forEach(item => {
                    if (item.comboIds.includes(combo.id)) {
                        item.isInCombo = true;
                    } else {
                        item.isInCombo = false;
                    }
                    selectedProduct.add(item.productId);
                });
            }
        });
        const productIds = new Set([...selectedProduct].filter(id => productInCombos.has(id)));
        console.log('combo?.quantityToUse: ', combo?.quantityToUse);
        console.log('productIds size: ', productIds.size);
        if (productIds.size >= combo?.quantityToUse) {
            combo.canUseCombo = true;
        } else {
            combo.canUseCombo = false;
        }
        setCartItems(updatedCartItem)
        console.log('updatedCartItem: ', updatedCartItem);
        console.log('selectedProduct: ', selectedProduct);
        console.log('productInCombos: ', productInCombos);

        console.log("=====================>comboInfo: ");
        console.log(combo);
        return combo;
    };

    const renderProductCombo = (cartItem: CartByStoreResponseInterface) => {

        const setSelectedCombo = (combo: ProductComboDetailResponseInterface) => {
            let updatedCartItems = [...cartItems];
            setComboInfo(updatedCartItems, cartItem.storeId, combo)
        }

        const content = cartItem.combos.map((combo: ProductComboDetailResponseInterface) => {

            return (
                <ProCard key={combo.id} bordered boxShadow >
                    <Row>
                        <Col className="ml-5 mr-20">
                            <Row className="mb-3">{combo.comboName}</Row>
                            <Row className="mb-3">
                                {combo.type == 'PERCENT' ? (
                                    <Text>Giảm {combo.value} %</Text>
                                ) : combo.type == 'TOTAL' ? (
                                    <Text>Giảm {formatCurrency(combo.value)} </Text>
                                ) : (
                                    <div></div>
                                )}
                            </Row>
                            <Row className="mb-3">
                                Giảm giá tối đa {combo.maxDiscount} khi mua từ {combo.quantityToUse} sản phẩm từ cửa hàng
                            </Row>
                        </Col>
                        <Col className="flex items-center justify-center">
                            <Button type="primary" onClick={() => setSelectedCombo(combo)}>Sử dụng</Button>
                        </Col>
                    </Row>
                </ProCard>
            );
        });

        if (cartItem.combos.length > 0) {
            if (cartItem.selectedCombo) {
                return (
                    <Row className="w-full bg-rose-50 p-3 flex items-center">
                        <Col>
                            <Tag color="red">Khuyến mãi</Tag>
                            {!cartItem?.selectedCombo?.canUseCombo && <Tag color="default">Chưa đủ điều kiện</Tag>}
                        </Col>
                        <Col>
                            {cartItem?.selectedCombo?.comboName}
                        </Col>
                        <Col>
                            <Text>&nbsp;- giảm giá tối đa {formatCurrency(cartItem.selectedCombo?.maxDiscount)}</Text>
                        </Col>
                        <Col>
                            <Text>&nbsp;khi mua {cartItem.selectedCombo?.quantityToUse} sản phẩm</Text>
                        </Col>
                        <Col>
                            <Popover title={'Khuyến mãi'} content={content}>
                                <Text className="text-primary cursor-pointer hover:text-secondary">&nbsp;Thêm{'>'}</Text>
                            </Popover>
                        </Col>
                    </Row>
                );
            } else {
                return (
                    <Row className="w-full bg-rose-50 p-3 flex items-center">
                        <Col>
                            <Tag color="red">Khuyến mãi</Tag>
                        </Col>
                        <Col>
                            <Text>Chưa thể áp dụng</Text>
                        </Col>
                        <Col>
                            <Popover title={'Khuyến mãi'} content={content}>
                                <Text className="text-primary cursor-pointer hover:text-secondary">&nbsp;Thêm{'>'}</Text>
                            </Popover>
                        </Col>
                    </Row>
                )
            }
        }
    };


    const renderCartItem = (cartItem: CartByStoreResponseInterface) => {

        const selectItem = (cartId: string, checked: boolean) => {
            let paymentNeedPrice = countPriceNeedPayment();
            let updatedCartItems = [...cartItems];
            updatedCartItems.forEach(item => {
                if (item.storeId === cartItem.storeId) {
                    item.cartResponses.forEach(itemInfo => {
                        if (itemInfo.cartId === cartId) {
                            itemInfo.isSelected = checked;
                            if(checked == true){
                                setPaymentPrice(paymentPrice - paymentNeedPrice +  countPriceNeedPayment())
                            }else{
                                setPaymentPrice(paymentPrice - (paymentNeedPrice - countPriceNeedPayment()))
                            }
                        }
                    })
                }
            })
            setCartItems(updatedCartItems);
            setComboInfo(updatedCartItems, cartItem.storeId, cartItem.selectedCombo)
        };

        const updateQuantity = (cartId: string, quantity: number) => {
            let updatedCartItems = [...cartItems];
            updatedCartItems.forEach(item => {
                if (item.storeId === cartItem.storeId) {
                    item.cartResponses.forEach(itemInfo => {
                        if (itemInfo.cartId === cartId) {
                            itemInfo.quantity = quantity;
                            itemInfo.totalPrice = itemInfo.sellPrice * quantity;
                        }
                    })
                }
            })
            setCartItems(updatedCartItems);
            updateCartItems(cartId, quantity, undefined);
        };

        const countPriceNeedPayment = () => {
            let totalPrice = 0;
            let totalPriceInCombo = 0;
            let combo: ProductComboDetailResponseInterface | null = cartItem.selectedCombo;
            cartItem.cartResponses.forEach(item => {
                if (item.isSelected) {
                    if (item.isInCombo) {
                        totalPriceInCombo += item.totalPrice;
                    } else {
                        totalPriceInCombo += item.totalPrice;

                    }

                }

            })
            if (combo?.canUseCombo) {
                if (combo.type == "PERCENT") {
                    totalPriceInCombo = totalPriceInCombo - totalPriceInCombo * (combo.value / 100);

                } else if (combo.type == "TOTAL") {
                    totalPriceInCombo = totalPriceInCombo - combo.value;
                }
            }
            console.log('totalPriceInCombo: ', totalPriceInCombo);
            console.log('totalPrice: ', totalPrice);
            console.log('totalPrice + totalPriceInCombo: ', totalPrice + totalPriceInCombo);
            return totalPrice + totalPriceInCombo;

        };

        return (
            <ProCard
                className="mb-5"
                bordered
                title={cartItem.storeName}
                key={cartItem.storeId}
            >
                {renderProductCombo(cartItem)}
                {cartItem.cartResponses.map((item) => (
                    <>
                        <ProCard
                            bordered
                            extra={
                                <>
                                    {item.isInCombo && <Tag color="lime">Áp dụng khuyến mãi</Tag>}
                                </>
                            }
                        >
                            <Row key={item.cartId}>
                                <Col span={1} className="flex items-center justify-center">
                                    <Checkbox checked={item.isSelected} onChange={(value: any) => selectItem(item.cartId, value.target.checked)} />
                                </Col>
                                <Col lg={1} className="flex items-center justify-center">
                                    <Avatar src={item.imageUrl} />
                                </Col>
                                <Col span={7} className="flex items-center justify-center">
                                    <div>
                                        <Text className="flex justify-center">{item.productName}</Text>
                                        <Text className="flex justify-center opacity-75" >({item.productDetailName})</Text>
                                    </div>
                                </Col>
                                <Col span={4} className="flex items-center justify-center">
                                    {item.discountPercent ? (
                                        <div className="flex">
                                            <Text delete className="text-gray-400">
                                                {formatCurrency(item.price)}
                                            </Text>
                                            &nbsp;-&nbsp;
                                            <Text className="text-rose-500">
                                                {formatCurrency(item.totalPrice)}
                                            </Text>
                                        </div>
                                    ) : (
                                        <Text className="text-rose-500">
                                            {formatCurrency(item.sellPrice)}
                                        </Text>
                                    )}
                                </Col>
                                <Col span={4} className="flex items-center justify-center">
                                    <QuantityInput
                                        quantity={item.quantity}
                                        setQuantity={(value: any) => updateQuantity(item.cartId, value)}
                                        limit={item.limit}
                                        disable={item.isDisable}
                                    />
                                </Col>
                                <Col span={3} className="flex items-center justify-center">
                                    <Text className="text-rose-500">{formatCurrency(item?.totalPrice)}</Text>
                                </Col>
                                <Col span={4} className="flex items-center justify-center">
                                    <div>
                                        <div className="flex items-center justify-center">
                                            <Button type="ghost" onClick={() => deleteCartItem(item.cartId)}>Xoá</Button>
                                        </div>
                                        <div className="flex items-center justify-center cursor-pointer">
                                            <Text className="text-rose-500">Sản phẩm tương tự </Text>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                        </ProCard>
                        <ProCard
                            bordered
                            title={
                                item.voucherInfo?.isUse ?
                                    <div className="flex">
                                        {`${item.voucherInfo.voucherName} (Giảm tối đa ${item.voucherInfo.value} ${item.voucherInfo.discountType == 'PERCENT' ? '%' : 'VND'})`}
                                    </div>
                                    :
                                    <div className="flex">
                                        Chưa chọn
                                    </div>
                            }
                            headStyle={{ margin: 10, padding: 10 }}
                            bodyStyle={{ margin: 0, padding: 0 }}
                            extra={<Button
                                onClick={() => setVoucherModal({
                                    cartId: item.cartId,
                                    productId: item.productId,
                                    quantity: item.quantity,
                                    open: true,
                                })}>
                                Chọn mã giảm giá
                            </Button>}
                        >
                        </ProCard>
                    </>
                ))}
                <Divider />
                <div className="float-right">
                    <Text>Tổng tiền thanh toán cho cửa hàng: </Text>
                    <Text className="text-primary"> {formatCurrency(countPriceNeedPayment())} </Text>
                </div>
            </ProCard>
        );
    };


    return (
        <div>
            <div className="flex justify-center">
                <div className="w-2/3 flex justify-center bg-lightWhite text-center">
                    <div>Giỏ hàng</div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-2/3 mt-5 p-5 bg-white">
                    <Row>
                        <Col span={1} className="flex items-center">
                            <Checkbox />
                        </Col>
                        <Col span={8} className="flex items-center justify-center">Sản phẩm</Col>
                        <Col span={4} className="flex items-center justify-center">Đơn giá</Col>
                        <Col span={4} className="flex items-center justify-center">Số lượng</Col>
                        <Col span={3} className="flex items-center justify-center">Số tiền</Col>
                        <Col span={4} className="flex items-center justify-center">Thao tác</Col>
                    </Row>
                </div>
            </div>
            <div className="flex justify-center">
                {loading ?
                    <div style={{ minHeight: '10vh' }} className=" flex justify-center items-center bg-base">
                        <SyncLoader color="red" loading={loading} />
                    </div>
                    :
                    <div className="w-2/3 pt-5">
                        {cartItems.map((item) => (
                            <div key={item.storeId}>{renderCartItem(item)}</div>
                        ))}
                    </div>
                }
            </div>
            <div className="flex justify-center">
                <ProCard className="w-2/3">
                    <Row>
                        <Col span={24}>
                            <Row className="p-5 ">
                                <Col span={3} className="flex items-center">
                                    <Checkbox >Chọn tất cả</Checkbox>
                                </Col>
                                <Col span={1} className="flex items-center justify-around">
                                    <Button type="text">Xóa</Button>
                                </Col>
                                <Col span={6} className="flex items-center justify-around">
                                    <Input className="w-2/3" placeholder="địa chỉ nhận hàng" type="text" onChange={(value) => setAddress(value.target.value) }/>
                                </Col>
                                <Col span={6} className="flex items-center justify-around">
                                    <Input className="w-2/3" placeholder="ghi chú" type="text" onChange={(value) => setNote(value.target.value) }/>
                                </Col>
                                <Col span={8} className="flex items-center justify-end">
                                    <Text className="mr-2">Tổng thanh toán {formatCurrency(paymentPrice)}</Text>
                                    <Button loading={loadBuying} type="primary" onClick={() => paymentCartItem()}>Mua hàng</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </ProCard>
            </div>
            <Modal
                className='m-auto'
                title={modalProps.title}
                centered
                open={modalProps.isOpen}
                okType='primary'
                closable={false}
                footer={[
                    <div className='flex justify-around' key="modal-footer">
                        <Button
                            key="submit"
                            type="primary"
                            onClick={() => navigate(`${webRoutes.profile}`)}
                        >
                            Xem đơn hàng
                        </Button>
                        <Button
                            key="submit"
                            type="default"
                            onClick={() => navigate(`${webRoutes.home}`)}
                        >
                            Trở về trang chủ
                        </Button>
                    </div>
                ]}
            >
                <div className="p-4">
                    <Text>{modalProps.content}</Text>
                </div>
            </Modal>
            <SelectVoucherModel
                productId={voucherModal.productId}
                open={voucherModal.open}
                setOpen={(value) => setVoucherModal({ ...voucherModal, open: value })}
                setVoucher={async (value: UserVoucherResponse) => {
                    await updateCartItems(voucherModal.cartId, voucherModal.quantity, value.voucherCodeId);
                    setVoucherModal({ ...voucherModal, open: false })
                    await getCartItems();

                }} />
        </div>
    );
};

export default CardView;
