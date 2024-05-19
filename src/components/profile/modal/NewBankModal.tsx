import React, { useState } from "react";
import { Button, Col, Input, Row, Select, Steps, Typography } from "antd";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { BankListData } from "../../../interfaces/interface";
import { handleErrorResponse, showNotification } from "../../../utils";
import http from "../../../utils/http";
import { apiRoutes } from "../../../routes/api";

const { Step } = Steps;
const { Option } = Select;
const { Text } = Typography;
interface NewBankModalProps {
    banks: BankListData[];
    close: () => void
}

const NewBankModal = ({ banks,close }: NewBankModalProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [currentStep, setCurrentStep] = useState(0);
    const [bin, setBin] = useState<number | undefined>();
    const [bankAccountNo, setBankAccountNo] = useState<string | undefined>();
    const [bankAccountName, setBankAccountName] = useState<string>();

    const onChange = (value: number) => {
        setBin(value);
    };

    const createLinkBankAccount = async () => {
        try {
            setLoading(true);
            const response = await http.post(`${apiRoutes.bank}/link-bank-account`, {
                bin: bin,
                accountNumber: bankAccountNo
            })
            showNotification(response.data.message)
            close()
        } catch (err) {
            handleErrorResponse(err)
        } finally {
            setLoading(false)
        }
    }
    const verifyAccount = async () => {
        try {
            const accountProfile = await http.get(`${apiRoutes.bank}/account-info`, {
                params: {
                    bin: bin,
                    accountNo: bankAccountNo
                }
            })
            if (accountProfile.data.data.accountName) {
                setBankAccountName(accountProfile.data.data.accountName)
                nextStep();
            } else {
                showNotification('Không tìm thấy tài khoản này');
            }
        } catch (err) {
            handleErrorResponse(err)
        }
    }
    const nextStep = () => {
        if (currentStep == 0) {
            if (!bin) {
                showNotification("Bạn chưa chọn ngân hàng liên kết");
                return;
            }
        }
        setCurrentStep(currentStep + 1);
    };

    const preStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const renderConfirmCreate = () => {
        const selectedBank = banks.find((k) => k.bin == bin);

        return (
            <Row gutter={16}>
                <Col span={24}>
                    <Text>Ngân hàng: {selectedBank?.name}</Text>
                </Col>
                <Col span={24}>
                    <Text>Số tài khoản: {bankAccountNo}</Text>
                </Col>
                <Col span={24}>
                    <Text>Tên tài khoản: {bankAccountName}</Text>
                </Col>
                <Col span={24} className="flex justify-between mt-3">
                    <Button onClick={preStep} icon={<BiLeftArrow />}> Quay lại</Button>
                    <Button type="primary" onClick={createLinkBankAccount}>
                        {loading ? "Đang xử lý" : "Xác nhận tạo"}
                    </Button>
                </Col>
            </Row>
        );
    };

    const renderSelectBank = () => {
        return (
            <Row gutter={16}>
                <Col span={24}>
                    <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Chọn ngân hàng"
                        optionFilterProp="label"
                        onChange={onChange}
                        filterOption={(input, option) => {
                            if (option?.label && option.value !== undefined && option.value !== null) {
                                const labelString = option.label as string;
                                const valueString = option.value.toString();

                                return (
                                    labelString.toLowerCase().includes(input.toLowerCase()) ||
                                    valueString.includes(input.toLowerCase()) ||
                                    (option.data as BankListData).shortName.toLowerCase().includes(input.toLowerCase()) ||
                                    (option.data as BankListData).short_name.toLowerCase().includes(input.toLowerCase())
                                );
                            }

                            return false;
                        }}
                    >
                        {banks.map((bank) => (
                            <Option key={bank.bin} value={bank.bin} label={bank.name} data={bank}>
                                {bank.name}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col span={24} className="flex justify-end mt-3">
                    <Button type="primary" onClick={nextStep} icon={<BiRightArrow />}> Tiếp theo</Button>
                </Col>
            </Row>
        );
    };

    const verifyBankAccount = () => {
        return (
            <Row gutter={16}>
                <Col span={24}>
                    <Input
                        value={bankAccountNo}
                        onChange={(e) => setBankAccountNo(e.target.value)}
                        placeholder="Nhập số tài khoản ngân hàng"
                    />
                </Col>
                <Col span={24} className="flex justify-between mt-3">
                    <Button onClick={preStep} icon={<BiLeftArrow />}> Quay lại</Button>
                    <Button type="primary" onClick={verifyAccount} icon={<BiRightArrow />}> Tiếp theo</Button>
                </Col>
            </Row>
        );
    };

    const steps = [
        {
            title: 'Chọn ngân hàng',
            content: renderSelectBank(),
        },
        {
            title: 'Nhập số tài khoản',
            content: verifyBankAccount(),
        },
        {
            title: 'Xác nhận tạo',
            content: renderConfirmCreate(),
        },
    ];

    return (
        <div style={{ maxWidth: '400px', margin: 'auto' }}>
            <Steps current={currentStep} className="mb-4">
                {steps.map((step, index) => (
                    <Step key={index} title={step.title} />
                ))}
            </Steps>
            <div>{steps[currentStep].content}</div>
        </div>
    );
};

export default NewBankModal;
