import { Button, Form, Input } from "antd";
import { Fragment, useState } from "react"
import http from "../../../utils/http";
import { apiRoutes } from "../../../routes/api";
import { useNavigate, useParams } from "react-router-dom";
import { handleErrorResponse, showNotification } from "../../../utils";
import { webRoutes } from "../../../routes/web";

const Verify = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {username} = useParams();

    const sendMessageOtp = () => {
        http.post(apiRoutes.verify, {
            params : {
                username : username
            }
        })
    };

    const handleFinish = (value : any) => {
    
        http.get(apiRoutes.verify, {
            params : {
                ...value,
                username : username
            }
        }).then((response) => {
            showNotification("Xác nhận mã otp thành cộng")
            navigate(webRoutes.login)
        }).catch((error) => {
            handleErrorResponse(error)
        })
    };
    
    return (
        <Fragment>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-left text-opacity-30 tracking-wide">
                Xác nhận mã OTP
            </h1>
            <Form onFinish={handleFinish} form={form}>
                <Form.Item name="code">
                    <Input placeholder="Mã otp">

                    </Input>
                </Form.Item>
                <div className="text-center">
                    <Button
                        className="mt-4 bg-primary"
                        block
                        loading={loading}
                        type="primary"
                        size="large"
                        htmlType={'submit'}
                    >
                        Xác nhận
                    </Button>
                </div>
            </Form>
        </Fragment>
    )
}

export default Verify;