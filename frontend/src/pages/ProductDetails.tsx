import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { FaArrowRightLong, FaChevronLeft, FaChevronRight, FaMinus, FaPlus } from 'react-icons/fa6'
import { LuTimer } from 'react-icons/lu'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper'
import { Navigation } from 'swiper/modules';
import 'swiper/css'
import 'swiper/css/navigation'
import { useNavigate, useParams } from 'react-router-dom'
import { products } from '../data/productData'

import { useLocation } from "../contexts/LocationContext";
import { formatDeliveryTime } from "../utils/FormatDeliveryTime";

import { useCart } from "../contexts/CartContext";

import { type CartItemType } from '../types/CartItemType'

const ProductDetails = () => {

    const { estimatedTime } = useLocation();
    const { addToCart, updateQuantity, cart } = useCart();

    const { productId } = useParams();

    const navigate = useNavigate();

    const rawProduct = products.find((product) => product.id === Number(productId))

    const cartItem: CartItemType = cart.find((item) => item.id === Number(productId))

    const product: CartItemType | undefined = rawProduct
        ? {
            id: rawProduct.id,
            productName: rawProduct.productName,
            productImage: rawProduct.productImage,
            productPrice: rawProduct.discountPrice,
            productMrp: rawProduct.mrp,
            unit: rawProduct.unit,
            quantity: rawProduct.quantity,
            category: rawProduct.category,
            subCategory: rawProduct.subCategory,
        }
        : undefined;

    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [showZoom, setShowZoom] = useState<boolean>(false);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const leftRef = useRef<HTMLDivElement | null>(null);
    const rightRef = useRef<HTMLDivElement | null>(null);
    const [leftScrolledToEnd, setLeftScrolledToEnd] = useState<boolean>(false);


    const swiperImages = [
        product?.productImage,
        "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none/da/cms-assets/cms/product/8622bfed-5e2d-415d-8a85-99c5fb7bac04.jpg?ts=1737543569",
        'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none/da/cms-assets/cms/product/dace7334-173f-4ab6-ad87-2209b11bc127.jpg?ts=1737543570',
        "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none/da/cms-assets/cms/product/f4d448c9-51cc-4ba4-8149-cdc65bb7c1bf.jpg?ts=1737543570",
        "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none/da/cms-assets/cms/product/7f62d4b4-743d-45e1-adfc-44ffac1d2b42.jpg?ts=1737543570",
        "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none/da/cms-assets/cms/product/91231610-e1f3-44d3-a4a0-73207aa44e60.jpg",
        "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none/da/cms-assets/cms/product/44dfacd8-f142-4d79-8c70-795e7e1832dd.jpg",
        "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none/da/cms-assets/cms/product/963fd311-08ab-45a3-8ace-e46c0da4c75d.jpg",
        "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none/da/cms-assets/cms/product/2f134c2f-2721-492e-bb49-6fcc42f1f8b4.jpg",
        "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none/da/cms-assets/cms/product/b2e1a27e-5fb4-406b-9f7f-567750124d46.jpg",
        "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none/da/cms-assets/cms/product/2488a23e-afd6-47e1-9e35-5f3cf3e96678.jpg",

    ]

    const [activeImage, setActiveImage] = useState(swiperImages[0])

    const swiperRef = useRef<SwiperType | null>(null);


    const lensSize = 300; // Square box size
    const zoomScale = 2; // Zoom level

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!imgRef.current) return
        const bounds = imgRef.current.getBoundingClientRect();
        let x = e.clientX - bounds.left;
        let y = e.clientY - bounds.top;

        // Clamp x/y so lens doesn't go outside
        x = Math.max(lensSize / 2, Math.min(bounds.width - lensSize / 2, x));
        y = Math.max(lensSize / 2, Math.min(bounds.height - lensSize / 2, y));

        setZoomPos({ x, y });
    };



    useEffect(() => {
        const leftEl = leftRef.current;
        const rightEl = rightRef.current;

        const syncScroll = (e: WheelEvent) => {
            if (!leftEl || !rightEl) return;

            const maxScroll = leftEl.scrollHeight - leftEl.clientHeight;
            const direction = e.deltaY;

            const leftAtBottom = Math.ceil(leftEl.scrollTop) >= maxScroll;
            const leftAtTop = leftEl.scrollTop <= 0;

            if (direction > 0) {
                // Scroll Down
                if (!leftAtBottom) {
                    leftEl.scrollTop += direction * 6;
                    e.preventDefault();
                    setLeftScrolledToEnd(false);
                } else {
                    setLeftScrolledToEnd(true);
                    // Allow default scroll to right
                }
            } else {
                // Scroll Up
                if (!leftAtTop) {
                    leftEl.scrollTop += direction * 6;
                    e.preventDefault();
                    setLeftScrolledToEnd(false);
                } else {
                    setLeftScrolledToEnd(false);
                    // Allow default scroll to right
                }
            }
        };

        if (rightEl) {
            rightEl.addEventListener("wheel", syncScroll, { passive: false });
        }

        return () => {
            if (rightEl) {
                rightEl.removeEventListener("wheel", syncScroll);
            }
        };
    }, []);







    const answers = [
        {
            title: 'Superfast Delivery',
            reason: 'Get your order delivered to your doorstep at the earliest from dark stores near you.',
            image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=90/assets/web/blinkit-promises/10_minute_delivery.png',
        },
        {
            title: 'Best Prices & Offers',
            reason: 'Best price destination with offers directly from the manufacturers.',
            image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=90/assets/web/blinkit-promises/Best_Prices_Offers.png',
        },
        {
            title: 'Wide Assortment',
            reason: 'Choose from 5000+ products across food, personal care, household & other categories.',
            image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=90/assets/web/blinkit-promises/Wide_Assortment.png',
        },
    ]


    return (
        <>
            {product &&
                <div className='max-w-7xl mx-auto px-4 flex h-[700px]'>
                    <div
                        ref={leftRef}
                        className='w-1/2 border-r pt-10 overflow-y-auto scrollbar-none h-full scroll-smooth'
                    >
                        <div
                            className="mx-16 relative overflow-hidden cursor-[url('https://cdn-icons-png.flaticon.com/24/748/748113.png'),_auto]"
                            onMouseEnter={() => setShowZoom(true)}
                            onMouseLeave={() => setShowZoom(false)}
                            onMouseMove={handleMouseMove}
                        >
                            <img
                                ref={imgRef}
                                src={activeImage}
                                alt="product image"
                                style={{ cursor: "url('/plus.png'), auto" }}
                                className="min-h-[30rem] w-full"
                            />

                            {showZoom && (
                                <>

                                    {/* Transparent lens box */}
                                    <div
                                        className='absolute'
                                        style={{
                                            width: lensSize,
                                            height: lensSize,
                                            left: zoomPos.x - lensSize / 2,
                                            top: zoomPos.y - lensSize / 2,
                                            background: 'transparent',
                                            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)',
                                            zIndex: 10,
                                        }}
                                    ></div>
                                </>
                            )}
                        </div>
                        <div className='py-2 flex items-center px-8 space-x-5'>
                            <button
                                onClick={() => swiperRef?.current?.slidePrev()}
                                className='p-2.5 bg-white shadow-md hover:bg-gray-50 active:bg-white rounded-full border'
                            >
                                <FaChevronLeft />
                            </button>
                            <Swiper
                                onSwiper={(swiper) => {
                                    swiperRef.current = swiper;
                                }}
                                slidesPerView={6}
                                slidesPerGroup={1}
                                modules={[Navigation]}
                                spaceBetween="10px"
                                speed={400}
                                className=''
                            >
                                {swiperImages.map((item, index) =>
                                    <SwiperSlide key={index} className=''>
                                        <button
                                            onClick={() => setActiveImage(item)}
                                            className=''>
                                            <img
                                                src={item}
                                                alt="product image"
                                                className={`${item === activeImage ? 'border-darkGreen' : 'border'} border h-[4.5rem] w-[4.5rem] rounded-lg`}
                                            />
                                        </button>
                                    </SwiperSlide>
                                )}
                            </Swiper>
                            <button
                                onClick={() => swiperRef?.current?.slideNext()}
                                className='p-2.5 bg-white shadow-md hover:bg-gray-50 active:bg-white rounded-full border'
                            >
                                <FaChevronRight />
                            </button>
                        </div>

                        <div className='px-8'>
                            <div className='my-10 font-poppins w-fit'>
                                <h1 className='font-bold'>Highlights</h1>
                                <div className='text-sm flex flex-col items-center my-3.5 bg-lightGray py-5 px-5 rounded-xl'>
                                    <p className='text-xs'>Type</p>
                                    <p className='font-medium'>White Bread</p>
                                </div>
                            </div>
                        </div>

                        {Array.from({ length: 30 }).map((_, i) => (
                            <div key={i} className="p-4 rounded">
                                Left Content {i + 1}
                            </div>
                        ))}


                    </div>






                    <div
                        ref={rightRef}
                        className={`w-1/2 pt-16 px-8 transition-all scroll-smooth duration-200 ${leftScrolledToEnd ? 'relative' : 'sticky top-0'} max-h-[700px]`}
                    >
                        {showZoom && (
                            <div
                                className='absolute inset-0 bg-no-repeat bg-cover bg-white'
                                style={{
                                    backgroundImage: `url(${activeImage})`,
                                    backgroundPosition: `${-(zoomPos.x * zoomScale - 250)}px ${-(zoomPos.y * zoomScale - 250)}px`,
                                    backgroundSize: `${100 * zoomScale}%`,
                                }}
                            />

                        )}
                        <div className='flex justify-start items-center space-x-1 font-poppins text-xs text-gray-800 font-medium'>
                            <button onClick={() => navigate('/')} className='hover:text-darkGreen transition-colors py-1'>Home</button>
                            <span>/</span>
                            <button onClick={() => navigate(`/cn/${product.category}`)} className='hover:text-darkGreen transition-colors py-1'>{product?.category}</button>
                            <span>/</span>
                            <span className='text-gray-500 py-1'>{product.productName}</span>
                        </div>
                        <div className='flex flex-col items-start justify-center my-2 space-y-0.5'>
                            <h1 className='font-poppins font-bold text-xl'>{product.productName}</h1>
                            <div className="flex items-center space-x-1 bg-[#f8f8f8] rounded w-fit px-1 py-0.5">
                                <LuTimer className="h-3 w-3 flex-shrink-0" />
                                <span className="text-[9px] font-okraish font-bold uppercase tracking-wide text-gray-900">{estimatedTime ? `${formatDeliveryTime(parseInt(estimatedTime))}` : `8 mins`}</span>
                            </div>
                        </div>
                        <div className='flex justify-between items-center border-y py-2'>
                            <div className='flex justify-start items-center space-x-2'>

                                <img
                                    src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=90/app/images/brands/logo/2088.png?ts=1712133581"
                                    alt="brand image"
                                    className='border h-9 w-9 rounded-lg'
                                />
                                <div className='text-xs font-poppins'>
                                    <p className='font-semibold tracking-wide'>Britannia</p>
                                    <p className='text-darkGreen'>Explore all products</p>
                                </div>
                            </div>
                            <div>
                                <FaArrowRightLong className='h-4 w-4 flex-shrink-0 text-gray-600 mr-4' />
                            </div>
                        </div>
                        <div className='flex justify-between items-center my-4'>
                            <div className=''>
                                <p className='font-poppins font-semibold text-xs text-gray-500'>{product.unit}</p>
                                <div className='flex items-center justify-start'>
                                    <p className='my-0.5 font-bold text'>₹{product.productPrice}</p>
                                    {product.productMrp &&
                                        <p className='my-0.5 line-through font-medium text ml-1.5 text-gray-500'>₹{product.productMrp}</p>
                                    }
                                </div>
                                <p className='text-[10px] font-medium text-gray-500'>(inclusive of all taxes)</p>
                            </div>
                            <div>
                                {cartItem?.quantity > 0 ? (
                                    <>
                                        <div
                                            className="min-w-28 flex justify-between items-center bg-darkGreen text-white font-medium text-sm py-0 border rounded-md border-[#318616]"
                                        >
                                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(cartItem.id, cartItem.quantity - 1) }} className="px-4 py-2.5"><FaMinus className="h-4 w-4 flex-shrink-0" /></button>
                                            <span className='text-lg font-medium'>{cartItem?.quantity}</span>
                                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(cartItem.id, cartItem.quantity + 1) }} className="px-4 py-2.5"><FaPlus className="h-4 w-4 flex-shrink-0" /></button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                addToCart({
                                                    id: product.id,
                                                    productName: product.productName,
                                                    productPrice: product.productPrice,
                                                    productMrp: product.productMrp,
                                                    productImage: product.productImage,
                                                    quantity: 1,
                                                    unit: product.unit,
                                                })
                                            }}
                                            className='bg-darkGreen max-w-32 text-white font-poppins px-4 py-2 rounded-md'>
                                            Add to cart
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className='my-6 font-poppins'>
                            <h1 className='font-semibold'>Why shop from shopit?</h1>
                            <div className='flex flex-col justify-center items-start space-y-3 py-2.5'>
                                {answers.map((answer, index) => (
                                    <div key={index} className='flex justify-start items-center space-x-2.5'>
                                        <img
                                            src={answer.image}
                                            alt={answer.title}
                                            className='h-14 w-14'
                                        />
                                        <div className='text-xs flex flex-col space-y-0.5'>
                                            <p className='font-medium'>{answer.title}</p>
                                            <p className='text-gray-600'>{answer.reason}</p>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>

                    </div>

                </div>
            }

            <div className='max-w-7xl border-t'></div>

        </>
    )
}

export default ProductDetails
