import { Button, Card, Col, Row } from "antd";
import VideoBackground from "../base/Video";
import { ProCard } from "@ant-design/pro-components";
import CountdownTimer from "../base/CountDownTime";

const backgroundUrl = 'Company.jpg'
const FooterBanner = () => {
    return (
        <Row className="bg-base flex justify-center items-center"
            style={{
                height: '50vh',
                position: 'relative',
                background: `url(${backgroundUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
            <Col lg={2} className="flex justify-center">

            </Col>
            <Col lg={8} className="flex justify-center">
                <div className="bg-card p-10 shadow-lg">
                    <div className="w-5/6 mb-5">
                        <h1>Đăng ký bán hàng</h1>
                    </div>
                    <div className="w-5/6 mb-5">
                        <h2>Trở thành người bán hàng trên E-web ngay bay giờ để nhận những ưu đãi </h2>
                    </div>
                    <div className="w-5/6 mb-5">
                        <CountdownTimer initialTime={10000000} />
                    </div>
                    <div className="w-5/6 mb-5">
                        <Button
                            style={{
                                padding: '15',
                                borderRadius: '50%',
                                backgroundColor: 'lightsteelblue'
                            }}
                        >
                            <p className="text-white">Đăng ký {'>>>'}</p>
                        </Button>
                    </div>
                </div>

            </Col>
            <Col lg={2} className="flex justify-center">

            </Col>
            <Col lg={12}>
            </Col>

        </Row>

    )
}

export default FooterBanner;