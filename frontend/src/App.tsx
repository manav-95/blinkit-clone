import { Routes, Route, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import Search from "./pages/Search"
import Navbar from "./components/Navbar"
import { useEffect, useState } from "react"
import './App.css'

import { useLocation as useLocationHook } from "./contexts/LocationContext"
import LocationWindow from "./components/LocationWindow"

import { useCart } from "./contexts/CartContext"
import Cart from "./components/Cart"

import { useAuth } from "./contexts/AuthContext"
import LoginWindow from "./components/LoginWindow"
import ProductDetails from "./pages/ProductDetails"

function App() {

  const { openLocationBox } = useLocationHook();
  const { cartOpen, setCartOpen } = useCart();
  const { loginBox } = useAuth();

  const [displayNav, setDisplayNav] = useState(true);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/s' || location.pathname.startsWith('/s/')) {
      setDisplayNav(false)
    } else {
      setDisplayNav(true)
    }
  }, [location])


  return (
    <>
      <div className="relative h-screen w-full">
        {displayNav
          ?
          <div className="min-h-[5.3rem] mb-0">
            <Navbar />
          </div>
          : <></>
        }
        {openLocationBox && (
          <>
            <div className="fixed top-0 h-screen w-full bg-black/50 z-40">
              <LocationWindow />
            </div>
          </>
        )}
        {cartOpen && (
          <>
            <div className="fixed top-0 h-screen w-full bg-black/50 z-40">
              <Cart />
            </div>
          </>
        )}
        {loginBox && (
          <>
            <div className="fixed top-0 h-screen w-full bg-black/50 z-50">
              <LoginWindow />
            </div>
          </>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/s" element={<Search />} />
          <Route path="/product-details" element={<ProductDetails />} />
        </Routes>

      </div>
    </>
  )
}

export default App
