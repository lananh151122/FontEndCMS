import { Button, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";

const Banner = ({ imageUrl, title, subTitle, link }: { imageUrl: string, title: string, subTitle: string, link: string }) => {
    const navigate = useNavigate()
    return (
        <Row className="flex justify-center items-center">
            <Col lg={8}>
                <h1 className="text-white mb-5 text-center">
                    {title}
                </h1>
                <h2 className="text-white mb-10 text-center">
                    {subTitle}
                </h2>
                <div className="flex w-full">
                    <Button className="m-auto" onClick={() => navigate(link)}>
                        <p className="text-white ">
                            Tìm hiểu thêm
                        </p>
                    </Button>
                </div>
            </Col>
            <Col lg={16} className="flex justify-center items-center">
                <img style={{objectFit : "cover"}} src={imageUrl} />
            </Col>
        </Row>
    )
}

export default Banner;