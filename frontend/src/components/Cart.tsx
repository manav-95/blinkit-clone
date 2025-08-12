import { useRef, useEffect, useState } from 'react'

import { useCart } from '../contexts/CartContext'
import { FaX } from 'react-icons/fa6';
import { BiSolidFoodMenu } from 'react-icons/bi';
import { GiScooter } from 'react-icons/gi';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { BsHandbagFill } from 'react-icons/bs';
import { FaChevronRight, FaMinus, FaPlus } from 'react-icons/fa';

import { useLocation } from "../contexts/LocationContext";
import { formatDeliveryTime } from '../utils/FormatDeliveryTime'

import { useAuth } from "../contexts/AuthContext";
import axios from 'axios';
import { LuPlus } from 'react-icons/lu';

import MapWithCenterPointer from './MapWithCenterPointer'
import AddressForm from './AddressForm';

import { jwtDecode } from 'jwt-decode'


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

type JwtToken = {
    phone: string;
    id: string;
}

type UserAddressesType = {
    name: string;
    phone: string;
    area: string;
    addressType: string;
    floor: string;
    landmark: string;
    flatName: string;
}

const Cart = () => {

    const { cartOpen, setCartOpen, cart, updateQuantity, DeliveryCharge, discountedTotalPrice, originalTotal, savedAmount } = useCart();
    const { estimatedTime, openAddressWindow, setOpenAddressWindow } = useLocation();

    const { setLoginBox, loggedIn } = useAuth();

    const cartModalRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);


    const [products, setProducts] = useState<ProductType[] | []>([]);

    const [addressStep, setAddressStep] = useState<boolean>(false)

    const [userAddresses, setUserAddresses] = useState<UserAddressesType[] | []>([])

    const [selectedAddressToProceed, setSelectedAddressToProceed] = useState<UserAddressesType | null>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const clickedOutsideCart = cartModalRef.current && !cartModalRef.current.contains(e.target as Node);
            const clickedOutsideMap = mapRef.current && !mapRef.current.contains(e.target as Node);

            if (clickedOutsideCart && clickedOutsideMap) {
                setCartOpen(false);
                setOpenAddressWindow(false);
                setAddressStep(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    useEffect(() => {
        if (cart.length === 0) setCartOpen(false)
    })

    useEffect(() => {
        const getProductDetails = async () => {
            try {
                const cartItems: CartItemType[] = JSON.parse(localStorage.getItem("cart") || "[]");
                // console.log("Cart Items:", cartItems);

                // Make individual API requests for each item.id
                const productPromises = cartItems.map(async (item: CartItemType) => {
                    const res = await axios.get(`${baseUrl}/products/${item.id}`);
                    return {
                        ...res.data.product,
                        cartItem: {
                            quantity: item.quantity, // manually attach quantity here
                        },
                    };
                });

                const results = await Promise.all(productPromises);
                setProducts(results);
                console.log("Cart Products:", results);
            } catch (error) {
                console.log("Error Fetching Product details:", error);
            }
        };

        getProductDetails();
    }, []);


    useEffect(() => {
        const getUserAddresses = async () => {
            try {
                const token = localStorage.getItem('accessToken')
                if (token) {
                    const decodedToken = jwtDecode<JwtToken>(token)
                    // const phone = decodedToken?.phone.slice(3)
                    //console.log(decodedToken)
                    const res = await axios.get(`${baseUrl}/users/${decodedToken.id}/userAddresses`)
                    if (res) {
                        console.log("Fetched Addresses: ", res.data.addresses)
                        setUserAddresses(res.data.addresses)
                    }
                }
            } catch (error) {
                console.log("Error Fetching User Addresses: ", error)
            }
        }

        getUserAddresses();
    }, [addressStep])


    useEffect(() => {
        if (selectedAddressToProceed) {
            console.log(selectedAddressToProceed)
        }
    }, [selectedAddressToProceed])


    return (
        <>

            <div
                ref={cartModalRef}
                className={`
          fixed top-0 right-0 h-screen w-[26rem] bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${cartOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
            >
                <div className="flex justify-between items-center bg-white py-4 px-6 shadow-lg">
                    <span className='poppins font-semibold'>My Cart</span>
                    <button onClick={() => setCartOpen(false)} className='p-1.5'><FaX className='h-3.5 w-3.5 flex-shrink-0' /></button>
                </div>

                {!addressStep ? (
                    <>
                        <div className='bg-slate-100 h-full overflow-y-auto flex flex-col space-y-4 px-3 pt-4 pb-[11rem]'>

                            {/* Total Savings */}
                            {savedAmount > 0 &&
                                <div className='flex justify-between bg-blue-100 text-blue-600 rounded-xl py-2.5 px-4 poppins text-sm lowercase font-medium'>
                                    <span>Your Total Saving</span>
                                    <span>₹{savedAmount}</span>
                                </div>
                            }

                            {/* Product Listing Card */}
                            <div className='bg-white px-3 py-3 rounded-2xl'>
                                {/* Clock Image And Delivery Info (Delivery Time & Total Items To Deliver)  */}
                                <div className='flex justify-start items-start space-x-3 mb-3'>
                                    <div>
                                        <img
                                            src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=180/assets/eta-icons/15-mins-filled.png"
                                            alt="clock image"
                                            className='h-12 w-12'
                                        />
                                    </div>
                                    <div className='flex flex-col justify-start items-start'>
                                        <span className='font-poppins font-bold'>{estimatedTime ? `Delivery in ${formatDeliveryTime(parseInt(estimatedTime))}` : `Delivery in 8 mins`}</span>
                                        <span className='font-poppins text-xs font-light mt-0.5'>Shipment of {cart.length} items</span>
                                    </div>
                                </div>

                                {/* Products List  */}
                                {products
                                    .filter(product => cart.find(item => item.id === product.prodId))
                                    .map((item) => {
                                        const currentQty = cart.find(c => c.id === item.prodId)?.quantity ?? 1;
                                        return (
                                            <div key={item.prodId} className='grid grid-cols-12 items-center mt-3'>
                                                <div className='grid grid-cols-9 space-x-2 py-0 justify-start col-span-9'>
                                                    <div className='col-span-3'>
                                                        <img
                                                            src={item?.mainImageUrl?.url}
                                                            alt={item.name}
                                                            className='h-20 w-20 border rounded-xl'
                                                        />
                                                    </div>
                                                    <div className='col-span-6 flex flex-col justify-center h-full items-start space-y-[2px] py-0.5'>
                                                        <p className='leading-[16px] tracking-wide text-xs line-clamp-2 font-poppins'>{item.name}</p>
                                                        <span className='text-xs font-light text-gray-600'>{item.unit}</span>
                                                        <div className='flex items-center space-x-1'>
                                                            <span className='text-sm font-medium'>₹{item.price}</span>
                                                            {item.mrp > item.price &&
                                                                <span className='line-through text-sm font-light text-gray-500'>₹{item.mrp}</span>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quantity Increment And Decrement Button */}

                                                <div className='col-span-3 flex items-center justify-center'>
                                                    <div
                                                        className="min-w-16 flex justify-between items-center bg-darkGreen text-white font-medium text-sm py-0 border rounded-md border-[#318616]"
                                                    >
                                                        <button onClick={() => updateQuantity(item?.prodId, currentQty - 1)} className="px-2 py-[9px]"><FaMinus className="h-2.5 w-2.5 flex-shrink-0" /></button>
                                                        <span>{currentQty}</span>
                                                        <button onClick={() => updateQuantity(item?.prodId, currentQty + 1)} className="px-2 py-[9px]"><FaPlus className="h-2.5 w-2.5 flex-shrink-0" /></button>
                                                    </div>
                                                </div>

                                            </div>
                                        )
                                    })}

                            </div>

                            {/* Bill Details */}
                            <div className='flex flex-col'>
                                <div className='relative bg-white px-4 py-2 rounded-t-2xl rounded-b z-10'>
                                    <h1 className='font-semibold'>Bill details</h1>
                                    <div className='flex flex-col space-y-1.5 my-1.5'>
                                        {/* Items Total */}
                                        <div className='flex justify-between items-center text-xs tracking-wide'>
                                            <span className='flex items-center space-x-2'>
                                                <BiSolidFoodMenu className='h-4 w-4 flex-shrink-0' />
                                                <span className='font-poppins'>Items total</span>
                                                {savedAmount > 0 &&
                                                    <span className='bg-blue-50 text-blue-600 font-medium rounded-sm px-1 text-[10px]'>saved ₹{savedAmount}</span>
                                                }
                                            </span>
                                            <div className='flex items-center'>
                                                {originalTotal > discountedTotalPrice &&
                                                    <span className='mr-1 line-through text-gray-500 text-sm'>₹{originalTotal}</span>
                                                }
                                                <span className='text-sm'>₹{discountedTotalPrice}</span>
                                            </div>
                                        </div>
                                        {/* Delivery Charge */}
                                        <div className='flex justify-between items-center text-xs tracking-wide'>
                                            <span className='flex items-center space-x-2'>
                                                <GiScooter className='h-4 w-4 flex-shrink-0' />
                                                <span className='font-poppins'>Delivery charge</span>
                                                <IoInformationCircleOutline className='h-4 w-4 flex-shrink-0' />
                                            </span>
                                            <div className='flex items-baseline text-sm'>
                                                {discountedTotalPrice > 99 ? (
                                                    <>
                                                        <span className='mr-1 line-through text-gray-500'>₹{DeliveryCharge}</span>
                                                        <span className='font-poppins text-blue-600'>FREE</span>
                                                    </>
                                                ) : (
                                                    <span className=''>₹{DeliveryCharge}</span>
                                                )}
                                            </div>
                                        </div>
                                        {/* Handling Charge */}
                                        <div className='flex justify-between items-center text-xs tracking-wide'>
                                            <span className='flex items-center space-x-2'>
                                                <BsHandbagFill className='h-4 w-4 flex-shrink-0' />
                                                <span className='font-poppins'>Handling charge</span>
                                                <IoInformationCircleOutline className='h-4 w-4 flex-shrink-0' />
                                            </span>
                                            <span className='text-sm'>₹2</span>
                                        </div>

                                        {/* Grand Total */}
                                        <div className='flex justify-between items-center'>
                                            <span className='font-semibold'>Grand total</span>
                                            <span className='text-base font-medium'>₹{discountedTotalPrice + 2}</span>
                                        </div>
                                    </div>

                                </div>
                                {savedAmount > 0 &&
                                    <div className='relative min-w-full flex justify-between -translate-y-0 bg-blue-100 text-blue-600 rounded-b-2xl py-3 px-4 poppins text-sm lowercase font-medium'>
                                        <span>Your Total Saving</span>
                                        <span>₹{savedAmount}</span>
                                        <div className='min-w-full absolute -left-[4px] top-0 px-1'>
                                            <img
                                                src="https://blinkit.com/b1b00b45f32220f863b4.svg"
                                                alt="curve image"
                                                className='min-w-full'
                                            />
                                        </div>
                                    </div>
                                }
                            </div>

                            {/* Cancellation Policy */}
                            <div className='bg-white px-4 py-2 rounded-2xl'>
                                <h1 className='font-poppins font-bold'>Cancellation Policy</h1>
                                <p className='text-xs font-poppins text-[#828282] my-1'>
                                    Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.
                                </p>
                            </div>

                        </div>
                        <div className='absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl -translate-x-2 px-4 py-6 z-10'>
                            <button onClick={() => {
                                if (loggedIn) {
                                    setAddressStep(true)
                                } else {
                                    setLoginBox(true)
                                }
                            }
                            }
                                className='bg-darkGreen text-white flex justify-between items-center min-w-full px-4 py-2 rounded-xl'>
                                <div className='flex flex-col justify-center -space-y-0.5'>
                                    <span className='font-semibold'>₹{discountedTotalPrice + 2}</span>
                                    <span className='font-poppins font-light text-sm tracking-wide text-gray-200'>TOTAL</span>
                                </div>
                                <div>
                                    <span className='font-poppins flex items-center'>{!loggedIn ? 'Login to proceed' : 'proceed'}<FaChevronRight className='ml-1 h-3 w-3' /></span>
                                </div>
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='px-4 py-4 bg-gray-100 h-full font-poppins'>
                            <button
                                onClick={() => setOpenAddressWindow(true)}
                                className='w-full flex justify-start items-center space-x-2 rounded-lg px-4 py-2.5 font-poppins text-sm bg-white'>
                                <LuPlus className='h-5 w-5' />
                                <span>Add a new address</span>
                            </button>
                            <div className='my-2 font-poppins text-sm'>
                                <span className='text-gray-500'>Your Saved Addresses</span>
                                <div className='flex flex-col space-y-2 my-2'>
                                    {userAddresses.map((item, index) =>
                                        <button
                                            onClick={() => {
                                                setSelectedAddressToProceed(item);
                                            }}
                                            key={index}
                                            className={` ${selectedAddressToProceed === item ? 'bg-darkGreen text-white' : 'bg-white'} rounded-lg text-xs text-start flex flex-col px-4 py-2 space-y-1`}
                                        >
                                            <span className={`${selectedAddressToProceed === item ? 'text-white' : 'text-darkGreen'}`}>{item?.addressType}</span>
                                            <span>{item?.area}</span>
                                            <span>{item?.name}</span>
                                            <span>{item?.phone}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>


                        <div className='absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl -translate-x-2 px-4 py-6 z-10'>
                            <button
                                disabled={!selectedAddressToProceed}
                                className={`${selectedAddressToProceed !== null ? 'bg-darkGreen text-white' : 'bg-gray-400 text-white'} flex justify-between items-center min-w-full px-4 py-2 rounded-xl`}
                            >
                                <div className='flex flex-col justify-center -space-y-0.5'>
                                    <span className='font-semibold'>₹{discountedTotalPrice + 2}</span>
                                    <span className='font-poppins font-light text-sm tracking-wide text-gray-200'>TOTAL</span>
                                </div>
                                <div>
                                    <span className='font-poppins flex items-center capitalize'>select an address to proceed<FaChevronRight className='ml-1 h-3 w-3' /></span>
                                </div>
                            </button>
                        </div>
                    </>
                )}

            </div>


            {openAddressWindow &&
                <div className='fixed top-0 left-0 right-0 w-full h-screen bg-black/40 z-50'>
                    <div ref={mapRef} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[55rem] h-[70vh] rounded-md overflow-hidden flex justify-center items-start'>
                        <div className='w-1/2 h-full overflow-hidden'>
                            <MapWithCenterPointer />
                        </div>
                        <div className='w-1/2 overflow-auto'>
                            <AddressForm />
                        </div>
                    </div>
                </div>
            }



        </>
    )
}

export default Cart
