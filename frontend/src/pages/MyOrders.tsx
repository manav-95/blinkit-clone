import axios from "axios"
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react"
import Modal from "../components/Modal";

type JwtTokenType = {
  id: string;
}

type OrdersType = {
  orderId: string;
  address: string;
  amount: number;
  cart: [
    {
      id: number,
      quantity: number,
      name: string,
      image: string,
      price: number,
      mrp: number,
      unit: string,
    }
  ]
  createdAt: string;
  currency: string;
  razorpayPaymentId: string;
}


// interface CartItemType {
//   id: number;
//   quantity: number;
// }


// interface ProductType {
//   prodId: number;
//   name: string;
//   brand: string;
//   category: string;
//   subCategory: string;
//   price: number;
//   mrp: number;
//   discount: number;
//   unit: string;
//   type: string;
//   stockQuantity: number;
//   minStock: number;
//   description: string;
//   mainImageUrl: {
//     url: string;
//     public_id: string;
//   };
//   galleryUrls: {
//     url: string;
//     public_id: string;
//   }[];
//   cartItem: CartItemType;
// }


const MyOrders = () => {

  const [orders, setOrders] = useState<OrdersType[] | []>([])
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');

  const [itemsTotal, setItemsTotal] = useState(0);
  const [totalMrp, setTotalMrp] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [handlingFee, setHandlingFee] = useState(2);


  const [selectedOrderId, setSelectedOrderId] = useState<string>('')

  const token = localStorage.getItem("accessToken");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const day = date.toLocaleString("en-US", { weekday: "short" }); // Sun
    const dayNum = date.getDate(); // 16
    const year = date.getFullYear(); // 2025
    const time = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    }); // 9:12 PM

    return `${day}, ${dayNum}, ${year} ${time.toLowerCase()}`;
  };

  const formattedDates = orders.map(order => ({
    ...order,
    formattedDate: formatDate(order.createdAt) // assumes order has createdAt
  }));



  // Fetching ALl User Orders
  useEffect(() => {
    const getAllUserOrders = async () => {
      try {
        if (token) {
          const decodedToken = jwtDecode<JwtTokenType>(token)
          const userId = decodedToken.id;
          // console.log("USER ID: ", userId)
          const res = await axios.get(`${baseUrl}/orders/${userId}/userOrders`);
          if (res.data) {
            //console.log("User All Orders: ", res.data)
            // Sort by createdAt (latest first)
            const sortedOrders = res.data.userOrders.sort(
              (a: OrdersType, b: OrdersType) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setOrders(sortedOrders)
          }
        }
      } catch (error) {
        console.log("Error Fetching User Orders: ", error);
      }
    };

    getAllUserOrders();
  }, [])


  useEffect(() => {
    if (!selectedOrderId) return;

    const selectedOrder = orders.find(o => o.orderId === selectedOrderId);
    if (!selectedOrder) return;

    const totalPrice = selectedOrder.cart.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const totalMrpValue = selectedOrder.cart.reduce((sum, item) => {
      return sum + item.mrp * item.quantity;
    }, 0);

    setItemsTotal(totalPrice);
    setTotalMrp(totalMrpValue);
    setDeliveryCharge(totalPrice < 100 ? 25 : 0);
    setHandlingFee(2); // always 2
  }, [selectedOrderId, orders]);


  // useEffect(() => {
  //   if (orders.length > 0) {
  //     console.log(orders.length)
  //   }
  // }, [orders])



  return (
    <>
      {orders.length > 0
        ? (
          <>
            {showModal && modalType === 'orderSummary' &&
              <Modal onClose={() => setShowModal(false)} size="lg" title="Order Summary" >
                {orders.filter((order) => order.orderId === selectedOrderId).map((order) => (
                  <>
                    <div className="mb-2">
                      <span className="font-semibold text-lg">Ordered Products</span>
                    </div>
                    <div
                      className="font-poppins bg-gray-50 px-4 py-4"
                    >
                      <div className="text-sm grid grid-cols-1 gap-y-2">
                        {order.cart.map((item, index) =>
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <div className="flex justify-start items-center space-x-2">
                              <img src={item.image} alt={item.name} className="h-16 w-16" />
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <div className="flex items-center justify-start space-x-2 text-gray-500">
                                  <p>{item.unit}</p>
                                  <p>x</p>
                                  <p>{item.quantity}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-center items-center space-x-1">
                              {item.mrp > item.price &&
                                <span className="text-gray-400 line-through">₹{item.mrp * item.quantity}</span>
                              }
                              <span className="text-gray-900 font-medium">₹{item.price * item.quantity}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>

                      </div>
                      <hr className="my-3" />
                      <div className="px-0 text-sm">
                        <div className="flex justify-between">
                          <div className="flex justify-start items-center">
                            <span>Items Total</span>
                            {totalMrp > itemsTotal &&
                              <span className="mx-2 px-2 py-0.5 rounded-sm bg-blue-100 text-blue-500 text-xs">You Saved ₹{(totalMrp) - (itemsTotal)}</span>
                            }
                          </div>
                          <div className="flex items-center space-x-2">
                            {totalMrp > itemsTotal && (
                              <span className="text-gray-400 line-through">₹{totalMrp}</span>
                            )}
                            <div>
                              <span>₹{itemsTotal}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span>Delivery Charges</span>
                          <span>{deliveryCharge > 0 ? `₹${deliveryCharge}` : <><span className="line-through text-gray-400">₹25</span><span className="text-darkGreen ml-2">Free</span></>}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Handling Fee</span>
                          <span>₹{handlingFee}</span>
                        </div>

                        <div className="flex justify-between font-semibold mt-2">
                          <span>Total Amount</span>
                          <span>₹{order.amount}</span>
                        </div>
                      </div>

                    </div>
                  </>
                ))}
              </Modal>
            }



            <div className="grid grid-cols-1 w-full gap-y-2">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="relative font-poppins text-sm w-full bg-gray-50 px-4 py-2"
                >
                  <span className="absolute top-0 right-0 bg-darkGreen py-1 px-3 text-xs text-white rounded-sm">#{order.orderId}</span>
                  <div className="flex justify-start items-center space-x-2 mb-2 text-gray-700">
                    <span>₹{order.amount}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-start items-center space-x-4 py-2 w-full overflow-x-auto">
                    {order.cart.map((item, index) => (
                      <img key={index} src={item.image} alt={item.name} className="h-24 w-24" />
                    ))}
                  </div>
                  <div className="flex items-center w-full">
                    <button className="w-1/2 px-4 py-3 bg-white text-darkGreen hover:bg-darkGreen hover:text-white transition-all rounded-sm">Order Again</button>
                    <button
                      onClick={() => {
                        setShowModal(true)
                        setModalType('orderSummary')
                        setSelectedOrderId(order.orderId)
                      }}
                      className="w-1/2 px-4 py-3 bg-white text-darkGreen hover:bg-darkGreen hover:text-white transition-all rounded-sm">Order Summary</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className='h-full'>
              <div className='flex flex-col items-center justify-center h-full'>
                <img src="/not-found.webp" alt="address" className='h-80 w-auto' />
                <span className='bg-darkGreen text-white text-base px-10 py-2 font-poppins rounded'>
                  Oops! you haven't placed any order yet
                </span>
              </div>
            </div>
          </>
        )
      }
    </>
  )
}

export default MyOrders
