import { useEffect, useState } from "react";
import { BankAccountData, BankAccountResponse, BankListData } from "../../interfaces/interface";
import { Avatar, Card, Col, Modal, Pagination, Row, Typography } from "antd";
import { handleErrorResponse } from "../../utils";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import NewBankModal from "./modal/NewBankModal";
import { BiPlusCircle } from "react-icons/bi";
import CreatePaymentModal from "./modal/CreatePaymentModal";
import { size } from "lodash";

const { Text } = Typography;

interface PaymentTransaction {
    paymentId: string,
    status: "RESOLVE",
    bankName: string,
    bankAccountNo: string,
    bankAccountName: string,
    amount: number,
    type: string,
    created: string
}
const PaymentCard = () => {
    const [openNewBankModal, setOpenNewBankModal] = useState(false)
    const [openPaymentModal, setOpenPaymentModal] = useState(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [bankAccount, setBankAccount] = useState<BankListData[]>([])
    const [linkBankAccount, setLinkBankAccount] = useState<BankAccountResponse[]>([])
    const [paymentTransaction, setPaymentTransaction] = useState<any[]>([])
    const [page, setpage] = useState<number>(1)
    const [total, setTotal] = useState<number>(0);

    const getListBank = async () => {
        try {
            const response = await http.get(`${apiRoutes.bank}/list-bank`);
            setBankAccount(response.data.data)
        } catch (err) {
            handleErrorResponse(err)
        }
    }

    const getLinkBankAccount = async () => {
        try {
            const response = await http.get(`${apiRoutes.bank}/link-bank-account`);
            setLinkBankAccount(response.data.data)
        } catch (err) {
            handleErrorResponse(err)
        }
    }

    const getPaymentTransaction = async () => {
        try {
            const response = await http.get(`${apiRoutes.payment}`, {
                params: {
                    page: page - 1,
                    size: 5,
                    sort: 'createdAt DESC'
                }
            });
            setPaymentTransaction(response.data.data.data);
            setTotal(response.data.data.metadata.total);
        } catch (err) {
            handleErrorResponse(err)
        }
    }

    useEffect(() => {
        getListBank();
        getLinkBankAccount();
        getPaymentTransaction();
    }, []);

    useEffect(() => {
        getPaymentTransaction();
    }, [page])

    const renderListPaymentTransaction = () => {
        if (!paymentTransaction) {
            return (
                <Row>Chưa có giao dịch nào</Row>
            )
        } else {
            return (
                <div>
                    <Row>
                        <Col lg={4} className="flex items-center justify-center">
                            <Text strong>
                                Tài khoản nạp tiền
                            </Text>
                        </Col>
                        <Col lg={4} className="flex items-center justify-center">
                            <Text strong>
                                Ngân hàng nạp
                            </Text>
                        </Col>
                        <Col lg={3} className="flex items-center justify-center">
                            <Text strong>
                                Trạng thái
                            </Text>
                        </Col>
                        <Col lg={7} className="flex items-center justify-center">
                            <Text strong>
                                Số tiền
                            </Text>
                        </Col>
                        <Col lg={6} className="flex items-center justify-center">
                            <Text strong>
                                Thời gian
                            </Text>
                        </Col>
                    </Row>
                    {paymentTransaction?.map((payment: PaymentTransaction) => {
                        return (
                            <Row gutter={[0, 64]}>
                                <Col lg={4} className="flex items-center justify-center">
                                    <Text>
                                        {payment.bankAccountNo}
                                    </Text>
                                </Col>
                                <Col lg={4} className="flex items-center justify-center">
                                    <Text>
                                        {payment.bankName}
                                    </Text>
                                </Col>
                                <Col lg={3} className="flex items-center justify-center">
                                    <Text>
                                        {payment.status}
                                    </Text>
                                </Col>
                                <Col lg={7} className="flex items-center justify-center">
                                    <Text>
                                        {payment.amount}
                                    </Text>
                                </Col>
                                <Col lg={6} className="flex items-center justify-center">
                                    <Text>
                                        {payment.created}
                                    </Text>
                                </Col>

                            </Row>
                        )
                    })}
                    <div className="flex justify-center">
                        <Pagination current={page} total={total} pageSize={5} onChange={(value: number) => setpage(value)} />
                    </div>
                </div>
            )
        }
    }
    const renderListLinkBankAccount = () => {
        if (!linkBankAccount) {
            return (
                <Row>Chưa liên kết tài khoản nào</Row>
            )
        } else {
            return (
                <div>
                    <Row>
                        <Col lg={6}>

                        </Col>
                        <Col lg={4} className="flex items-center justify-center">
                            <Text strong>
                                Tên ngân hàng
                            </Text>
                        </Col>
                        <Col lg={4} className="flex items-center justify-center">
                            <Text strong>
                                Số tài khoản
                            </Text>
                        </Col>
                        <Col lg={4} className="flex items-center justify-center">
                            <Text strong>
                                Trạng thái
                            </Text>
                        </Col>
                        <Col lg={2} className="flex items-center justify-center">
                            <Text strong>
                                Số tiền nạp
                            </Text>
                        </Col>
                        <Col lg={2} className="flex items-center justify-center">
                            <Text strong>
                                Số tiền rút
                            </Text>
                        </Col>
                        <Col lg={2} className="flex items-center justify-center">
                            <Text strong>
                                Xoá
                            </Text>
                        </Col>
                    </Row>
                    {linkBankAccount?.map((account: BankAccountResponse) => {
                        return (
                            <Row>
                                <Col lg={6}>
                                    <img width={"100%"} src={account.bankLogoUrl} />
                                </Col>
                                <Col lg={4} className="flex items-center justify-center">
                                    <Text>
                                        {account.bankName}
                                    </Text>
                                </Col>
                                <Col lg={4} className="flex items-center justify-center">
                                    <Text>
                                        {account.accountNo}
                                    </Text>
                                </Col>
                                <Col lg={4} className="flex items-center justify-center">
                                    <Text>
                                        {account.status}
                                    </Text>
                                </Col>
                                <Col lg={2} className="flex items-center justify-center">
                                    <Text>
                                        {account.moneyIn}
                                    </Text>
                                </Col>
                                <Col lg={2} className="flex items-center justify-center">
                                    <Text>
                                        {account.moneyOut}
                                    </Text>
                                </Col>
                                <Col lg={2} className="flex items-center justify-center">
                                    <Text>
                                        Xoá
                                    </Text>
                                </Col>
                            </Row>
                        )
                    })}
                </div>
            )
        }
    }
    return (
        <Row>
            <Col span={24} >
                <Card title='Danh sách tài khoản liên kết' extra={<a onClick={() => setOpenNewBankModal(true)}>Tạo mới</a>}>
                    {renderListLinkBankAccount()}
                </Card>
            </Col>
            <Col span={24} >
                <Card title='Giao dịch' extra={<a className="flex items-center" onClick={() => setOpenPaymentModal(true)}><BiPlusCircle />Nạp thêm</a>}>
                    {renderListPaymentTransaction()}
                </Card>
            </Col>
            <Modal title='Tạo thanh toán mới' open={openNewBankModal} onCancel={() => setOpenNewBankModal(false)} footer={false}>
                <NewBankModal banks={bankAccount} close={() => setOpenNewBankModal(false)} />
            </Modal>
            <Modal width={1000} title='Nạp tiền tài khoản' open={openPaymentModal} onCancel={() => setOpenPaymentModal(false)} footer={false}>
                <CreatePaymentModal
                    paymentId={undefined}
                    bankAccounts={linkBankAccount}
                    close={() => setOpenPaymentModal(false)}
                    done={() => {
                        setOpenPaymentModal(false);
                        setpage(1)
                    }} />
            </Modal>
        </Row>
    )
}

export default PaymentCard;