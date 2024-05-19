import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Product } from "../../interfaces/models/product";
import BasePageContainer from "../layout/PageContainer";
import { AiFillCaretRight, AiFillCaretLeft } from "react-icons/ai";
import ProductCard from "./ProductCard";

import { ProductDataResponse } from "../../interfaces/interface";
import { Card, Col, Divider, Rate, Row, Typography } from "antd";

const { Text, Title } = Typography

const reviewData = [
    {
        username: "1 ngày 3 bữa",
        storeId: "",
        storeName: "Cửa hàng trọ",
        title: "Đánh giá sản phẩm bim bim lays",
        description: "Sản phẩm chất lượng khá tốt, hạn sử dụng còn dài, ...",
        star: 5,
    },
    {
        username: "Huy",
        storeId: "",
        storeName: "Cửa hàng trọ",
        title: "Nợ 500k nhưng chưa trả",
        description: "Hiện đang nợ 500k, chưa có tiền trả...",
        star: 4,
    },
    {
        username: "Lại là Huy",
        storeId: "",
        storeName: "Cửa hàng trọ 1",
        title: "Nợ thêm 1 triệu",
        description: "Giờ đang trốn nợ...",
        star: 5,
    },
    {
        username: "Lại là Huy tiếp",
        storeId: "",
        storeName: "Cửa hàng trọ 1",
        title: "Trốn nợ 1 tỏi",
        description: "Giờ đang trốn nợ tại gầm cầu, bốc cái bát nốt là về bờ...",
        star: 5,
    }
];


const ListReview = () => {

    return (
        <div>
            <h1 className="text-center">Đánh giá sản phẩm gần đây</h1>
            <h2 className="text-center">Dựa theo một số bài đánh giá về sản phẩm, cửa hàng giúp người dùng có thể lựa chọn sản phẩm nhanh chóng</h2>
            <Divider />
            <Row gutter={[32, 32]} className="mt-10 mb-10">
                {reviewData.map((review) => {
                    return (
                        <Col key={review.title} xs={24} sm={12} lg={6}>
                            <Card className="h-fit " title={review.title} extra={review.storeName} actions={[
                                <Rate allowHalf disabled count={review.star} defaultValue={review.star} />
                            ]}>
                                <Card.Meta
                                    className="max-h-full"
                                    title={<p className="line-clamp-1 overflow-hidden">{review.username}</p>}
                                    description={<p className="line-clamp-1 overflow-hidden">{review.description}</p>}
                                    avatar={''} />
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </div>
    );
};

export default ListReview;
