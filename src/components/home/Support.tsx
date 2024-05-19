import { Col, Divider, Row } from "antd";
import { BiChat, BiPhone } from "react-icons/bi";
import { MdEmail } from "react-icons/md";



const Support = () => {
    return (
        <div >
            <h1 className="text-center">Dịch vụ và hỗ trợ</h1>
            <h2 className="text-center">Chúng tôi có thể giúp bạn giải quyết các khiếu nại, giải quyết các lỗi sản phẩm</h2>
            <Divider />
            <Row className="mt-10 mb-10">
                <Col xs={24} lg={8} className="flex justify-center items-center"
                    style={{
                        borderRight: "1px solid #ccc",
                        padding: "16px",
                        textAlign: "center",
                    }}>
                    <div>
                        <BiChat color="red" size={'5vh'} className="mb-5 m-auto" />
                        <p className="text-center">Chat với đội ngũ chăm sóc khách hàng</p>
                    </div>
                </Col>
                <Col xs={24} lg={8} className="flex justify-center items-center"
                    style={{
                        borderRight: "1px solid #ccc",
                        padding: "16px",
                        textAlign: "center",
                    }}>
                    <div>
                        <BiPhone color="red" size={'5vh'} className="mb-5 m-auto" />
                        <p className="text-center">Liên hệ trực tiếp với chăm sóc khách hàng: 0979***206</p>
                    </div>
                </Col>
                <Col xs={24} lg={8} className="flex justify-center items-center">
                    <div>
                        <MdEmail color="red" size={'5vh'} className="mb-5 m-auto" />
                        <p className="text-center">Gửi email cho chúng tôi</p>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Support;