import React from 'react'
import { LocationProvider } from './LocationContext'
import { CartProvider } from './CartContext'
import { AuthProvider } from './AuthContext'
import { ProductProvider } from './ProductContext'

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <AuthProvider>
                <LocationProvider>
                    <CartProvider>
                        <ProductProvider>
                            {children}
                        </ProductProvider>
                    </CartProvider>
                </LocationProvider>
            </AuthProvider>
        </>
    )
}

export default AppContextProvider