import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Search from "./pages/Search"
import './App.css'

import ProductDetails from "./pages/ProductDetails"
import CategoryProducts from "./pages/CategoryProducts"
import ProductsByCategory from "./pages/ProductsByCategory"
import UserLayout from "./layouts/UserLayout"
import AdminLayout from "./layouts/AdminLayout"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"

function App() {


  return (
    <>  
        <Routes>

          {/* User Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="s" element={<Search />} />
            <Route path="pn/:productName/pid/:productId" element={<ProductDetails />} />
            <Route path="cn/:categoryName" element={<CategoryProducts />} />
            <Route path="cn/:categoryName/:subCategoryName" element={<ProductsByCategory />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index path="login" element={<AdminLogin />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>

        </Routes>
    </>
  )
}

export default App
