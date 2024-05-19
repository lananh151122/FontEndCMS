import React, { useEffect, useState } from "react";
import { convertToVietnamTime, convertUTCToVietnamTime, handleErrorResponse } from "../../utils";
import { Rating } from "../../interfaces/models/rating";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { ProCard } from "@ant-design/pro-components";
import { Col, Rate, Row, Input, Button, Card, Typography, Pagination } from "antd";
import { SendOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface CommentViewProps {
    productId: string | undefined;
    type: 'product' | 'user';
    rate?: number;
    comment?: string;
}

interface RatingDto {
    productId?: string;
    point?: number;
    comment?: string;
}

const pageSize = 6;
const CommentView: React.FC<CommentViewProps> = ({ productId, type, rate, comment }: CommentViewProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [ratingDto, setRatingDto] = useState<RatingDto>({ productId: "", point: 0, comment: "" });
    const [total, setTotal] = useState<number>(0);
    const [current, setCurrrent] = useState<number>(0);
    const getRating = async () => {
        try {
            setLoading(true);
            const response = await http.get(`${apiRoutes.publicRating}/${type}/${productId}`, {
                params: {
                    page: current,
                    size: pageSize
                }
            });
            setRatings(response.data.data.data);
            setTotal(response.data.data.metadata.total)
        } catch (err) {
            handleErrorResponse(err);
        } finally {
            setLoading(false);
        }
    };

    const submitRating = async () => {
        try {
            setLoading(true);
            await http.post(`${apiRoutes.rating}/${type}`, ratingDto);
            getRating();
        } catch (err) {
            handleErrorResponse(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            getRating();
        }
        setRatingDto({
            point: 0,
            comment: '',
            productId: productId
        })
    }, [productId, current]);

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-screen-md">
                <ProCard title="Đánh giá">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Rate count={5} value={ratingDto.point} style={{ marginBottom: '16px' }} onChange={(value) => setRatingDto({ ...ratingDto, point: value })} />
                            <TextArea
                                placeholder="Nhận xét của bạn"
                                style={{ marginBottom: '16px' }}
                                value={ratingDto.comment}
                                onChange={(e) => setRatingDto({ ...ratingDto, comment: e.target.value })}
                                autoSize={{ minRows: 3, maxRows: 6 }}
                            />
                            <Button onClick={submitRating} >Gửi đánh giá</Button>
                        </Col>
                        {ratings.map((rating, index) => (
                            <Col span={24} key={index}>
                                <Card
                                    title={<Rate count={5} disabled value={rating.point} style={{ marginBottom: '16px' }} />}
                                    extra={rating.username}

                                >
                                    <Row>
                                        <Col span={24}>
                                            <TextArea
                                                readOnly
                                                autoSize={{ minRows: 3, maxRows: 6 }}
                                                value={rating.comment}
                                                style={{ marginBottom: '8px', backgroundColor: '#f5f5f5' }}
                                            />
                                        </Col>
                                        <Col span={24} className="flex justify-end">
                                            <Typography.Text className="text-blue">
                                                {convertToVietnamTime(rating.updatedAt)}
                                            </Typography.Text>
                                        </Col>
                                    </Row>

                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <Pagination total={total} pageSize={pageSize} current={current} onChange={(page) => setCurrrent(page - 1)}/>
                    {loading && <p>Loading...</p>}
                </ProCard>
            </div>
        </div>
    );
};

export default CommentView;
