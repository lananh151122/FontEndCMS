import { Avatar, Col, Modal, Row, Tag, Typography } from "antd";
import { ProductTransactionDetailResponse } from "../../../interfaces/models/productTransaction";
import { ProductTransactionState } from "../../../interfaces/interface";

interface OrderModalComponentProps {
    open: boolean;
    handleClose: () => void;
    detail: ProductTransactionDetailResponse | undefined;
}

const getTransactionState = (state?: ProductTransactionState) => {
    switch (state) {
        case "IN_CART":
            return { text: "Trong giỏ hàng", color: "blue" };
        case "WAITING_STORE":
            return { text: "Chờ cửa hàng", color: "orange" };
        case "ACCEPT_STORE":
            return { text: "Chờ giao hàng", color: "green" };
        case "WAITING_SHIPPER":
            return { text: "Chờ giao hàng", color: "orange" };
        case "SHIPPER_PROCESSING":
            return { text: "Đang vận chuyển", color: "purple" };
        case "SHIPPER_COMPLETE":
            return { text: "Đã đến nơi", color: "green" };
        case "ALL_COMPLETE":
            return { text: "Hoàn tất", color: "green" };
        case "CANCEL":
            return { text: "Huỷ bỏ", color: "red" };
        default:
            return { text: "Lỗi giao dịch", color: "gray" };
    }
};

const { Text } = Typography;
const OrderModalComponent = ({ detail, open, handleClose }: OrderModalComponentProps) => {

    const getTransactionStateTag = (state?: ProductTransactionState) => {
        const { text, color } = getTransactionState(state);
        return <Tag color={color}>{text}</Tag>;
    };

    return (
        <Modal open={open} onCancel={handleClose} title={`Đơn hàng ${detail?.id}`} footer={null} >
            <Row gutter={[0, 16]} className="pt-5">
                <Col span={24}>
                    <Row gutter={[16, 0]} className="flex items-center justify-center">
                        <Avatar size={200} shape="square" src={detail?.product.defaultImageUrl} />
                    </Row>
                </Col>
                <Col span={24}>
                    <Row gutter={[16, 0]}>
                        <Col lg={6}>
                            <Text>Mã giao dịch: </Text>
                        </Col>
                        <Col lg={18}>
                            <Text>{detail?.id}</Text>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row gutter={[16, 0]}>
                        <Col lg={6}>
                            <Text>Tên sản phẩm: </Text>
                        </Col>
                        <Col lg={18}>
                            <Text>{detail?.product.productName}</Text>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row gutter={[16, 0]}>
                        <Col lg={6}>
                            <Text>Cửa hàng: </Text>
                        </Col>
                        <Col lg={18}>
                            <Text>{detail?.store.storeName}</Text>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row gutter={[16, 0]}>
                        <Col lg={6}>
                            <Text>Tiền thanh toán cho sản phẩm: </Text>
                        </Col>
                        <Col lg={18}>
                            <Text>{detail?.totalPrice} VNĐ</Text>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row gutter={[16, 0]}>
                        <Col lg={6}>
                            <Text>Loại sản phẩm mua: </Text>
                        </Col>
                        <Col lg={18}>
                            <Text>{detail?.productDetail.type.type}</Text>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row gutter={[16, 0]}>
                        <Col lg={6}>
                            <Text>Địa chỉ giao hàng: </Text>
                        </Col>
                        <Col lg={18}>
                            <Text>{detail?.address}</Text>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row gutter={[16, 0]}>
                        <Col lg={6}>
                            <Text>Ghi chú: </Text>
                        </Col>
                        <Col lg={18}>
                            <Text>{detail?.note}</Text>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row gutter={[16, 0]}>
                        <Col lg={6}>
                            <Text>Số lượng mua: </Text>
                        </Col>
                        <Col lg={18}>
                            <Text>{detail?.quantity}</Text>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row gutter={[16, 0]}>
                        <Col lg={6}>
                            <Text>Mã giảm giá: </Text>
                        </Col>
                        <Col lg={18}>
                            {detail?.voucherInfo.isUse ?

                                <div className="flex justify-evenly">
                                    <Text>{detail.voucherInfo.voucherName}</Text>
                                    <div>
                                        <Text className="text-gray-400" delete>{detail.voucherInfo.priceBefore}</Text>
                                        <span> - </span>
                                        <Text color="red">{detail.voucherInfo.priceAfter}</Text>
                                    </div>
                                    <Tag color="red">Giảm {detail.voucherInfo.totalDiscount} VNĐ</Tag>
                                </div>

                                :
                                <>Không sử dụng</>
                            }
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row gutter={[16, 0]}>
                        <Col lg={6}>
                            <Text>Trạng thái đơn hàng: </Text>
                        </Col>
                        <Col lg={18}>
                            <Text>{getTransactionStateTag(detail?.state)}</Text>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Modal>
    )
}

export default OrderModalComponent;