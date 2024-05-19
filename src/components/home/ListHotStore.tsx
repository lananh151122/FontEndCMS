import {
    ProCard,
    ProFormRadio,
    ProFormSwitch,
    ProList,
} from '@ant-design/pro-components';
import { Card, Col, Progress, Row, Tag } from 'antd';
import { useEffect, useState } from 'react';
import LazyImage from '../lazy-image';
import { SellerStoreResponse } from '../../interfaces/interface';
import { handleErrorResponse } from '../../utils';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';

const datas = [
    'Cửa hàng trọ',
    'Cửa hàng laptop 24/7',
    'Cửa hàng quần áo 365',
    'TechUI',
    'TechUI 2.0',
    'Cửa hàng điện tử DTD',
    'Cửa hàng đồ ăn nhanh FasttFood',
    'Đồ gia dụng HouseW',
].map((item) => ({
    title: item,
    subTitle: <Tag color="#5BD8A6">语雀专栏</Tag>,
    actions: [<a key="run">邀请</a>, <a key="delete">删除</a>],
    avatar:
        'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    content: (
        <div
            style={{
                flex: 1,
            }}
        >
            <div
                style={{
                    width: 200,
                }}
            >
                <div>发布中</div>
                <Progress percent={80} />
            </div>
        </div>
    ),
}));
const ListHotStore = () => {

    const [stores, setStores] = useState<SellerStoreResponse[]>([])

    const getStore = async () => {
        try {
            const response = await http.get(`${apiRoutes.stores}`, {
                params: {
                    page: 0,
                    size: 6
                }
            })
            setStores(response.data?.data?.data)
        } catch (err) {
            handleErrorResponse(err);
        }
    }
    useEffect(() => {
        try {
            getStore()
        } catch (err) {
            handleErrorResponse(err);
        }
    }, [])

    return (
        <div className='mb-10'>
            <h1 className='text-center mb-10 mt-10'>Cửa hàng gợi ý</h1>
            <Row gutter={[16, 16]}>
                {stores.map((store: SellerStoreResponse) => {
                    return (
                        <Col key={store.id} xs={24} lg={12} >
                            <Row className='bg-card' style={{ height: '15vh' }}>
                                <Col lg={6}>
                                    <img src={store.imageUrl} />
                                </Col>
                                <Col lg={18}>
                                    <Card
                                        bordered={false}
                                        headStyle={{ border: 'none' }}
                                        style={{ boxShadow: 'none' }}
                                        className='bg-inherit'
                                        title={store.storeName}

                                    >
                                        <Card.Meta description={store.address} />
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    )
                })}
            </Row>
        </div>
    );
};

export default ListHotStore;