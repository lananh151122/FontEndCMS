import React from "react";
import { Card, Rate, Typography, Tag, Button, Space } from "antd";
import { Product } from "../../interfaces/models/product";
import { useNavigate } from "react-router-dom";
import { webRoutes } from "../../routes/web";
import LazyImage from "../lazy-image";
import { BiSolidCartAdd } from "react-icons/bi";
import { formatCurrency } from "../../utils";
import { ProductDataResponse } from "../../interfaces/interface";

const { Text, Title } = Typography;

const ProductCard = ({ product }: { product: ProductDataResponse }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`${webRoutes.products}/${product.productId}`);
    };


    return (
        <div
            className='rounded-none relative h-full bg-white border border-gray-300 shadow-sm hover:shadow-md transition duration-300 flex flex-col w-11/12 min-h-max'
            onClick={handleCardClick}
        >
            <div className="flex-grow h-full">
                {product.maxDiscountPercent > 0 && <div className="absolute top-0 right-0 bg-semiYellow"><p className="sx text-red p-1">-{product.maxDiscountPercent}%</p></div>}
                <LazyImage className="w-full h-auto overflow-hidden" src={product.imageUrl} />
                
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between h-full">
                <div>
                    <div className="h-12">
                        <p className="sx overflow-hidden line-clamp-2">
                            {product.productName}
                        </p>
                    </div>
                    <p>{formatCurrency(product.minSellPrice)}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
