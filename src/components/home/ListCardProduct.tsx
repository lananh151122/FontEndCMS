import React from "react";
import { ProductDataResponse } from "../../interfaces/interface";
import { Card, Col, Row } from "antd";
import LazyImage from "../lazy-image";
import { formatCurrency } from "../../utils";
import { ImStarFull } from "react-icons/im";
import { GrFormView } from "react-icons/gr";
import { SyncLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { webRoutes } from "../../routes/web";

interface ListCardProductProps {
    title : string;
    products: ProductDataResponse[];
    loading?: boolean;
    nextPage?: any;
}

const ListCardProduct = ({title, products, loading, nextPage }: ListCardProductProps) => {
    const navigate = useNavigate();

    const handleCardHover = (productId: string, isHovered: boolean) => {
        const cardElement = document.getElementById(productId);
        if (cardElement) {
            cardElement.style.backgroundColor = isHovered ? '#f0f0f0' : 'inherit';
        }
    };

    return (
        <Col span={24} className="mb-10">
            <h1 className="text-center">{title}</h1>
            <Row gutter={[32, 32]}>
                {products.map((product) => (
                    <Col xs={12} sm={8} md={6} lg={6} xl={4} key={product.productId}>
                        <Card
                            id={product.productId}
                            style={{
                                borderRadius: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 5px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'box-shadow 0.3s ease-in-out',
                                padding: 1,
                            }}
                            hoverable
                            onMouseOver={() => handleCardHover(product.productId, true)}
                            onMouseOut={() => handleCardHover(product.productId, false)}
                            onClick={() => navigate(`${webRoutes.products}/${product.productId}`)}
                        >
                            <div>
                                <LazyImage src={product.imageUrl} />
                            </div>
                            <Card.Meta
                                title={<h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>{product.productName}</h3>}
                                description={
                                    <Row>
                                        <Col xs={12} lg={12}>
                                            <div className="flex justify-start items-center">
                                                <p className="xs">
                                                    {product.productRate.avgPoint.toFixed(0)}
                                                </p>
                                                <ImStarFull
                                                    style={{ marginTop: '1%', paddingLeft: '1%', paddingRight: '5%' }}
                                                    size={'15px'}
                                                    color="yellow"
                                                />
                                            </div>
                                            
                                        </Col>
                                        <Col xs={12} lg={12}>
                                        <div className="flex justify-start items-center text-red">
                                                <p>{formatCurrency(product.minSellPrice)}</p>
                                            </div>
                                            </Col>
                                        {/* <Col xs={12} lg={12}>
                                            <div className="flex justify-center items-center">
                                                <p>{product.totalView} </p>
                                                <GrFormView />
                                            </div>
                                        </Col> */}
                                    </Row>
                                }
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
            <div onClick={nextPage} style={{ textAlign: 'center', marginTop: '16px' }}>
                {!loading ? <a>{`Xem thêm`}</a> : <SyncLoader loading={true} color="red" />}
            </div>
        </Col>
    );
};

export default React.memo(ListCardProduct);
