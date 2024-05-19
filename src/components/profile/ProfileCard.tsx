import { ReactNode, useEffect, useState } from "react";
import { Avatar, Button, Col, Row, Typography } from "antd";
import { UserProfile } from "../../interfaces/interface";
import { formatCurrency } from "../../utils";
import UploadComponent from "../base/Upload";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import './style.css'
interface ProfileCardProps {
    profile?: UserProfile;
    children?: ReactNode;
    updateProfile : () => void;
}

const { Text } = Typography;

const ProfileCard = ({ profile, children, updateProfile }: ProfileCardProps) => {
    const [isMobile, setIsMobile] = useState(false);


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1000); // Adjust the threshold as needed
        };
        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [profile?.imageUrl]);

    return (
        <Row gutter={[16, 16]}>
            <div
                className="bg-base flex justify-center items-center background-avatar"
                style={{
                    position: 'relative',
                    background: `url(${profile?.imageUrl})`,
                    objectFit: 'contain',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat !important',
                    width: '100%',
                    minHeight: '30vh'
                }}
            />
            <Col span={24} style={{ top: -50 }} >
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={4}>
                        <Row gutter={[16, 16]}>
                            <Col span={24} className="flex justify-center">
                                <UploadComponent imgUrl={profile?.imageUrl} callBack={updateProfile}/>
                            </Col>
                            <Col span={24} className="flex justify-center">
                                <Text strong className="text-lg">{profile?.displayName}</Text>
                            </Col>
                            <Col span={24} className="flex justify-center items-center">
                                <FaMoneyCheckDollar color="gold" className="mr-2"/>
                                <Text strong className="text-base text-black">{formatCurrency(profile?.balance?.money)}</Text>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} lg={20} className="bg-base" style={!isMobile ? { top: 50 } : {}}>
                        {children}
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default ProfileCard;
