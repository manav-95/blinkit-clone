import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Search from "./pages/Search"
import Navbar from "./components/Navbar"
import './App.css'

import { useLocation as useLocationHook } from "./contexts/LocationContext"
import LocationWindow from "./components/LocationWindow"

import { useCart } from "./contexts/CartContext"
import Cart from "./components/Cart"

import { useAuth } from "./contexts/AuthContext"
import LoginWindow from "./components/LoginWindow"
import ProductDetails from "./pages/ProductDetails"
import CategoryProducts from "./pages/CategoryProducts"
import ProductsByCategory from "./pages/ProductsByCategory"
// import ProductCard from "./components/ProductCard"

function App() {

  const { openLocationBox } = useLocationHook();
  const { cartOpen } = useCart();
  const { loginBox } = useAuth();

  
  return (
    <>
      <div className="relative h-screen w-full">
        <div className="min-h-[5.3rem] mb-0">
          <Navbar />
        </div>

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
          <Route path="/pn/:productName/pid/:productId" element={<ProductDetails />} />
          {/* <Route path="/card" element={<ProductCard />} /> */}
          <Route path="/cn/:categoryName" element={<CategoryProducts />} />
          <Route path="/cn/:categoryName/:subCategoryName" element={<ProductsByCategory />} />
        </Routes>

      </div>
    </>
  )
}

export default App
