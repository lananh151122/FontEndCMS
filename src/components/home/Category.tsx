import { ProCard } from "@ant-design/pro-components";
import { Card, Col, Row } from "antd";

interface CategoryType {
    type: string,
    imgUrl: string,
    label: string
}

const categories: CategoryType[] = [
    {
        type: "FOOD",
        imgUrl: "https://gombattrang.vn/wp-content/uploads/2022/09/bat-huong-sen-men-lam-gom-bat-trang.jpg",
        label: "Đồ thờ cúng"
    },
    {
        type: "ELECTRONICS",
        imgUrl: "https://gombattrang.vn/wp-content/uploads/2022/09/bong-hut-loc-an-phu-lien-ngu-su-khu-gom-bat-trang.jpg",
        label: "Bình bút tài lộc"
    },
    {
        type: "CLOTHING",
        imgUrl: "https://gombattrang.vn/wp-content/uploads/2022/09/an-chen-qua-tang-quai-vuong-in-logo.jpg",
        label: "Quà tặng gốm sứ"
    },
    {
        type: "BOOKS",
        imgUrl: "https://gombattrang.vn/wp-content/uploads/2022/09/tu-canh-co-do-men-mau.jpg",
        label: "Tranh sứ"
    },
    {
        type: "SPORTS",
        imgUrl: "https://gombattrang.vn/wp-content/uploads/2022/09/am-chen-men-ran-boc-dong-gom-bat-trang.jpg",
        label: "Gốm gia dụng"
    },
    {
        type: "SPORTS",
        imgUrl: "https://gombattrang.vn/wp-content/uploads/2022/09/loc-binh-bat-trang-phuc-duc-men-lam-gom-bat-trang.jpg",
        label: "Lộc bình"
    }
];

const ListCategories = () => {
    return (
        <ProCard>
            <Row className="bg-base">
                {categories.map((category) => {
                    return (
                        <Col key={category.type} xs={8} lg={4} className="flex justify-center items-center mt-10 mb-10">
                            <div>
                                <div className="flex justify-center items-center">
                                    <img src={category.imgUrl} style={{ height: 90 }} className="mb-5" />
                                </div>
                                <h2 className="text-center font-bold">{category.label}</h2>
                            </div>
                        </Col>
                    )
                })}
            </Row>
        </ProCard>
    )
}

export default ListCategories;