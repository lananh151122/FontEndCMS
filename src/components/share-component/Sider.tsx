import React, { useState } from "react";
import { Button, Card, Col, Rate, Row, Tag, Typography } from "antd";
import defaultImage from "../../assets/img/product-default-image.png";
import LazyImage from "../lazy-image";
import { formatCurrency, formatQuantity } from "../../utils";
import { ProductDataResponse } from "../../interfaces/interface";
import { ImNext } from "react-icons/im";
import { BiLeftArrow, BiRightArrow, BiSolidChevronRightCircle } from "react-icons/bi";
import { AiOutlineLeft, AiOutlineLeftCircle, AiOutlineRight, AiOutlineRightCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { webRoutes } from "../../routes/web";

const { Text, Title } = Typography;

const ProductCarousel = ({ products }: { products: ProductDataResponse[] }) => {
    const navigate = useNavigate();
    const size = 4;
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNextPage = () => {
        const newIndex = currentIndex + size;
        if (newIndex < products.length) {
            setCurrentIndex(newIndex);
        }
    };

    const handlePrevPage = () => {
        const newIndex = currentIndex - size;
        if (newIndex >= 0) {
            setCurrentIndex(newIndex);
        }
    };

    const renderProductCard = (product: ProductDataResponse) => {
        const imageUrl = product.imageUrl || defaultImage;
        const discountPrice = product.maxSellPrice - product.minSellPrice;

        const renderPrice = () => {
            if (product.minSellPrice !== product.maxSellPrice) {
                if (product.minOriginPrice !== product.maxOriginPrice) {
                    return (
                        <div className="flex justify-around">
                            <Text delete className="text-sm">
                                {formatCurrency(product.maxOriginPrice)}
                            </Text>
                            <Text className="text-sm">
                                &nbsp;- {formatCurrency(product.minSellPrice)}
                            </Text>
                        </div>
                    );
                } else {
                    return (
                        <Text className="text-sm">
                            {formatCurrency(product.minSellPrice)} - {" "}
                            {formatCurrency(product.maxSellPrice)}
                        </Text>
                    );
                }
            } else {
                return (
                    <Text>{formatCurrency(product.minSellPrice)}</Text>
                );
            }
        };

        return (
            <Col span={24 / size} key={product.productId}>
                <div>
                    <Card
                        onClick={() => navigate(`${webRoutes.products}/${product.productId}`)}
                        hoverable
                        cover={
                            <LazyImage
                                className="w-full h-auto overflow-hidden"
                                placeholder={<img src={defaultImage} className="w-full" />}
                                src={imageUrl}
                            />
                        }
                        bordered
                        className="rounded-none"
                        style={{width : "98%"}}
                    >
                        <Text className="line-clamp-3 text-xs h-12">
                            {product.productName}
                        </Text>
                        <div className="text-xs h-10">
                            {discountPrice > 0 && (
                                <Tag color="yellow">giảm {formatCurrency(discountPrice)}</Tag>
                            )}
                        </div>
                        <div className="flex text-xs h-7">{renderPrice()}</div>
                        <div className="flex text-xs h-7 items-center">
                            <Rate style={{fontSize : '15px'}} allowHalf disabled defaultValue={product.productRate.avgPoint} />
                            <div>
                                Đã bán {formatQuantity(product.totalSell)}
                            </div>
                        </div>
                        <div className="flex text-xs h-5">
                            {product.sellerUsername}
                        </div>
                    </Card>
                </div>
            </Col>
        );
    };

    const displayedProducts = products?.slice(currentIndex, currentIndex + size);

    return (
        <div className="relative">
            <Button
                icon={<AiOutlineLeftCircle style={{ fontSize: '24px' }} />}
                onClick={handlePrevPage}
                hidden={currentIndex === 0}
                className="absolute left-0 transform"
                style={{
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                }}
            />

            <Button
                icon={<AiOutlineRightCircle style={{ fontSize: '24px' }} />}
                onClick={handleNextPage}
                hidden={currentIndex + size >= products.length}
                className="absolute right-0 transform"
                style={{
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                }}
            />

            <div
                className="transition-transform transform relative"
                style={{
                    display: "flex",
                    transition: "transform 0.3s ease-in-out",
                }}
            >
                {displayedProducts?.map((product) => renderProductCard(product))}
            </div>
        </div>
    );
};

export default ProductCarousel;
