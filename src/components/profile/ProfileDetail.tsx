import React, { useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { UserProfile } from "../../interfaces/interface";
import { BiPencil } from "react-icons/bi";
import { handleErrorResponse, showNotification } from "../../utils";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";

interface ProfileDetailProps {
    profile?: UserProfile;
}

const ProfileDetail = ({ profile }: ProfileDetailProps) => {
    const [loading, setLoading] = useState<boolean>();
    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState<boolean>(true);
    const onFinish = async (values: any) => {
        try {
            setLoading(true)
            const response = await http.put(`${apiRoutes.user}`, values) as BaseResponse<any>;
            showNotification(response.data.message)
        } catch (err) {
            handleErrorResponse(err);
        } finally {
            setLoading(false)
        }
    };

    return (
        <Form
            form={form}
            onFinish={onFinish}
            initialValues={profile}
            layout="vertical"
            className={loading ? 'opacity-50 transition-opacity duration-300' : ''}
        >

            <Row gutter={64} >
                <Col span={24}>
                    <div className="mb-10 flex items-center justify-end">
                        <BiPencil />
                        <a onClick={() => setIsEdit(false)}>Chỉnh sửa</a>
                    </div>
                </Col>
                <Col xs={24} lg={12}>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="Tên tài khoản" name="username" rules={[{ required: true, message: "Chưa điền tên tài khoản!" }]}>
                                <Input disabled />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="Email" name="email" rules={[{ type: "email", message: "Sai định dạng email!" }]}>
                                <Input disabled={isEdit} />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="Số điện thoạir" name="phoneNumber" rules={[{ required: true, message: "Chưa điền số điện thoại!" }]}>
                                <Input disabled={isEdit} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>

                <Col xs={24} lg={12}>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="Tên hiển thị" name="displayName">
                                <Input disabled={isEdit} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Họ" name="firstName">
                                <Input disabled={isEdit} />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="Tên" name="lastName">
                                <Input disabled={isEdit} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>

                <Col xs={24} lg={24}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full">
                            Lưu
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default ProfileDetail;
