import React, { useEffect, useState } from "react";
import { PageContainer } from "@ant-design/pro-components";
import { BreadcrumbProps, Button, Col, Input, InputNumber, Rate, Row, Tag, Typography } from "antd";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { webRoutes } from "../../routes/web";
import ListCarousel from "../listCarousel";
import BasePageContainer from "../layout/PageContainer";
import LazyImage from "../lazy-image";
import { NotificationType, formatCurrency, handleErrorResponse, showNotification } from '../../utils/index'
import { BiCartAdd } from "react-icons/bi";
import QuantityInput from "../quantityInput";
import { ProductDataResponse, ProductDetailInfoResponse, ProductDetailResponse, UploadImageData, UserVoucherResponse } from "../../interfaces/interface";
import ListCardProduct from "../home/ListCardProduct";
import CommentView from "./comment";
const { Text } = Typography;

const ProductDetailView = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>()
    const [product, setProduct] = useState<ProductDetailResponse>();
    const [currentImage, setCurrentImage] = useState<string>();
    const [selectedProductDetail, setSelectedProductDetail] = useState<ProductDetailInfoResponse>();
    const [quantity, setQuantity] = useState<any>(1);
    const [selectedStoreId, setSelectedStoreId] = useState<string>();
    const [productSuggest, setProductSuggest] = useState<ProductDataResponse[]>([])
    const [vouchers, setVouchers] = useState<UserVoucherResponse[]>([])
    const getProductDetail = async () => {
        try {
            setLoading(true);
            const response = await http.get(`${apiRoutes.products}/${productId}`);
            const productData = response.data.data as ProductDetailResponse;
            setProduct(productData);
            setCurrentImage(productData?.imageUrls[0].url);
        } catch (error) {
            handleErrorResponse(error)
        } finally {
            setLoading(false);
        }
    };

    const getSuggestProdut = async () => {
        try {
            setLoading(true);
            const response = await http.get(`${apiRoutes.products}/suggest/${productId}`);
            const productData = response.data.data as ProductDataResponse[];
            setProductSuggest(productData);
        } catch (error) {
            handleErrorResponse(error)
        } finally {
            setLoading(false);
        }
    }
    const getPublicVoucher = async () => {
        try {
            const response = await http.get(`${apiRoutes.public_voucher}/${productId}`);
            const voucherData = response.data.data as UserVoucherResponse[];
            setVouchers(voucherData);
        } catch (error) {
            handleErrorResponse(error)
        } finally {
        }
    }
    const saveVoucher = async (voucherStoreId: string) => {
        try {
            const response = await http.get(`${apiRoutes.voucher}/receive/voucher-code`, {
                params: {
                    voucherStoreId: voucherStoreId
                }
            });
            showNotification("Nhận mã voucher thành công", NotificationType.SUCCESS)
        } catch (error) {
            handleErrorResponse(error)
        } finally {
            setLoading(false);
            getPublicVoucher();
        }
    }

    useEffect(() => {
        getProductDetail();
        getSuggestProdut();
        getPublicVoucher();
    }, [location]);

    const addToCart = async (isNavigate ?: boolean) => {
        try {
            if (!selectedStoreId) {
                showNotification("Chưa chọn cửa hàng bán", NotificationType.ERROR)
            } else {
                let res = await http.post(`${apiRoutes.cart}`, {
                    productDetailId: selectedProductDetail?.id,
                    storeId: selectedStoreId,
                    quantity: quantity,
                })
                showNotification(res?.data?.message)
            }
            if(isNavigate) {
                navigate(webRoutes.cart);
            }
        } catch (error) {
            handleErrorResponse(error);
        }

    }
    const ListImage = product?.imageUrls?.map((image: UploadImageData, index) => (
        <LazyImage key={index} src={image.url} className="w-full h-auto p-1" />
    )) || [];

    const productName = product ? product.productName : "";
    const breadcrumb: BreadcrumbProps = {
        items: [
            {
                key: webRoutes.home,
                title: <Link to={webRoutes.home}>Trang chủ</Link>,
            },
            {
                key: webRoutes.products,
                title: <Link to={webRoutes.products}>Sản phẩm</Link>,
            },
            {
                key: `${webRoutes.products}/${productId}`,
                title: productName,
            },
        ],
    };



    const handleStoreClick = (storeId: string) => {
        if (selectedStoreId === storeId) {
            {
                setSelectedStoreId(undefined)
            }
        } else {
            setSelectedStoreId(storeId);
        }

    };

    const handleProductDetail = (productDetail: ProductDetailInfoResponse) => {
        console.log(productDetail);

        if (selectedProductDetail === productDetail) {
            {
                setSelectedProductDetail(undefined)
            }
        } else {
            setSelectedProductDetail(productDetail);
        }
        console.log(selectedProductDetail);
    }
    const renderPrice = () => {
        return (
            <div className="mt-5 flex items-center bg-slate-100">
                {selectedProductDetail?.discountPercent ? (
                    <>
                        <Text delete className="text-2xs text-gray-500 pr-2">
                            {formatCurrency(selectedProductDetail.originPrice)}
                        </Text>
                        <Text className="text-2xl text-red pr-2">
                            {formatCurrency(selectedProductDetail.sellPrice)}
                        </Text>
                        <Tag color="red" className="flex items-center">
                            <span className="pr-1">{selectedProductDetail.discountPercent}% giảm</span>
                        </Tag>
                    </>
                ) : (
                    <Text className="text-2xl text-red">
                        {formatCurrency(selectedProductDetail?.sellPrice)}
                    </Text>
                )}
            </div>
        );
    };


    const renderVoucher = (vouchers: UserVoucherResponse[]) => {
        return (
            <Row>
                <Col span={6}>
                    Mã giảm giá
                </Col>
                <Col span={18} className="flex">
                    {vouchers.map((voucher: UserVoucherResponse) => {
                        console.log(voucher.isLimited);
                        return (
                            <div>
                                {voucher.isLimited == true ?
                                    <>
                                        <Tag key={voucher.voucherStoreId}
                                            color="gray"
                                            className="cursor-pointer"
                                        >
                                            <p className="pr-1">{voucher.value}{voucher.discountType == 'PERCENT' ? '%' : ''}</p>
                                        </Tag>
                                    </>
                                    :
                                    <>
                                        <Tag key={voucher.voucherStoreId}
                                            color="red"
                                            className="cursor-pointer"
                                            onClick={() => saveVoucher(voucher.voucherStoreId)}
                                        >
                                            <p className="pr-1">{voucher.value}{voucher.discountType == 'PERCENT' ? '%' : ''}</p>
                                        </Tag>
                                    </>}
                            </div>
                        )
                    })}
                </Col>
            </Row>
        );
    }
    const renderProductInfo = () => {
        return (
            <div>
                {product?.productInfos.map((productInfo) => {
                    return (
                        <Row className="mb-8 mt-8" key={productInfo.label}>
                            <Col span={6} >
                                {productInfo.label} :
                            </Col>
                            <Col span={18} >
                                {productInfo.value}
                            </Col>
                        </Row>
                    )
                })}
            </div>

        );
    }

    const renderStores = () => {
        return (
            <div>
                <Row>
                    <Col span={6}>
                        Cửa hàng bán :
                    </Col>
                    <Col span={18}>
                        {product?.stores.map((store) => {
                            if (store.id === selectedStoreId) {
                                return <Tag key={store.id} color="red" className="cursor-pointer" onClick={() => handleStoreClick(store.id)}>{store.storeName}</Tag>;
                            } else {
                                return <Tag key={store.id} color="default" className="cursor-pointer" onClick={() => handleStoreClick(store.id)}>{store.storeName}</Tag>;
                            }
                        })}
                    </Col>
                </Row>
            </div>
        );
    };

    const renderProductDetail = () => {
        return (
            <Row className="mt-8 mb-8">
                <Col span={6}>
                    Loại sản phẩm:
                </Col>
                <Col span={18}>
                    <Row>
                        {
                            product?.productDetails.map((productDetail) => (
                                <Col
                                    className="mt-1 mb-1"
                                    key={productDetail.id}
                                >
                                    <Tag
                                        className="cursor-pointer"
                                        color={productDetail.id === selectedProductDetail?.id ? productDetail.type.color : 'default'}
                                        onClick={() => handleProductDetail(productDetail)}
                                    >
                                        {productDetail.type.type}
                                    </Tag>

                                </Col>
                            ))
                        }

                    </Row>
                </Col>
            </Row>
        )
    }

    return (
        <Row gutter={[16, 32]}>
            <Col span={24}>
                <BasePageContainer loading={loading} breadcrumb={breadcrumb}>
                    <Row gutter={[128, 16]} className="flex justify-center items-center">
                        <Col xs={24} lg={8} className="lg:col-span-6 xl:col-span-4">
                            <div className="flex justify-center mt-1">
                                <img className="w-full h-auto rounded-lg" src={currentImage} alt={productName} />
                            </div>
                            <div className="pt-5">
                                <ListCarousel child={ListImage} setCurrentChild={setCurrentImage} />
                            </div>
                        </Col>
                        <Col xs={24} lg={16} className="lg:col-span-6 xl:col-span-8">
                            {product && (
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-xl font-semibold">{product?.productName}</h1>
                                    </div>
                                    <div className="mt-3 h-6 text-sm">
                                        <Row className="flex items-center">
                                            <Col span={1}>
                                                <Text className="text-red  underline">
                                                    {product?.rate?.avgPoint}
                                                </Text>
                                            </Col>
                                            <Col span={6}>
                                                <Rate disabled allowHalf value={product?.rate.avgPoint} className="text-red text-xs" />
                                            </Col>
                                            <Col span={6} className="flex items-center text-xs">
                                                <Text className="flex items-center">|   {product.rate.totalRate}</Text>
                                                &nbsp;đánh giá
                                            </Col>
                                            <Col span={6} className="text-xs flex items-center">
                                                <Text >|   {product.totalView}</Text>
                                                &nbsp;lượt xem
                                            </Col>
                                            <Col span={5} className="flex justify-end">
                                                <NavLink to="#">Tố cáo</NavLink>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="mt-5">
                                        {renderPrice()}
                                        {renderVoucher(vouchers)}
                                        {renderProductInfo()}
                                        {renderStores()}
                                        {renderProductDetail()}

                                        <Row className="flex items-center mt-5">
                                            <Col span={6}>
                                                Số lượng:
                                            </Col>
                                            <Col span={18}>
                                                <QuantityInput quantity={quantity} setQuantity={setQuantity} limit={selectedProductDetail?.quantity} disable={false} />
                                            </Col>
                                        </Row>

                                        <Row className="pt-5 flex justify-around">
                                            <Button type="default" icon={<BiCartAdd />} onClick={() => addToCart()}>Thêm vào giỏ hàng</Button>
                                            <Button type="primary"
                                                onClick={() => {
                                                    addToCart(true);
                                                }}>Mua ngay</Button>
                                        </Row>
                                    </div>
                                </div>
                            )}
                        </Col>

                    </Row>
                </BasePageContainer>
            </Col>
            <Col span={24} className="ww-11/12 flex justify-center items-center bg-card">
                <ListCardProduct title="Sản phẩm tương tự" products={productSuggest} loading={loading} nextPage={() => console.log('nextpage')} />
            </Col>
            <Col span={24}>
                <CommentView type={'product'} productId={productId} rate={product?.yourRate} comment={product?.comment} />
            </Col>
        </Row>
    );
};

export default ProductDetailView;
