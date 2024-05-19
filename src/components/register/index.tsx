import { ProForm, ProFormDatePicker, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { DatePicker } from "antd";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoleType } from "../../interfaces/enum/RoleType";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { handleErrorResponse } from "../../utils";
import { webRoutes } from "../../routes/web";

interface RegisterForm {
    username: string,
    password: string,
    confirmPassword: string,
    phoneNumber: string,
    userRole: RoleType
}
const Register = () => {
    
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);


    const handleFinish = async (value: RegisterForm) => {
        setLoading(true);
        http.post(apiRoutes.register, {
            ...value
        }).then((response) => {
            navigate(`${webRoutes.register}/${value.username}`)
            setLoading(false);
        }).catch((error) => {
            handleErrorResponse(error);
            setLoading(false);
        })
    }
    return (
        <Fragment>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-left text-opacity-30 tracking-wide">
                Đăng ký tài khoản
            </h1>
            <ProForm
                loading={loading}
                onFinish={(value: RegisterForm) => handleFinish(value)}
                onReset={() => navigate(-1)}
                submitter={
                    {
                        searchConfig:
                        {
                            submitText: 'Cập nhật',
                            resetText: 'Hủy bỏ',
                        }
                    }
                }
            >
                <ProFormText
                    name={"username"}
                    label='Tài khoản'
                    placeholder={"Tên tài khoản"}
                />
                <ProFormText.Password
                    name={"password"}
                    label='Mật khẩu'
                    placeholder={"Mật khẩu"}
                />
                <ProFormText.Password
                    name={"confirmPassword"}
                    label='Xác nhận mật khẩu'
                    placeholder={"Mật khẩu xác nhận"}
                />
                <ProFormText
                    name={"phoneNumber"}
                    label='Số điện thoại'
                    placeholder={"Điện thoại"}
                />
                <ProFormSelect
                    name={"userRole"}
                    label='Loại tài khoản'
                    valueEnum={RoleType}
                />
            </ProForm>
        </Fragment>
    )
}

export default Register;