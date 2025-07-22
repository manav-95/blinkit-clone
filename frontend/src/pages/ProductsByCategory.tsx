import { useNavigate, useParams } from 'react-router-dom'
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

const ProductsByCategory = () => {

    const navigate = useNavigate();
    const { categoryName = '', subCategoryName = '' } = useParams();

    const { cart } = useCart();

    const [products, setProducts] = useState<ProductType[] | []>([])

    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await axios.get(`${baseUrl}/products?category=${categoryName}`)
                if (res) {
                    setProducts(res.data)
                } else {
                    setProducts([])
                }
            } catch (error) {
                console.log("Error fetching products: ", error)
            }
        }

        getProducts()
    }, [categoryName, subCategoryName])

    return (
        <>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex flex-col items-start justify-start p-1 bg-lightGray rounded-b-xl'>
                    <div className='flex justify-start items-center h-10 bg-white shadow border-b border-gray-300 rounded-sm w-full px-2'>
                        <span className='capitalize font-poppins font-semibold text-sm'>Buy {subCategoryName} online</span>
                    </div>
                    <div className='flex h-[80vh] w-full'>
                        <div className='w-[6rem] overflow-y-auto scroll-smooth h-full p-2 flex flex-col bg-white space-y-4'>
                            {[
                                ...new Map(
                                    products
                                        .filter((product) => product.category === categoryName)
                                        .map((product) => [product.subCategory, product])
                                ).values()
                            ].map((product) =>
                                <div className='flex items-center space-x-1'>
                                    <button
                                        onClick={() => navigate(`/cn/${product.category}/${product.subCategory}`)}
                                        key={product.prodId} className={`${subCategoryName === product.subCategory ? 'bg-darkGreen/80 text-white shadow' : 'bg-gray-100'} flex flex-col items-center justify-center px-1 pt-1 pb-0.5 rounded-lg transition-all`}>
                                        <img
                                            src={product.mainImageUrl.url || ''}
                                            alt={product.name}
                                            className='rounded-md'
                                        />
                                        <p className='text-[10px] font-medium font-poppins my-0.5'>{product.subCategory}</p>
                                    </button>
                                    {/* <div className={`${product.category === categoryName && product.subCategory === subCategoryName ? 'bg-darkGreen' : 'bg-transparent'} min-w-1 h-16`}></div> */}
                                </div>
                            )}

                        </div>
                        <div className='w-full overflow-y-auto overflow-x-hidden scroll-smooth h-full'>
                            <div className='grid grid-cols-5 gap-y-2 gap-x-2 p-2'>
                                {products.length > 0 && categoryName && subCategoryName &&
                                    products.filter((product) => product.category === categoryName && product.subCategory === subCategoryName)
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
                    </div>
                                <PriceList subCategoryName={subCategoryName}/>
                </div>
            </div>
        </>
    )
}

export default ProductsByCategory;
