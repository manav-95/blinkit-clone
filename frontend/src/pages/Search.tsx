import React, { useEffect, useState } from "react";
import { FaCartShopping, FaX, FaIndianRupeeSign } from "react-icons/fa6";
import { LuSearch } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

const Search = () => {

  const navigate = useNavigate();

  const { totalCartItems, discountedTotalPrice } = useCart();


  const [input, setInput] = useState<string>('');
  const [showIcon, setShowIcon] = useState(false);
  const [query, setQuery] = useSearchParams();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    // console.log("InputtedText: ", input);
  }

  useEffect(() => {
    if (input.length >= 1) {
      setShowIcon(true)
      setQuery({ q: input })
    } else {
      setShowIcon(false)
      setQuery();
    }
  }, [input, setQuery])


  return (
    <>
      <div className="min-w-full flex justify-between border-b min-h-[5.3rem] mb-4">
        {/* Logo and Location */}
        <div className="flex">
          <button onClick={() => navigate('/')} className="flex items-center font-extrabold text-[2.7rem] tracking-tight font-gilroy px-8 border-r hover:bg-gray-50">
            <h1 className="text-[#F95738]">shop</h1>
            <h1 className="text-[#2E8B57]">it</h1>
          </button>
        </div>
        {/* Search Box */}
        <div className="flex items-center w-full px-8">
          <div
            style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.1)' }}
            className="relative flex justify-between items-center border border-gray-300 bg-white w-full min-h-11 rounded-lg">
            <LuSearch className="flex-shrink-0 h-5 w-5 mx-3.5" />
            <input
              type="text"
              value={input}
              autoFocus={true}
              onChange={handleChange}
              placeholder="Search for aata dal and more"
              className={`caret-black text-black text-[17px] rounded-lg outline-none min-h-11 w-full font-sans text-nowrap`}
            />
            {
              showIcon &&
              <button onClick={() => setInput('')} className="absolute right-4">
                <FaX className="h-3.5 w-3.5 flex-shrink-0" />
              </button>
            }
          </div>
        </div>
        {/* Cart and User */}
        <div className="flex items-center justify-center min-w-44">
          <button className={`${totalCartItems > 0 ? 'bg-darkGreen cursor-pointer' : 'bg-[#cccccc]/50 cursor-not-allowed'} max-w-40 flex space-x-1 items-center text-white rounded-lg py-3.5 px-4`}>
            <FaCartShopping className="flex-shrink-0 h-5 w-5 mr-1.5 mt-0.5" />
            {totalCartItems > 0 ?
              (<>
                <div className="flex flex-col justify-center items-start -space-y-1.5 max-h-6 poppins font-semibold">
                  <span>{totalCartItems} items</span>
                  <span className="flex justify-start items-center"><FaIndianRupeeSign className="h-3.5 w-3.5 flex-shrink-0" />{discountedTotalPrice}</span>
                </div>
              </>
              ) : (
                <>
                  <div className="max-h-6">
                    <span className="font-gilroy">My Cart</span>
                  </div>
                </>
              )}

          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8">
        {/* Recent Searches */}
        <div className="flex justify-between items-center">
          <h1 className="font-gilroy text-lg text-gray-800">Recent Searches</h1>
          <button className="text-[#318616] font-medium">clear</button>
        </div>
        <div className="flex space-x-4 text-nowrap">
          <button className="border shadow-sm px-4 py-1 rounded-lg text-sm font-[450] text-gray-600 my-4">
            wwe 2k24
          </button>
        </div>
      </div>
    </>
  )
}

export default Search