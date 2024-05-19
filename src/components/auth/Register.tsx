import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, message, Card, Select } from "antd";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import { NotificationType, handleErrorResponse, setPageTitle, showNotification } from "../../utils";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { webRoutes } from "../../routes/web";
import { Auth } from "../../interfaces/models/auth";
import { login } from "../../store/slices/authSlice";
import image from '../../../public/4k-bg.jpg';
const Register = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || webRoutes.home;
    const auth = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setPageTitle("Đăng nhập");
    }, []);

    useEffect(() => {
        if (auth) {
            navigate(from, { replace: true });
        }
    }, [auth]);

    const onFinish = async (values: any) => {
        try {
            const response = await http.post(`${apiRoutes.register}`, values);
            showNotification(response.data.message);
            const auth: Auth = response?.data?.data;
            console.log(response?.data?.data?.role);

            if (response?.data?.data?.role != 'USER') {
                showNotification("Vui lòng đăng nhập trang quản trị viên để sử dụng", NotificationType.ERROR);
            } else {
                dispatch(login(auth));
                navigate(from)
                showNotification(response.data.message, NotificationType.SUCCESS);
            }
        } catch (err) {
            handleErrorResponse(err)
        } finally {
            setLoading(false)
        }
    };

    return (
        <div
            className="h-screen w-full"
            style={{
                backgroundImage: "url(" + { image } + ")"
            }}>
            <div className="flex justify-center items-center h-screen">
                <Card
                    title={<p className="w-full flex justify-center">Đăng ký</p>}
                    bordered={false}
                    className={!isMobile ? `w-1/3` : ``}
                    style={{
                        boxShadow: '0 0 30px #000',
                        backdropFilter: 'blur(3px)',
                        opacity: 0.75,
                        backgroundColor: 'transparent',
                        position: 'relative',
                        zIndex: 1
                    }}>
                    <Form
                        name="register"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        size="large"
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: "Chưa nhập tài khoản!" }]}
                        >
                            <Input placeholder="Tài khoản" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: "Chưa nhập mật khẩu!" }]}
                        >
                            <Input.Password placeholder="Mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            dependencies={["password"]}
                            hasFeedback
                            rules={[
                                { required: true, message: "Chưa xác nhận mật khẩu!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("Không trùng khớp mật khẩu!")
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Xác nhận mật khấu" />
                        </Form.Item>
                        <Form.Item
                            name="phoneNumber"
                            rules={[{ required: true, message: "Chưa điền số điện thoại!" }]}
                        >
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>
                        <Form.Item
                            name="userRole"
                            rules={[{ required: true, message: "Chưa điền số điện thoại!" }]}
                        >
                            <Select placeholder="Loại tài khoản" defaultValue={'USER'}>
                                <Select.Option key={'USER'} children="Người mua hàng" />
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button className="w-full " type="primary" htmlType="submit">
                                Xác nhận
                            </Button>
                        </Form.Item>
                        <div className="flex justify-center w-full">
                            <p>Đã có tài khoản? 
                                <NavLink className="text-red" to={`${webRoutes.login}`}> Đăng nhập</NavLink>
                            </p>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Register;
