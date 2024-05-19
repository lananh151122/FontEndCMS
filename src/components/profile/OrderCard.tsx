import { Key, useEffect, useState } from "react";
import { Outlet } from "react-router-dom"
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { Avatar, Button, Col, Collapse, Pagination, Progress, Row, Space, Tag, Typography } from "antd";
import { ProductTransactionDetailResponse, ProductTransactionResponse } from "../../interfaces/models/productTransaction";
import { ProList } from "@ant-design/pro-components";
import { convertToVietnamTime, convertUTCToVietnamTime, formatCurrency, handleErrorResponse } from "../../utils";
import { ProductTransactionState } from "../../interfaces/interface";
import { SyncLoader } from "react-spinners";
import OrderModalComponent from "./modal/OrderModal";

const getTransactionState = (state: ProductTransactionState) => {
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

const { Title, Text } = Typography;
const OrderCard = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [transactions, setTransactions] = useState([]);
    const [page, setpage] = useState<number>(1)
    const [total, setTotal] = useState<number>(0);
    const [openOrderModal, setOpenOrderModal] = useState<boolean>(false);
    const [selectedDetail, setSelectedDetail] = useState<ProductTransactionDetailResponse>()
    const getTransaction = async () => {
        try {
            setLoading(true)
            const response = await http.get(`${apiRoutes.productTransaction}`, {
                params: {
                    page: page - 1,
                    size: 5,
                    sort: 'createdAt DESC'
                }
            })
            setTransactions(response.data.data.data)
            setTotal(response.data.data.metadata.total)
            console.log('response.data.data.data: ', response.data.data.data);
        } catch (err) {
            handleErrorResponse(err);
        } finally {
            setLoading(false)
        }
    };

    const getTransactionStateTag = (state: ProductTransactionState) => {
        const { text, color } = getTransactionState(state);
        return <Tag color={color}>{text}</Tag>;
    };

    useEffect(() => {
        getTransaction();
    }, [page])

    const renderPanelHeader = (transaction: ProductTransactionResponse) => {
        return (
            <Col span={24}>
                <Row className="flex items-center">
                    <Col xs={4} lg={1}>
                        <Avatar src={transaction.details[0].store.imageUrl} alt={transaction.details[0].store.storeName} shape="circle" />
                    </Col>
                    <Col xs={10} lg={15}>
                        <Text>Đơn hàng {transaction.id} - {`(${transaction.details[0].store.storeName})`}</Text>
                    </Col>
                    <Col xs={10} lg={8} className="flex justify-between">
                        <div>
                            {transaction.comboInfo.isUseCombo ?
                                <>
                                    <Text className="mr-2 text-gray-400" delete>{formatCurrency(transaction.comboInfo.sellPrice + transaction.comboInfo.totalDiscount)}</Text>
                                    -
                                    <Text className="ml-2 text-red">{formatCurrency(transaction.comboInfo.sellPrice)}</Text>
                                </>
                                :
                                <Text className=" text-red">{formatCurrency(transaction.comboInfo.sellPrice)}</Text>
                            }
                        </div>
                        <Text className=" text-blue">{convertToVietnamTime(transaction.createdAt)}</Text>

                    </Col>
                </Row>
            </Col>
        )
    };

    const renderTransactionDetail = (transaction: ProductTransactionDetailResponse) => {
        return (
            <Row className="flex items-center" gutter={[0, 16]}>
                <Col xs={4} lg={1}>
                    <Avatar shape="circle" src={transaction.product.defaultImageUrl} />
                </Col>
                <Col xs={20} lg={12}>
                    <Text >{transaction.product.productName}{` (${transaction.productDetail.type.type})`}</Text>
                </Col>
                <Col xs={12} lg={4}>
                    <Text >{transaction.quantity} sản phẩm</Text>
                </Col>
                <Col xs={12} lg={4}>
                    {getTransactionStateTag(transaction.state)}
                </Col>
                <Col xs={24} lg={3} >
                    <Text className="text-red flex justify-between items-center">
                        {transaction.totalPrice}
                        <a onClick={() => {
                            setSelectedDetail(transaction);
                            setOpenOrderModal(true);
                        }}>
                            Chi tiết
                        </a>
                    </Text>
                </Col>
            </Row>
        )
    };

    const renderTransactionDetailHeader = (transaction: ProductTransactionDetailResponse) => {
        return (
            <Row className="flex justify-between items-center">
                <Text >{transaction.productDetail.type.type}</Text>
            </Row>
        )
    };

    if (loading) {
        return (
            <div style={{ height: '20vh' }} className="flex justify-center items-center">
                <SyncLoader color="red" loading={loading} />
            </div>
        );
    } else {
        return (
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Collapse >
                        {transactions.map((transaction: ProductTransactionResponse) => {
                            return (
                                <Collapse.Panel key={transaction.id} header={renderPanelHeader(transaction)} >
                                    <div>
                                        {transaction.comboInfo.isUseCombo ?
                                            <div>
                                                <Row gutter={[16, 16]} className="mb-5">
                                                    <Col span={24}>
                                                        <Text>Khuyến mãi: {transaction.comboInfo.comboName}</Text>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Text>Giảm giá: {transaction.comboInfo.discountType == "PERCENT" ? transaction.comboInfo.value + '%' : transaction.comboInfo.value}</Text>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Text>Tiết kiệm: {transaction.comboInfo.totalDiscount} VNĐ</Text>
                                                    </Col>
                                                </Row>
                                            </div>
                                            :
                                            <>
                                            </>
                                        }
                                    </div>
                                    <Collapse>
                                        {transaction.details.map((detail: ProductTransactionDetailResponse) => {
                                            return (
                                                <Collapse.Panel key={detail.id} header={renderTransactionDetailHeader(detail)} >
                                                    {renderTransactionDetail(detail)}
                                                </Collapse.Panel>
                                            )
                                        })}

                                    </Collapse>
                                </Collapse.Panel>
                            )
                        })}
                    </Collapse>
                    <div className="flex justify-center">
                        <Pagination current={page} total={total} pageSize={5} onChange={(value: number) => setpage(value)} />
                    </div>
                    <OrderModalComponent open={openOrderModal} handleClose={() => setOpenOrderModal(false)} detail={selectedDetail} />
                </Col>
            </Row>
        )
    }

}

export default OrderCard;