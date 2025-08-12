import { useCart } from "../contexts/CartContext";
import { LuTimer } from "react-icons/lu"

import { useLocation } from "../contexts/LocationContext";
import { formatDeliveryTime } from "../utils/FormatDeliveryTime";
import { FaMinus, FaPlus } from "react-icons/fa";

import { Link } from "react-router-dom";

// import { type ProductType } from "../types/ProductTypeProps";

interface CartItemType {
    id: number;
    quantity: number;
}


interface ProductType {
    prodId: number;
    name: string;
    brand: string;
    category: string;
    subCategory: string;
    price: number;
    mrp: number;
    discount: number;
    unit: string;
    type: string;
    stockQuantity: number;
    minStock: number;
    description: string;
    mainImageUrl: {
        url: string;
        public_id: string;
    };
    galleryUrls: {
        url: string;
        public_id: string;
    }[];
    cartItem: CartItemType;
}


type ProductCardProps = Pick<
    ProductType,
    'prodId' | 'mainImageUrl' | 'name' | 'mrp' | 'price' | 'discount' | 'unit' | 'cartItem'
>;

const ProductCard = ({ prodId, mainImageUrl, name, unit, mrp, price, discount, cartItem }: ProductCardProps) => {
    const { estimatedTime } = useLocation();
    const { addToCart, updateQuantity } = useCart();

    return (
        <>
            <Link to={`/pn/${name}/pid/${prodId}`}
                className="relative flex flex-col min-w-full border shadow-md rounded-lg bg-white h-[300px] p-1"
            >
                {discount > 0 &&
                    <div className="absolute top-0 left-3 z-10 w-full">
                        <div className="relative flex flex-col justify-center items-center -space-y-1 bg-blue-600/90 text-white h-8 w-8">
                            <p className="text-[10px] font-semibold font-poppins">{discount}%</p>
                            <p className="text-[9px] font-bold">OFF</p>
                            <svg
                                className="absolute -bottom-0.5 left-0 w-8"
                                viewBox="0 0 100 10"
                                preserveAspectRatio="none"
                                height="5"
                            >
                                {/* 4 upward triangles, each 25 units wide */}
                                <polygon
                                    fill="white"
                                    points="0,10 12.5,0 25,10 37.5,0 50,10 62.5,0 75,10 87.5,0 100,10"
                                />
                            </svg>
                        </div>
                    </div>
                }


                <div className="p-2 w-full flex justify-center items-center">
                    <img
                        src={mainImageUrl.url || "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none/da/cms-assets/cms/product/8622bfed-5e2d-415d-8a85-99c5fb7bac04.jpg?ts=1737543569"}
                        className="h-32 w-full object-cover"
                    />
                </div>
                <div className="p-3 flex flex-col justify-between flex-1 text-left">
                    <div className="flex items-center space-x-1 bg-[#f8f8f8] rounded w-fit px-1 py-0.5">
                        <LuTimer className="h-3 w-3 flex-shrink-0" />
                        <span className="text-[9px] font-bold uppercase tracking-wide text-gray-900">{estimatedTime ? `${formatDeliveryTime(parseInt(estimatedTime))}` : `8 mins`}</span>
                    </div>
                    <span className="font-sans font-semibold text-sm line-clamp-2 mt-1 capitalize">{name || ""}</span>
                    <div className="mt-auto">
                        <span className="text-xs text-gray-500">{unit || '500g'}</span>
                        <div className="flex justify-between items-center mt-2">
                            {mrp > price ? (
                                <>
                                    <div className="flex flex-col justify-center">
                                        <span className="font-semibold text-xs">₹{price}</span>
                                        <span className="font-semibold text-xs line-through text-gray-500">₹{mrp}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className="font-semibold text-xs">₹{price}</span>
                                </>
                            )}

                            {cartItem?.quantity ? (
                                <>
                                    <div
                                        className="min-w-16 flex justify-between items-center bg-darkGreen text-white font-medium text-sm py-0 border rounded-md border-[#318616]"
                                    >
                                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(prodId, cartItem.quantity - 1) }} className="px-2 py-[9px]"><FaMinus className="h-2.5 w-2.5 flex-shrink-0" /></button>
                                        <span>{cartItem?.quantity}</span>
                                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(prodId, cartItem.quantity + 1) }} className="px-2 py-[9px]"><FaPlus className="h-2.5 w-2.5 flex-shrink-0" /></button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            addToCart({
                                                id: prodId,
                                                quantity: 1,

                                            })
                                        }}
                                        className="min-w-16 text-darkGreen font-medium text-sm py-1 px-4 border rounded-md border-[#318616] bg-[#f7fff9]"
                                    >
                                        ADD
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default ProductCard
