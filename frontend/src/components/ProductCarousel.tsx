import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide, } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

import { useLocation } from "../contexts/LocationContext";
import { formatDeliveryTime } from "../utils/FormatDeliveryTime";

import { useCart } from "../contexts/CartContext";

import { LuTimer } from "react-icons/lu"
import { FaChevronLeft, FaChevronRight, FaMinus, FaPlus } from "react-icons/fa";

import { products } from "../data/productData";


interface ProductCarouselProps {
    title: string;
    path: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, path }) => {

    const { estimatedTime } = useLocation();
    const { cart, addToCart, updateQuantity } = useCart();


    const navigate = useNavigate();

    const swiperRef = useRef<SwiperType | null>(null);

    const [activeIndex, setActiveIndex] = useState<number>(0);


    const slidesPerGroup = 2;
    const slidesPerView = 2;

    const totalSlides = products.length;

    const isAtStart = activeIndex === 0;
    const isAtEnd = activeIndex + slidesPerView >= totalSlides;




    return (
        <>
            <div className="max-w-7xl mx-auto px-4 my-3">

                <div className="flex justify-between items-center">
                    <h1 className="poppins font-semibold text-3xl">{title}</h1>
                    <button onClick={() => navigate(`${path}`)} className="text-green text-xl font-medium">see all</button>
                </div>

                <div className="relative px-0 my-2">

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
                        className="flex flex-col"
                    >
                        {products.map((product) => {
                            const cartItem = cart.find((item) => item.id === product.id);
                            return (
                                <SwiperSlide
                                    key={product.id}
                                    className="shadow-md border rounded-md my-6"
                                >
                                    <div
                                        className="flex flex-col h-[315px] p-1"
                                    >
                                        <div className="p-1">
                                            <img src={product.productImage} className="h-36 w-full object-cover" />
                                        </div>
                                        <div className="p-3 flex flex-col justify-between flex-1">
                                            <div className="flex items-center space-x-1 bg-[#f8f8f8] rounded w-fit px-1 py-0.5">
                                                <LuTimer className="h-3 w-3 flex-shrink-0" />
                                                <span className="text-[9px] font-okraish font-bold uppercase tracking-wide text-gray-900">{estimatedTime ? `${formatDeliveryTime(parseInt(estimatedTime))}` : `8 mins`}</span>
                                            </div>
                                            <span className="font-sans font-semibold text-sm line-clamp-2 mt-1 ">{product.productName}</span>
                                            <div className="mt-auto">
                                                <span className="text-xs text-gray-500">{product.unit}</span>
                                                <div className="flex justify-between items-center mt-2">
                                                    {product.mrp ? (
                                                        <>
                                                            <div className="flex flex-col justify-center">
                                                                <span className="font-semibold text-xs">₹{product.discountPrice}</span>
                                                                <span className="font-semibold text-xs line-through text-gray-500">₹{product.mrp}</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="font-semibold text-xs">₹{product.discountPrice}</span>
                                                        </>
                                                    )}

                                                    {cartItem ? (
                                                        <>
                                                            <div
                                                                className="min-w-16 flex justify-between items-center bg-darkGreen text-white font-medium text-sm py-0 border rounded-md border-[#318616]"
                                                            >
                                                                <button onClick={() => updateQuantity(product.id, cartItem.quantity - 1)} className="px-2 py-[9px]"><FaMinus className="h-2.5 w-2.5 flex-shrink-0" /></button>
                                                                <span>{cartItem?.quantity}</span>
                                                                <button onClick={() => updateQuantity(product.id, cartItem.quantity + 1)} className="px-2 py-[9px]"><FaPlus className="h-2.5 w-2.5 flex-shrink-0" /></button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => addToCart({
                                                                    id: product.id,
                                                                    productName: product.productName,
                                                                    productPrice: product.discountPrice,
                                                                    productMrp: product.mrp,
                                                                    productImage: product.productImage,
                                                                    quantity: 1,
                                                                    unit: product.unit,
                                                                })}
                                                                className="min-w-16 text-darkGreen font-medium text-sm py-1 px-4 border rounded-md border-[#318616] bg-[#f7fff9]"
                                                            >
                                                                ADD
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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