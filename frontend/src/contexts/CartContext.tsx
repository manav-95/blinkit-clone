import axios from "axios";
import React, { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";


// import { type CartItemType } from "../types/CartItemType";

interface CartItemType {
    id: number;
    quantity: number;
}


interface ProductType {
    prodId: number;
    name: string;
    brand: string;
    category: string;
    subCategory: string;
    price: number;
    mrp: number;
    discount: number;
    unit: string;
    type: string;
    stockQuantity: number;
    minStock: number;
    description: string;
    mainImageUrl: {
        url: string;
        public_id: string;
    };
    galleryUrls: {
        url: string;
        public_id: string;
    }[];
    cartItem: CartItemType;
}

interface CartContextType {
    cart: CartItemType[];
    setCart: Dispatch<SetStateAction<CartItemType[]>>;
    cartOpen: boolean;
    setCartOpen: Dispatch<SetStateAction<boolean>>;
    addToCart: (item: CartItemType) => void;
    updateQuantity: (id: number, newQuantity: number) => void;
    totalCartItems: number;
    discountedTotalPrice: number;
    originalTotal: number;
    savedAmount: number;
    DeliveryCharge: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItemType[]>(() => {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    const [cartOpen, setCartOpen] = useState<boolean>(false)

    const [products, setProducts] = useState<ProductType[] | []>([])


    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart])

    useEffect(() => {
        const getProductDetails = async () => {
            try {
                const cartItems: CartItemType[] = JSON.parse(localStorage.getItem("cart") || "[]");
                // console.log("Cart Items:", cartItems);

                // Make individual API requests for each item.id
                const productPromises = cartItems.map(async (item: CartItemType) => {
                    const res = await axios.get(`${baseUrl}/products/${item.id}`);
                    return {
                        ...res.data.product,
                        cartItem: {
                            quantity: item.quantity,
                        },
                    };
                });

                const results = await Promise.all(productPromises);
                setProducts(results);
            } catch (error) {
                console.log("Error Fetching Product details:", error);
            }
        };

        getProductDetails();
    }, [cart]);



    const getProductById = (id: number) => products.find(p => p.prodId === id);

    // Calculate discounted total
    const discountedTotalPrice = cart.reduce((sum, item) => {
        const product = getProductById(item.id);
        if (!product) return sum;
        return sum + product.price * item.quantity;
    }, 0);

    // Calculate original total
    const originalTotal = cart.reduce((sum, item) => {
        const product = getProductById(item.id);
        if (!product) return sum;
        const price = product.mrp ?? product.price;
        return sum + price * item.quantity;
    }, 0);

    // Saved amount
    const savedAmount = originalTotal - discountedTotalPrice;


    const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const hasMrp = cart.some(item => item.productMrp && item.productMrp > item.productPrice)


    const DeliveryCharge = 25;


    const addToCart = (item: CartItemType) => {
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
            originalTotal,
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
