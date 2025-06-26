import React from 'react'
import { LocationProvider } from './LocationContext'
import { CartProvider } from './CartContext'
import { AuthProvider } from './AuthContext'

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <AuthProvider>
                <LocationProvider>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </LocationProvider>
            </AuthProvider>
        </>
    )
}

export default AppContextProvider