import { useEffect, useState } from "react";
import { UserVoucherResponse } from "../../interfaces/interface";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { convertToVietnamTime, handleErrorResponse } from "../../utils";
import { Button, Col, Modal, Row, Typography } from "antd";


interface UserVoucherProps {
    productId: string;
    open: boolean;
    setOpen: (value: boolean) => void;
    setVoucher: (value: UserVoucherResponse) => void;
}

const SelectVoucherModel = ({ open, setOpen, setVoucher, productId }: UserVoucherProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [voucherList, setVoucherList] = useState<UserVoucherResponse[]>([]);
    const getProductVoucher = async (productId: string) => {
        try {
            setLoading(true);
            const response = await http.get(`${apiRoutes.voucher}/user/voucher`, {
                params: {
                    productId: productId
                }
            });
            const datas = response.data?.data as UserVoucherResponse[];
            setVoucherList(datas);
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(productId) {
            getProductVoucher(productId);
        }
    }, [productId])
    return (
        <Modal title='Chọn mã giảm giá' open={open} onCancel={() => setOpen(false)}>
            <Row>
                {voucherList.map((voucher: UserVoucherResponse) => {
                    return (
                        <Col span={24} className="flex justify-between">
                            <Row className="p-5 w-10/12 flex items-center" gutter={[8,2]}>
                                <Col lg={24} className="mb-3">
                                    <Typography.Text className="text-xl" strong>{voucher.voucherStoreName}</Typography.Text>
                                </Col>
                                <Col lg={24}>
                                    Giảm giá {voucher.value} {voucher.discountType == 'PERCENT' ? '%' : 'VNĐ'}
                                </Col>
                                <Col lg={24}>
                                    Áp dụng cho đơn hàng từ: {voucher.minPrice} đến {voucher.maxPrice}
                                </Col>
                                <Col lg={24}>
                                    Hết hạn vào: {convertToVietnamTime(voucher.dayToExpireTime)}
                                </Col>
                            </Row>
                            <Row className="flex items-center">
                                <Button onClick={() => setVoucher(voucher)}>
                                    Sử dụng
                                </Button>
                            </Row>
                        </Col>
                    )
                })}
            </Row>
        </Modal>
    )
}

export default SelectVoucherModel;