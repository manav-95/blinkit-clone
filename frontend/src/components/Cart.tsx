import { useRef, useEffect } from 'react'

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


const Cart = () => {

    const { cartOpen, setCartOpen, cart, updateQuantity, discountedTotalPrice, originalTotal, savedAmount, DeliveryCharge } = useCart();
    const { estimatedTime } = useLocation();

    const { setLoginBox } = useAuth();

    const cartModalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (cartModalRef.current && !cartModalRef.current.contains(e.target as Node)) {
                setCartOpen(false)
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setCartOpen])


    useEffect(() => {
        if (cart.length === 0) setCartOpen(false)
    })

    return (
        <>
            <div
                ref={cartModalRef}
                className={`
          fixed top-0 right-0 h-screen w-[24rem] bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${cartOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
            >
                <div className="flex justify-between items-center bg-white py-4 px-6 shadow-lg">
                    <span className='poppins font-semibold'>My Cart</span>
                    <button onClick={() => setCartOpen(false)} className='p-1.5'><FaX className='h-3.5 w-3.5 flex-shrink-0' /></button>
                </div>
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
                        {cart.map((item) => (
                            <div key={item.id} className='grid grid-cols-12 items-center mt-3'>
                                <div className='grid grid-cols-9 space-x-2 py-0 justify-start col-span-9'>
                                    <div className='col-span-3'>
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className='h-20 w-20 border rounded-xl'
                                        />
                                    </div>
                                    <div className='col-span-6 flex flex-col justify-center h-full items-start space-y-[4px] py-0.5'>
                                        <p className='leading-[16px] tracking-wide text-xs line-clamp-2 font-poppins'>{item.productName}</p>
                                        <span className='text-xs font-medium text-gray-500'>{item.unit}</span>
                                        <div className='flex items-center space-x-1'>
                                            <span className='text-sm font-semibold'>₹{item.productPrice}</span>
                                            {item.productMrp &&
                                                <span className='line-through text-sm font-medium text-gray-400'>₹{item.productMrp}</span>
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity Increment And Decrement Button */}
                                <div className='col-span-3 flex items-center justify-center'>
                                    <div
                                        className="min-w-16 flex justify-between items-center bg-darkGreen text-white font-medium text-sm py-0 border rounded-md border-[#318616]"
                                    >
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-[9px]"><FaMinus className="h-2.5 w-2.5 flex-shrink-0" /></button>
                                        <span>{item?.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-[9px]"><FaPlus className="h-2.5 w-2.5 flex-shrink-0" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}

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
                                        {originalTotal &&
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
                    <button onClick={() => setLoginBox(true)} className='bg-darkGreen text-white flex justify-between items-center min-w-full px-4 py-2 rounded-xl'>
                        <div className='flex flex-col justify-center -space-y-0.5'>
                            <span className='font-semibold'>₹{discountedTotalPrice + 2}</span>
                            <span className='font-poppins font-light text-sm tracking-wide text-gray-200'>TOTAL</span>
                        </div>
                        <div>
                            <span className='font-poppins flex items-center'>Login to proceed<FaChevronRight className='ml-1 h-3 w-3' /></span>
                        </div>
                    </button>
                </div>

            </div>

        </>
    )
}

export default Cart
