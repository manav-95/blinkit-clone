import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaCaretDown, FaChevronDown } from "react-icons/fa";
import { FaCartShopping, FaIndianRupeeSign, FaX } from "react-icons/fa6";
import { LuChevronDown, LuChevronsDown, LuSearch } from "react-icons/lu";

import { useLocation as useLocationContext } from "../contexts/LocationContext";
import { formatDeliveryTime } from '../utils/FormatDeliveryTime'

import { useCart } from "../contexts/CartContext";

import { useAuth } from "../contexts/AuthContext";

import { useSearch } from "../contexts/SearchContext";

import { navLinks } from '../data/navLinks'

const Navbar = () => {

  const { setOpenLocationBox, estimatedTime } = useLocationContext();
  const { totalCartItems, discountedTotalPrice, setCartOpen } = useCart();
  const { setLoginBox, loggedIn } = useAuth();

  const [displaySearch, setDisplaySearch] = useState(false)

  const navigate = useNavigate();
  const location = useLocation();

  const { input, setInput, showIcon } = useSearch();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [slide, setSlide] = useState<boolean>(true);

  const [navMenuOpen, setNavMenuOpen] = useState(false)

  const texts = [`Search "butter"`, `Search "Milk"`, `Search "chips"`];

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setSlide(true);
      }, 350)
    }, 3000)

    return () => clearInterval(interval);
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    // console.log("InputtedText: ", input);
  }


  useEffect(() => {
    if (location.pathname === '/s' || location.pathname.startsWith('/s/')) {
      setDisplaySearch(true)
    } else {
      setDisplaySearch(false)
    }
  }, [location])


  return (
    <div className={`min-w-full flex ${displaySearch ? 'justify-start' : 'justify-between'} bg-white border-b min-h-[5.3rem] mb-0 fixed top-0 z-40`}>
      {/* Logo and Location */}
      <div className="flex">
        <button
          onClick={() => navigate('/')}
          className="flex items-center font-extrabold text-[2.7rem] tracking-tight font-gilroy lg:px-6 xl:px-8 border-r hover:bg-gray-50"
        >
          <h1 className="text-[#F95738]">shop</h1>
          <h1 className="text-[#2E8B57]">it</h1>
        </button>
        <button
          onClick={() => { setOpenLocationBox(true); console.log("location box is opened") }}
          className={`${displaySearch ? 'hidden' : 'flex'} flex-col justify-center items-center lg:px-6 xl:px-10 hover:bg-gray-50 lg:min-w-[20rem] xl:min-w-[22rem]`}
        >
          <span className="font-gilroy text-xl mb-0.5">{estimatedTime ? `Delivery in ${formatDeliveryTime(parseInt(estimatedTime))}` : `Delivery in 8 mins`}</span>
          <div
            className="flex items-center">
            <span className="line-clamp-1 text-xs font-poppins tracking-wide">
              {localStorage.getItem("selectedLocation") || "Select Location"}
            </span>
            <FaCaretDown className="flex-shrink-0 ml-1 h-5 w-5" />
          </div>
        </button>
      </div>
      {/* Search Box */}
      {displaySearch
        ? (
          <>
            <div className={`flex items-center w-full ${loggedIn ? 'pl-8' : 'px-8'}`}>

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
          </>
        ) : (
          <>
            <div className="flex items-center w-full">
              <button
                onClick={() => navigate('/s/')}
                className="flex justify-start items-center space-x-4 cursor-text px-2.5 border bg-[#f8f8f8] w-full min-h-11 rounded-xl">
                <LuSearch className="flex-shrink-0 h-5 w-5" />
                <div className="relative min-h-11 overflow-hidden">
                  <div
                    className={`text-[#999999] min-h-11 font-sans text-nowrap transition-all duration-300 ease-in-out ${slide ? 'translate-y-2 opacity-100' : '-translate-y-5 opacity-0'}`}>
                    {texts[currentIndex]}
                  </div>
                </div>
              </button>
            </div>
          </>
        )}
      {/* Cart and User */}
      <div className={`${displaySearch ? '' : 'min-w-[20rem]'} flex items-center`}>
        {loggedIn ? (
          <>
            <button
              onClick={() => setNavMenuOpen(!navMenuOpen)}
              className={`${loggedIn ? 'visible' : 'hidden'} flex items-center justify-center lg:px-4 xl:px-4 text-base min-w-[11rem] h-full text-black font-semibold font-poppins hover:bg-gray-50`}
            >
              <span>Account</span>
              <FaCaretDown className={` ${navMenuOpen ? 'rotate-180' : 'rotate-0'} transition-all h-5 w-5 ml-2`} />
            </button>

            {navMenuOpen &&
              <div onClick={() => setNavMenuOpen(false)} className="fixed top-[5.2rem] left-0 bg-black/40 h-screen w-full">
                <div onClick={(e) => e.stopPropagation()} className="absolute top-0 right-44 min-w-72 px-0 py-2 rounded-b-xl z-10 bg-white">
                  <ul>
                    <h1 className="mb-2 font-poppins text-lg font-medium text-gray-600 px-4">My Account</h1>
                    {navLinks.map((Link, index) =>
                      <li
                        key={index}
                        className="py-1.5 hover:bg-gray-100 text-gray-800 px-4 font-poppins text-sm capitalize"
                      >{Link.name}</li>
                    )}
                  </ul>
                </div>
              </div>
            }
          </>
        ) : (
          <button
            onClick={() => setLoginBox(true)}
            className={`${displaySearch ? 'hidden' : 'visible'} lg:px-10 xl:px-14 min-w-[180px] text-lg h-full text-darkGreen hover:bg-gray-50`}
          >
            Login
          </button>
        )}
        <div className={`min-w-[9rem]`}>
          {totalCartItems > 0 ?
            (<>
              <button
                onClick={() => { setCartOpen(true); console.log("Cart is opened") }}
                className={`bg-darkGreen max-w-40 flex space-x-1 items-center text-white rounded-lg py-3.5 px-4`}
              >
                <FaCartShopping className="flex-shrink-0 h-5 w-5 mr-1.5 mt-0.5" />
                <div className="flex flex-col justify-center items-start -space-y-1.5 max-h-6 poppins font-semibold">
                  <span>{totalCartItems} items</span>
                  <span className="flex justify-start items-center"><FaIndianRupeeSign className="h-3.5 w-3.5 flex-shrink-0" />{discountedTotalPrice}</span>
                </div>
              </button>
            </>
            ) : (
              <>
                <button disabled={true} className={`bg-[#cccccc]/50 cursor-not-allowed max-w-40 flex space-x-1 items-center text-white rounded-lg py-3.5 px-4`}>
                  <FaCartShopping className="flex-shrink-0 h-5 w-5 mr-1.5 mt-0.5" />
                  <div className="max-h-6">
                    <span className="font-gilroy">My Cart</span>
                  </div>
                </button>
              </>
            )}
        </div>
      </div>
    </div>
  )
}

export default Navbar