import React, { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";

interface CartItem {
    id: number;
    productName: string;
    productPrice: number;
    productMrp?: number;
    productImage: string;
    quantity: number;
    unit: string;
}

interface CartContextType {
    cart: CartItem[];
    setCart: Dispatch<SetStateAction<CartItem[]>>;
    cartOpen: boolean;
    setCartOpen: Dispatch<SetStateAction<boolean>>;
    addToCart: (item: CartItem) => void;
    updateQuantity: (id: number, newQuantity: number) => void;
    totalCartItems: number;
    discountedTotalPrice: number;
    orignalTotal: number | null;
    savedAmount: number;
    DeliveryCharge: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    const [cartOpen, setCartOpen] = useState<boolean>(false)

    const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const discountedTotalPrice = cart.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

    const hasMrp = cart.some(item => item.productMrp && item.productMrp > item.productPrice)

    const orignalTotal = hasMrp
        ? cart.reduce((sum, item) => {
            const basePrice = item.productMrp ?? item.productPrice;
            return sum + basePrice * item.quantity;
        }, 0)
        : null;

    const savedAmount = orignalTotal - discountedTotalPrice;
    const DeliveryCharge = 25;


    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart])

    const addToCart = (item: CartItem) => {
        setCart((prev) => [...prev, { ...item, quantity: 1 }]);
    };


    const updateQuantity = (id: number, newQuantity: number) => {
        setCart((prev) => {
            if (newQuantity <= 0) {
                // Optionally remove the item if quantity is zero or less
                return prev.filter((item) => item.id !== id);
            }

            return prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: newQuantity } // correct return
                    : item
            );
        });
    };


    console.log("Cart: ", cart);

    return (
        <CartContext.Provider value={{
            cart,
            setCart,
            cartOpen,
            setCartOpen,
            addToCart,
            updateQuantity,
            totalCartItems,
            discountedTotalPrice,
            orignalTotal,
            savedAmount,
            DeliveryCharge,
        }}>
            {children}
        </CartContext.Provider>
    )
}

// custom hook
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
