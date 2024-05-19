import {
    GoogleOutlined,
    LockOutlined,
    MobileOutlined,
    FacebookFilled,
    TwitterOutlined,
    UserOutlined,
    LeftOutlined
} from '@ant-design/icons';
import {
    LoginForm,
    LoginFormPage,
    ProConfigProvider,
    ProForm,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormText,
} from '@ant-design/pro-components';

import { Button, Divider, Space, Tabs, message, theme } from 'antd';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import { NotificationType, handleErrorResponse, showNotification } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { Auth } from '../../interfaces/models/auth';
import { login } from '../../store/slices/authSlice';
import { webRoutes } from '../../routes/web';

type LoginType = 'phone' | 'account';

const iconStyles: CSSProperties = {
    color: 'rgba(0, 0, 0, 0.2)',
    fontSize: '18px',
    verticalAlign: 'middle',
    cursor: 'pointer',
};

const Page = () => {
    const [loginType, setLoginType] = useState<LoginType>('account');
    const { token } = theme.useToken();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || webRoutes.home;
    const auth = useSelector((state: RootState) => state.auth);
    useEffect(() => {
        if (auth) {
            navigate(from, { replace: true });
        }
    }, [auth]);

    const loginByUsername = async (loginData: any) => {
        try {
            let response;
            if (loginData.username) {
                response = await http.post(`${apiRoutes.login}`, {
                    ...loginData
                });
            } else {
                response = await http.post(`${apiRoutes.login}/phone`, {
                    ...loginData
                });
            }
            const auth: Auth = response?.data?.data;
            console.log(response?.data?.data?.role);
            console.log(from);

            if (response?.data?.data?.role != 'USER') {
                showNotification("Vui lòng đăng nhập trang quản trị viên để sử dụng", NotificationType.ERROR);
            } else {
                dispatch(login(auth));
                navigate(from)
                showNotification(response.data.message, NotificationType.SUCCESS);
            }

        } catch (err) {
            handleErrorResponse(err)
        }
    };

    const sendOtp = async (phone: string) => {
        try {
            const response = await http.post(`${apiRoutes.account}/verify-code/${phone}`);
        } catch (error) {

        }
    }
    return (
        <div
            style={{
                backgroundColor: 'white',
                height: '100vh',
            }}
        >
            <LoginFormPage
                backgroundImageUrl="./4k-bg.jpg"
                logo="./icon.png"
                title="Đăng nhập"
                subTitle="E-WEB"
                submitter={{
                    searchConfig: {
                        submitText: 'Đăng nhập'
                    }
                }
                }
                onFinish={(value) => loginByUsername(value)}
                activityConfig={{
                    style: {
                        boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
                        color: token.colorTextHeading,
                        borderRadius: 8,
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        backdropFilter: 'blur(4px)',
                    },
                    title: 'Trang bán đồ gốm',
                    subTitle: 'Gốm sứ bát tràng chính hãng',
                    action: (
                        <Button
                            onClick={() => navigate(webRoutes.home)}
                            size="large"
                            style={{
                                borderRadius: 20,
                                background: token.colorBgElevated,
                                color: token.colorPrimary,
                                width: 120,
                            }}
                        >
                            Trang chủ
                        </Button>
                    ),
                }}
                actions={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <Divider plain>
                            <span
                                style={{
                                    color: token.colorTextPlaceholder,
                                    fontWeight: 'normal',
                                    fontSize: 14,
                                }}
                            >
                                Đăng nhập qua
                            </span>
                        </Divider>
                        <Space align="center" size={24}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    height: 40,
                                    width: 40,
                                    border: '1px solid ' + token.colorPrimaryBorder,
                                    borderRadius: '50%',
                                }}
                            >
                                <GoogleOutlined style={{ ...iconStyles, color: '#FF6A1' }} />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    height: 40,
                                    width: 40,
                                    border: '1px solid ' + token.colorPrimaryBorder,
                                    borderRadius: '50%',
                                }}
                            >
                                <FacebookFilled style={{ ...iconStyles, color: '#1677FF' }} />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    height: 40,
                                    width: 40,
                                    border: '1px solid ' + token.colorPrimaryBorder,
                                    borderRadius: '50%',
                                }}
                            >
                                <TwitterOutlined style={{ ...iconStyles, color: '#1890ff' }} />
                            </div>
                        </Space>
                        <a className='pt-5' href={`${webRoutes.register}`}>Tạo tài khoản mới</a>
                    </div>
                }
            >
                <Tabs
                    centered
                    activeKey={loginType}
                    onChange={(activeKey) => setLoginType(activeKey as LoginType)}
                >
                    <Tabs.TabPane key={'account'} tab={'Tài khoản'} />
                    <Tabs.TabPane key={'phone'} tab={'Điện thoại'} />
                </Tabs>

                {loginType === 'account' && (
                    <>
                        <ProFormText
                            name="username"
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <UserOutlined
                                        style={{
                                            color: token.colorText,
                                        }}
                                        className={'prefixIcon'}
                                    />
                                ),
                            }}
                            placeholder={'lambro25102001'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Chưa nhập tài khoản!',
                                },
                            ]}
                        />
                        <ProFormText.Password
                            name="password"
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <LockOutlined
                                        style={{
                                            color: token.colorText,
                                        }}
                                        className={'prefixIcon'}
                                    />
                                ),
                            }}
                            placeholder={'Banhmy09@'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Chưa nhập mật khẩu!',
                                },
                            ]}
                        />
                    </>
                )}
                {loginType === 'phone' && (
                    <>
                        <ProFormText
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <MobileOutlined
                                        style={{
                                            color: token.colorText,
                                        }}
                                        className={'prefixIcon'}
                                    />
                                ),
                            }}
                            name="mobile"
                            placeholder={'0979163206'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Chưa nhập số điện thoại!',
                                },
                                {
                                    pattern: /^0\d{9,10}$/,
                                    message: 'Sai định dạng số điện thoại!',
                                },
                            ]}
                        />
                        <ProFormCaptcha
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <LockOutlined
                                        style={{
                                            color: token.colorText,
                                        }}
                                        className={'prefixIcon'}
                                    />
                                ),
                            }}
                            captchaProps={{
                                size: 'large',
                            }}
                            phoneName={'mobile'}
                            placeholder={'Mã xác nhận'}
                            captchaTextRender={(timing, count) => {
                                if (timing) {
                                    return `${count} ${'giây'}`;
                                }
                                return 'Gửi mã';
                            }}
                            name="otp"
                            rules={[
                                {
                                    required: true,
                                    message: 'Chưa điền mã xác nhận',
                                },
                            ]}
                            onGetCaptcha={async (moblie: any) => {
                                await sendOtp(moblie)
                            }}
                        />
                    </>
                )}
                <div
                    className='flex justify-between items-center'
                    style={{
                        marginBlockEnd: 24,
                    }}
                >
                    <ProFormCheckbox noStyle name="autoLogin">
                        Ghi nhớ đăng nhập
                    </ProFormCheckbox>
                    <a
                        style={{
                            float: 'right',
                        }}
                    >
                        Quên mật khẩu
                    </a>
                </div>
            </LoginFormPage>
        </div>
    );
};

export default () => {
    return (
        <div>
            {/* <VideoBackground> */}
            <ProConfigProvider >
                <Page />
            </ProConfigProvider>
            {/* </VideoBackground> */}
        </div>

    );
}