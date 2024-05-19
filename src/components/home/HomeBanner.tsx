import { Col, Row } from "antd";
import Slider from "react-slick";
import LazyImage from "../lazy-image";
import Banner from "../base/Banner";
import { webRoutes } from "../../routes/web";

const imagesData = [
    // {
    //     imageUrl: "https://gombattrang.vn/wp-content/uploads/2022/09/banner-danh-muc-do-tho-men-ran-day-du.jpg",
    //     title: "Đồ thờ bát tràng",
    //     subTitle: "Nhận khuyến mãi lên đến 99.000Đ khi tham gia chương trình",
    //     link: "#",
    // },
    {
        imageUrl: "https://gombattrang.vn/wp-content/uploads/2022/09/banner-danh-muc-san-pham-binh-hut-loc-gom-bat-trang.jpg",
        title: "Gốm sứ bát tràng",
        subTitle: "Gốm sứ bát tràng chính hãng cao cấp",
        link: webRoutes.products,
    }
    // {
    //     imageUrl: "https://gombattrang.vn/wp-content/uploads/2022/09/banner-danh-muc-loc-binh-gom-bat-trang.jpg",
    //     title: "Săn sale cuối tuần",
    //     subTitle: "Xem quảng cáo nhận xu, ngoài ra còn các mã giảm giá lên đến 60.000Đ đang chờ bạn",
    //     link: "#",
    // },
    // {
    //     imageUrl: "https://cf.shopee.vn/file/vn-50009109-1f18bb1d3f752570668b28ee92501320_xxhdpi",
    //     title: "Khuyến mãi sản phẩm gia đình",
    //     subTitle: "Nhận khuyến mãi lên đến 50% khi tham gia chương trình",
    //     link: "#",
    // },
    // {
    //     imageUrl: "https://gombattrang.vn/wp-content/uploads/2022/09/banner-danh-muc-qua-tang-doanh-nghiep-1.jpg",
    //     title: "Làm đẹp không giới hạn",
    //     subTitle: "Nhận khuyến mãi lên đến 50% khi tham gia chương trình",
    //     link: "#",
    // }
];

const backgroundUrl = "https://gomsuthanhtam.com/UserFile/editor/Noi-mua-bo-bat-dia-xanh-hoa-bien-gom-su-Bat-Trang-cao-cap-dung-trong-nha-hang-khach-san-sang-trong.jpg"

const settings = {
    dots: false,
    infinite: true,
    fade: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};

const HomeBanner = () => {
    return (
        <div className="bg-base flex justify-center items-center" style={{ position: 'relative', background: `url(${backgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
            <Row style={{ padding: '2% 5%' }}>
                <Col span={24}>
                    <Slider {...settings} >
                        {imagesData.map((img, index) => (
                            <Banner key={index} imageUrl={img.imageUrl} title={img.title} subTitle={img.subTitle} link={img.link}/>
                        ))}
                    </Slider>
                </Col>
            </Row>
        </div>
    )
}


export default HomeBanner;