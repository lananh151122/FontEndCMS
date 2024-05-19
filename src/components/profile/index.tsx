import React, { useState, useEffect } from 'react';
import { Row, Tabs, Spin, Col } from 'antd';
import { UserProfile } from '../../interfaces/interface';
import { SyncLoader } from 'react-spinners';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import { handleErrorResponse } from '../../utils';
import ProfileCard from './ProfileCard';
import ProfileDetail from './ProfileDetail';
import OrderCard from './OrderCard';
import PaymentCard from './PaymentCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { login } from '../../store/slices/authSlice';

const { TabPane } = Tabs;

const Profile = () => {
    const auth = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(true);
    const [profile, setProfile] = useState<UserProfile>();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 769); 
        };
        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const getProfile = async () => {
        try {
            const response = await http.get(`${apiRoutes.user}/profile`);
            setProfile(response.data.data);
            dispatch(login({...auth, imgUrl : response.data.data.imageUrl}));
        } catch (err) {
            handleErrorResponse(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <SyncLoader color="red" loading={loading} />
            </div>
        );
    } else {
        return (
            <div>
                <Col className={`m-auto ${!isMobile && "w-8/12"}`}>
                    <Row gutter={[32, 16]}>
                        <Col span={24}>
                            <ProfileCard profile={profile} updateProfile={() => getProfile()}>
                                <Tabs type="line" defaultActiveKey='profile'>
                                    <TabPane tab="Thông tin tài khoản" key="profile" >
                                        <ProfileDetail profile={profile} />
                                    </TabPane>
                                    <TabPane tab="Đơn hàng" key="transaction">
                                        <OrderCard />
                                    </TabPane>
                                    <TabPane tab="Thanh toán" key="payment">
                                        <PaymentCard />
                                    </TabPane>
                                </Tabs>
                            </ProfileCard>
                        </Col>
                    </Row>
                </Col>
            </div>
        );
    }
};

export default Profile;
