import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import axios from "axios";
import { type ProductType } from "../types/ProductTypeProps";

interface ProductContextType {
    products: ProductType[];
    setProducts: Dispatch<SetStateAction<ProductType[]>>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<ProductType[]>([]);

    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         try {
    //             const response = await axios.get("https://68616af78e7486408445ed0b.mockapi.io/product");
    //             if (response) {
    //                 console.log("Products Data: ", response.data)
    //                 setProducts(response.data); // ✅ sets array of products
    //             }
    //         } catch (error) {
    //             console.error("Failed to fetch products:", error);
    //         }
    //     };

    //     fetchProducts();
    // }, []);

    return (
        <ProductContext.Provider value={{ products, setProducts }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProduct = (): ProductContextType => {
    const context = useContext(ProductContext);
    if (!context) throw new Error("useProduct must be used within a ProductProvider");
    return context;
};
