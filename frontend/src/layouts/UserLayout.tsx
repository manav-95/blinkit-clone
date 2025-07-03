import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

import { useLocation as useLocationHook } from "../contexts/LocationContext"
import LocationWindow from "../components/LocationWindow"

import { useCart } from "../contexts/CartContext"
import Cart from "../components/Cart"

import { useAuth } from "../contexts/AuthContext"
import LoginWindow from "../components/LoginWindow"

const UserLayout = () => {

    const { openLocationBox } = useLocationHook();
    const { cartOpen } = useCart();
    const { loginBox } = useAuth();

    return (
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
            <Outlet />
        </div>
    )
}

export default UserLayout
