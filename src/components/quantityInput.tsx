import React from "react";
import { Button, Col, InputNumber, Row, Spin, Tooltip, Typography } from "antd";
import { RiAddLine, RiSubtractFill } from "react-icons/ri";

const { Text } = Typography;

const QuantityInput = ({ quantity, setQuantity, limit, disable }: { quantity: number, setQuantity: any, limit: number | undefined, disable: boolean }) => {

    const handleIncrement = () => {
        
        if (!limit) {
            limit = 99999;
        }
        if (typeof limit === 'number') {
            if (quantity < limit) {
                setQuantity(quantity + 1);
            }
        }
    };

    const onQuantityChange = (value: any) => {
        if (!limit) {
            limit = 99999;
        }

        if (value < 1) {
            setQuantity(1);
        } else if (typeof limit === 'number') {
            if (value > limit) {
                setQuantity(limit);
            } else {
                setQuantity(value);
            }
        } else {
            // Handle the case when limit is undefined
            // You can choose to do nothing or add custom logic here
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <Row>
            <Col className="flex items-center">
                <Tooltip title={`Tối thiểu: ${'1'}`} placement="top">
                    <Button
                        disabled={disable}
                        className="rounded-none"
                        icon={<RiSubtractFill />}
                        onClick={handleDecrement}
                        style={{ borderRight: 'none' }}
                    ></Button>
                </Tooltip>
                <Tooltip title={`Tối thiểu: ${'1'} - tối đa: ${limit || 'không giới hạn'}`} placement="top">
                    <InputNumber
                        disabled={disable}
                        className="rounded-none"
                        min={1}
                        defaultValue={1}
                        value={quantity}
                        onChange={(value) => onQuantityChange(value)} />
                </Tooltip>
                <Tooltip title={`Tối đa: ${limit || 'không giới hạn'}`} placement="top">
                    <Button
                        disabled={disable}
                        className="rounded-none"
                        icon={<RiAddLine />}
                        onClick={handleIncrement}
                        style={{ borderLeft: 'none' }}
                    ></Button>
                </Tooltip>
            </Col>
        </Row>
    );
}

export default QuantityInput;
