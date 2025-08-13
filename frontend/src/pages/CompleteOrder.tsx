import React, { useEffect, useState } from 'react'
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { BsHandbagFill } from 'react-icons/bs';
import { GiScooter } from 'react-icons/gi';
import { BiSolidFoodMenu } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';

type AddressType = {
  _id: string;
  name: string;
  phone: string;
  area: string;
  addressType: string;
  floor: string;
  landmark: string;
  flatName: string;
}


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

type JwtTokenType = {
  id: string;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


const CompleteOrder = () => {

  const { cartOpen, setCartOpen, cart, setCart, updateQuantity, DeliveryCharge, discountedTotalPrice, originalTotal, savedAmount } = useCart();
  const [products, setProducts] = useState<ProductType[] | []>([]);

  const navigate = useNavigate();

  const storedAddress = localStorage.getItem("selectedAddress");
  const address: AddressType | null = storedAddress
    ? JSON.parse(storedAddress)
    : null;

  const GrandTotal = discountedTotalPrice > 99
    ? <span>₹{discountedTotalPrice + 2}</span>
    : <span>₹{discountedTotalPrice + 2 + DeliveryCharge}</span>


  const cartItems: CartItemType[] = JSON.parse(localStorage.getItem("cart") || "[]")

  const orderId = "ORD" + Math.floor(100000 + Math.random() * 900000).toString();

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        // const cartItems: CartItemType[] = JSON.parse(localStorage.getItem("cart") || "[]");
        // console.log("Cart Items:", cartItems);

        // Make individual API requests for each item.id
        const productPromises = cartItems.map(async (item: CartItemType) => {
          const res = await axios.get(`${baseUrl}/products/${item.id}`);
          return {
            ...res.data.product,
            cartItem: {
              quantity: item.quantity,
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


  const handleCheckout = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("RazorPay SDK failed to load. Are you Online?")
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode<JwtTokenType>(token)

      const options = {
        key: RAZORPAY_KEY,
        amount: Number(GrandTotal.props?.children?.[1]) * 100,
        currency: "INR",
        name: "ShopIt",
        description: "Test Transaction",
        handler: async function (response: any) {
          alert("Payment successful! Payment ID: " + response.razorpay_payment_id);

          // Now send order + payment info to backend
          try {
            const orderData = {
              orderId: orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              currency: "INR",
              amount: Number(GrandTotal.props?.children?.[1]),
              cart: products.map((prod) => ({
                id: prod.prodId,
                quantity: cartItems.find((item) => item.id === prod.prodId)?.quantity,
                name: prod.name,
                image: prod.mainImageUrl.url,
                price: prod.price,
                mrp: prod.mrp,
                unit: prod.unit,
              })),
              address: address?._id,
              user: decodedToken?.id,
            };

            // console.log("OrderData: ", orderData)

            const postRes = await axios.post(`${baseUrl}/orders/create-order`, orderData);
            if (postRes.data) {
              alert("Order saved successfully!");
              localStorage.removeItem("cart");
              setCart([])
              navigate('/')
            }
          } catch (error) {
            console.log("Error Submitting Order: ", error)
            alert('Failed To Create Order')
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    }
  }



  return (
    <>
      {cart.length > 0 ? (
        <div className='max-w-5xl px-4 py-4 mx-auto font-poppins'>

          <div>
            <h1 className='text-lg font-medium mb-3'>Cart Items</h1>
            <div className='w-full bg-gray-50 mb-3 rounded-r-lg border-l-4 border-darkGreen px-4 py-3 text-sm'>
              {products
                .filter(product => cart.find(item => item.id === product.prodId))
                .map((item) => {
                  const currentQty = cart.find(c => c.id === item.prodId)?.quantity ?? 1;
                  return (
                    <div
                      key={item.prodId}
                      className='flex items-center justify-between space-x-2 mb-3'
                    >
                      <div className='flex items-center justify-start space-x-2'>
                        <img src={item.mainImageUrl.url} alt={item.name} className='h-16 w-16 rounded-lg bg-white' />
                        <div className='text-xs'>
                          <p className='text-sm'>{item.name}</p>
                          <p>{item.unit}</p>
                          <div className='flex space-x-1'>
                            <p>₹{item.price}</p>
                            <p className='line-through text-gray-500'>₹{item.mrp}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div
                          className="min-w-16 flex space-x-4 justify-between items-center font-medium text-sm py-0 "
                        >
                          <button onClick={() => updateQuantity(item?.prodId, currentQty - 1)} className="px-3 py-[10px] rounded-sm text-white bg-darkGreen"><FaMinus className="h-3 w-3 flex-shrink-0" /></button>
                          <span>{currentQty}</span>
                          <button onClick={() => updateQuantity(item?.prodId, currentQty + 1)} className="px-3 py-[10px] rounded-sm text-white bg-darkGreen"><FaPlus className="h-3 w-3 flex-shrink-0" /></button>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>

            <div className='flex flex-col'>
              <div>
                <h1 className='text-lg font-medium mb-3'>Bill Details</h1>
                <div className='flex flex-col space-y-1.5 mb-3 bg-gray-50 px-4 py-3 border-l-4 border-darkGreen rounded-r-lg'>
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

                  <hr />

                  {/* Grand Total */}
                  <div className='flex justify-between items-center'>
                    <span className='font-semibold'>Grand total</span>
                    <span className='text-base font-medium'>
                      {GrandTotal}
                    </span>
                  </div>
                </div>
              </div>
              {/* {savedAmount > 0 &&
              <div className='text-sm flex w-full justify-between items-center px-4 py-2 bg-blue-100 text-blue-500'>
                <span>You Saved</span>
                <span>₹{savedAmount}</span>
              </div>
            } */}
            </div>

          </div>

          <div>
            <h1 className='text-lg font-medium mb-3'>Address Details</h1>
            <div className='flex flex-col items-start w-full mb-3 text-sm border-l-4 border-darkGreen px-4 py-3 bg-gray-50 rounded-r-lg'>
              <div className='flex justify-between items-center w-full'>
                {address?.name &&
                  <span>{address?.name}</span>
                }
                {address?.addressType &&
                  <span className='px-4 py-0.5 rounded bg-green-200 border border-darkGreen'>{address?.addressType}</span>
                }
              </div>
              {address?.phone &&
                <span>{address?.phone}</span>
              }
              {address?.area &&
                <span>{address?.area}</span>
              }
              {address?.flatName &&
                <span>{address?.flatName}</span>
              }
              {address?.landmark &&
                <span>{address?.landmark}</span>
              }
              {address?.floor &&
                <span>{address?.floor}</span>
              }
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className='w-full text-center bg-darkGreen text-white font-poppins font-medium px-4 py-2 rounded'
          >
            Check Out
          </button>

        </div>
      ) : (
        <div className='max-w-5xl mx-auto px-4 font-poppins text-sm'>
          <div className='flex flex-col justify-center items-center my-10 space-y-2'>
            <span className='font-medium'>Your Cart is Empty</span>
            <button
              onClick={() => navigate('/')}
              className='bg-darkGreen text-white px-8 py-2 rounded'
            >
              Click to shop
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default CompleteOrder
