import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide, } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

import { useCart } from "../contexts/CartContext";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { products } from "../data/productData";
import ProductCard from "./ProductCard";

import { type CartItemType } from "../types/CartItemType";


interface ProductCarouselProps {
    title: string;
    category: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, category }) => {

    const { cart } = useCart();

    const navigate = useNavigate();

    const swiperRef = useRef<SwiperType | null>(null);

    const [activeIndex, setActiveIndex] = useState<number>(0);


    const slidesPerGroup = 6;
    const slidesPerView = 6;

    const totalSlides = products.length;

    const isAtStart = activeIndex === 0;
    const isAtEnd = activeIndex + slidesPerView >= totalSlides;


    return (
        <>
            <div className="max-w-7xl mx-auto px-4 my-3">

                <div className="flex justify-between items-center">
                    <h1 className="poppins font-semibold text-2xl">{title}</h1>
                    <button onClick={() => navigate(`${`cn/${category}`}`)} className="text-green text-xl font-medium">see all</button>
                </div>

                <div className="relative px-0">

                    {/* Left Button */}
                    {!isAtStart && (
                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="absolute top-1/2 left-2 -translate-y-1/2 -translate-x-4 p-2 bg-white border rounded-full shadow-md z-10 hover:bg-gray-100 active:bg-white transition-colors duration-150"
                        >
                            <FaChevronLeft className="h-5 w-5" />
                        </button>
                    )}

                    {/* Right Button */}
                    {!isAtEnd && (
                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            className="absolute top-1/2 right-2 -translate-y-1/2 translate-x-4 p-2 bg-white border rounded-full shadow-md z-10 hover:bg-gray-100 active:bg-white transition-colors duration-150"
                        >
                            <FaChevronRight className="h-5 w-5" />
                        </button>
                    )}


                    <Swiper
                        modules={[Navigation]}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                            setActiveIndex(swiper.activeIndex);
                        }}
                        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                        slidesPerView={slidesPerView}
                        slidesPerGroup={slidesPerGroup}
                        spaceBetween={15}
                        speed={500}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                                slidesPerGroup: 2,
                            },
                            640: {
                                slidesPerView: 2,
                                slidesPerGroup: 2,
                            },
                            768: {
                                slidesPerView: 3,
                                slidesPerGroup: 3,
                            },
                            1024: {
                                slidesPerView: 5,
                                slidesPerGroup: 5,
                            },
                            1440: {
                                slidesPerView: 6,
                                slidesPerGroup: 6,
                            },
                        }}
                        className=""
                    >
                        {products
                            .filter((product) => product.category === category)
                            .map((product) => {
                                const cartItem: CartItemType = cart.find((item) => item.id === product.id) ?? {
                                    id: product.id,
                                    productName: product.productName ?? "",
                                    productPrice: product.discountPrice ?? 0,
                                    productMrp: product?.mrp,
                                    productImage: product.productImage ?? "",
                                    unit: product.unit ?? "",
                                    quantity: 0,
                                };
                                return (
                                    <SwiperSlide
                                        key={product.id}
                                        className="my-4"
                                    >
                                        <ProductCard
                                            id={product.id}
                                            image={product.productImage}
                                            name={product.productName}
                                            mrp={product.mrp}
                                            discountPrice={product.discountPrice}
                                            unit={product.unit}
                                            quantity={cartItem.quantity}
                                            cartItem={cartItem}
                                        />
                                    </SwiperSlide>
                                )
                            })}
                    </Swiper >
                </div >

            </div >
        </>
    )
}

export default ProductCarousel