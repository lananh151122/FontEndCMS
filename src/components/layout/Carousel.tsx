import { ReactNode } from "react";
import Slider from "react-slick";


const Carousel = ({ images, loading, title } : {images : string[], loading : boolean, title : string}) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1, 
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false
  };

  return (
    <div>
      <h2>{title}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Slider {...settings} >
          {images.map((image, index) => (
            <CarouselItem key={index} image={image} />
          ))}
        </Slider>
      )}
    </div>
  );
};

const CarouselItem = ({ image } : {image : string}) => (
  <div>
    <img src={image} width="100%" alt="" />
  </div>
);

export default Carousel;
