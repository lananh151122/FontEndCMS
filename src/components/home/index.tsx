import React, { useEffect, useState } from "react";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { handleErrorResponse } from "../../utils";
import { ProductDataResponse, ProductInfoResponse } from "../../interfaces/interface";
import { Col, Divider, Row, Space } from "antd";
import ListCategories from "./Category";
import HotProduct from "./HotProduct";
import ListCardProduct from "./ListCardProduct";
import FooterBanner from "./FooterBanner";
import Support from "./Support";
import { useDispatch } from "react-redux";
import { SyncLoader } from "react-spinners";

const imageUrls = [
    "https://cf.shopee.vn/file/vn-50009109-2eb798374b65de905510aa91380aaf62_xxhdpi",
    "https://cf.shopee.vn/file/vn-50009109-3b4844af326ff3b9c1e1793d0dbda9f3_xxhdpi",
    "https://cf.shopee.vn/file/vn-50009109-31751216f4ecebd91cd98b2aabe69c70_xxhdpi",
    "https://cf.shopee.vn/file/vn-50009109-1f18bb1d3f752570668b28ee92501320_xxhdpi",
    "https://cf.shopee.vn/file/vn-50009109-0fffe0b1b0b7e9af17ad1e53346f4311_xhdpi"
]

const HomeBanner = React.lazy(() => import('../home/HomeBanner'));
const Home = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const [nextPageLoading, setNextPageLoading] = useState<boolean>(true);
    const [hotProducts, setHotProducts] = useState<ProductDataResponse[]>([]);
    const [allProducts, setAllProduct] = useState<ProductDataResponse[]>([]);
    const [page, setPage] = useState<number>(0);
    const dispatch = useDispatch();

    const loadHotProduct = async () => {
        await http.get(`${apiRoutes.products}/hot-product`)
            .then((response) => {
                setHotProducts(response?.data?.data as ProductDataResponse[]);
            })
            .catch((err) => {
                handleErrorResponse(err);
            })
    }

    const loadAllProduct = async () => {
        try {
            setNextPageLoading(true);
            const response = await http.get(`${apiRoutes.products}`, {
                params: {
                    page: page,
                    size: 12
                }
            });
            
            setAllProduct([...allProducts, ...response?.data?.data?.data]);
            console.log("Updated all products:", [...allProducts, ...response?.data?.data?.data]);
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            setNextPageLoading(false);
        }
    };
    

    useEffect(() => {
        Promise.all([loadHotProduct()])
            .then(() => {

            })
            .catch((error) => {
                handleErrorResponse(error);
            })
            .finally(() => {
                setLoading(false)
            });

    }, []);

    useEffect(() => {
        loadAllProduct()
    }, [page])

    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <SyncLoader color="red" loading={loading} />
            </div>
        )
    } else {
        return (
            <Row className="bg-base">
                <Col span={24}>
                    <HomeBanner />
                </Col>
                <Col span={24} style={{ paddingRight: '5%', paddingLeft: '5%' }}>
                    <ListCategories />
                </Col>
                <Divider className="mb-20" />
                <Col span={24}>
                    <h1 className="text-center">Khuyến mãi Giới hạn</h1>
                </Col>
                <Col span={24} className="">
                    <h2 className="text-center">Flash Sale</h2>
                </Col>
                <Col span={24} style={{ paddingRight: '5%', paddingLeft: '5%' }}>
                    <HotProduct />
                </Col>
                <Divider className="mb-20" />
                <Col span={24} style={{ paddingRight: '5%', paddingLeft: '5%' }}>
                    <ListCardProduct title="Sản phẩm phổ biến" products={allProducts} loading={nextPageLoading} nextPage={() => setPage(page + 1)} />
                </Col>
                {/* <Col span={24} style={{ paddingRight: '5%', paddingLeft: '5%' }}>
                    <ListHotStore />
                </Col> */}
                {/* <Col span={24} style={{ marginTop: '2%', paddingRight: '15%', paddingLeft: '15%' }}>
                    <FooterBanner />
                </Col> */}
                <Col span={24} style={{ marginTop: '2%', paddingRight: '5%', paddingLeft: '5%' }}>
                    <Support />
                </Col>
                {/* <Col span={24} style={{ marginTop: '2%', paddingRight: '5%', paddingLeft: '5%' }}>
                    <ListReview />
                </Col> */}
            </Row>
        )
    }

}

export default Home;