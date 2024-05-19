import React, { useState } from "react";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
    dots: false,
    infinite: false,
    arrows: true,
    speed: 500,
    slidesToShow: 5,
    vertical: false,
    verticalSwiping: false,
    slidesToScroll: 1,
    autoplay: true,
    nextArrow: <AiFillCaretRight />,
    prevArrow: <AiFillCaretLeft />,
};

const ListCarousel = ({ child, setCurrentChild }: { child: any, setCurrentChild: any }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const handleImageClick = (selectedChild: any, index: number) => {
        setSelectedImageIndex(index);
        setCurrentChild(selectedChild);
    };

    return (
        <Slider {...settings}>
            {child.map((item: any, index: number) => (
                <div
                key={index}
                onClick={() => handleImageClick(item.props.src, index)}
                className={selectedImageIndex === index ? "border-red-500" : ""}
            >
                {item}
            </div>
            ))}
        </Slider>
    );
};

export default ListCarousel;
