import { useParams } from 'react-router-dom'
// import { products } from '../data/productData';
import ProductCard from '../components/ProductCard';

// import { type CartItemType } from '../types/CartItemType';

import { useCart } from '../contexts/CartContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PriceList from '../components/PriceList';



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


const CategoryProducts = () => {

    const { categoryName } = useParams();

    const decodedCategoryName = decodeURIComponent(categoryName || '')

    const { cart } = useCart();

    const [products, setProducts] = useState<ProductType[] | []>([])

    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await axios.get(`${baseUrl}/products?category=${decodedCategoryName}`)
                if (res) {
                    setProducts(res.data)
                   // console.log(res.data)
                } else {
                    setProducts([])
                }
            } catch (error) {
                console.log("Error fetching products: ", error)
            }
        }

        getProducts()
    }, [categoryName])



    return (
        <>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex flex-col items-start justify-start p-1 bg-gray-100 rounded-b-xl'>
                    <div className='flex justify-start items-center h-10 bg-white shadow border-b border-gray-300 rounded-sm w-full px-2'>
                        <span className='capitalize font-poppins font-semibold text-sm'>Buy {categoryName} online</span>
                    </div>
                    <div className='overflow-y-auto overflow-x-hidden scroll-smooth w-full h-[80vh]'>
                        <div className='grid grid-cols-6 gap-y-2 gap-x-2 p-2'>
                            {products
                            .sort((a,b) => b.prodId - a.prodId)
                                .map((product) => {
                                    const cartItem: CartItemType = cart.find((item) => item.id === product.prodId) ?? {
                                        id: product.prodId,
                                        quantity: 0,
                                    }
                                    return (
                                        <ProductCard key={product.prodId}
                                            prodId={product.prodId}
                                            discount={product.discount}
                                            mainImageUrl={product.mainImageUrl}
                                            name={product.name}
                                            price={product.price}
                                            unit={product.unit}
                                            mrp={product.mrp}
                                            cartItem={cartItem}
                                        />
                                    )
                                }
                                )
                            }
                        </div>
                    </div>
                    <PriceList categoryName={categoryName}/>
                </div>
            </div>
        </>
    )
}

export default CategoryProducts
