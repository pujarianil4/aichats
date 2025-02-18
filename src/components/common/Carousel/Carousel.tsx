import React from "react";
import { Carousel } from "antd";

interface CustomCarouselProps {
  children: React.ReactNode;
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({ children }) => {
  return (
    <div>
      <Carousel dots={false} arrows infinite={false}>
        {children}
      </Carousel>
    </div>
  );
};

export default CustomCarousel;
