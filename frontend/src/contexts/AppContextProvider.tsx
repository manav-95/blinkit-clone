import React from 'react'
import { LocationProvider } from './LocationContext'
import { CartProvider } from './CartContext'
import { AuthProvider } from './AuthContext'
import { ProductProvider } from './ProductContext'
import { SearchProvider } from './SearchContext'

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <AuthProvider>
                <LocationProvider>
                    <SearchProvider>
                        <CartProvider>
                            <ProductProvider>
                                {children}
                            </ProductProvider>
                        </CartProvider>
                    </SearchProvider>
                </LocationProvider>
            </AuthProvider>
        </>
    )
}

export default AppContextProvider