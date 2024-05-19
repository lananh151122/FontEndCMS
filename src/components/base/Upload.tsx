import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from 'antd';
import { handleErrorResponse } from '../../utils';
import { apiRoutes } from '../../routes/api';
import http from '../../utils/http';
import { FaPenClip } from 'react-icons/fa6';

interface UploadComponentProps {
    imgUrl?: string;
    callBack: (url: string) => void;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ imgUrl, callBack }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedFile) {
            uploadHandler();
        }
    }, [selectedFile]);

    const fileChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const uploadHandler = async () => {
        if (!selectedFile) {
            console.log('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile, selectedFile.name);

        try {
            const response = await http.post(`${apiRoutes.user}/uploadImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                    console.log(percentCompleted);
                },
            });
            callBack(response.data.url);
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            setSelectedFile(null);
        }
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div>
            <div className="flex justify-center" style={{ maxWidth: '80px' }}>
                <Avatar shape="circle" size={80} src={imgUrl}>
                </Avatar>
                <label
                    className='text-orange-200'
                    htmlFor="fileInput"
                    style={{ cursor: 'pointer', position: 'absolute', bottom: 1, right: 50 }}
                    onClick={(event) => {
                        event.preventDefault(); // Prevent the label from triggering the input
                        handleAvatarClick();
                    }}
                >
                    <FaPenClip style={{ fontSize: '15px', marginLeft: '10px' }} />
                </label>
                <input
                
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={fileChangedHandler}
                    ref={fileInputRef}
                />
            </div>
        </div>
    );
};

export default UploadComponent;
