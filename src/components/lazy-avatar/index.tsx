import { useState, Fragment, useEffect } from 'react';
import defaultImage from '../../assets/img/product-default-image.png'
import { Avatar } from 'antd';
import SkeletonAvatar from 'antd/es/skeleton/Avatar';
import { ImUser } from 'react-icons/im';

export interface LazyAvatarProps {
  src: string;
  icon?: any;
  [key: string]: string | React.ReactNode | undefined;
}

const LazyAvatar = ({ src,icon, ...rest }: LazyAvatarProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const imageToLoad = new Image();
    imageToLoad.src = src;

    imageToLoad.onload = () => {
      setLoading(false);
    };
  }, [src]);

  return (
    <Fragment>{loading ? <Avatar size={'large'} className='flex justify-center items-center' icon={icon == undefined ? <ImUser /> :icon } shape='square'/> : <Avatar size={'large'} className='flex justify-center items-center'src={src} {...rest}/>}</Fragment>
  );
};

export default LazyAvatar;
