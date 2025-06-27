import { useParams } from 'react-router-dom'
import { products } from '../data/productData';
import ProductCard from '../components/ProductCard';

import { type CartItemType } from '../types/CartItemType';

import { useCart } from '../contexts/CartContext';

const CategoryProducts = () => {

    const { categoryName } = useParams();

    const { cart } = useCart();

    return (
        <>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex flex-col items-start justify-start p-1 bg-gray-100 rounded-b-xl'>
                    <div className='flex justify-start items-center h-10 bg-white shadow border-b border-gray-300 rounded-sm w-full px-2'>
                        <span className='capitalize font-poppins font-semibold text-sm'>Buy {categoryName} online</span>
                    </div>
                    <div className='overflow-auto scroll-smooth w-full h-[80vh]'>
                        <div className='grid grid-cols-6 gap-y-2 gap-x-2 p-2'>
                            {products
                                .filter((product) => product.category === categoryName)
                                .map((product) => {
                                    const cartItem: CartItemType = cart.find((item) => item.id === product.id) ?? {
                                        id: product.id,
                                        productName: product.productName ?? "",
                                        productPrice: product.discountPrice ?? 0,
                                        productMrp: product?.mrp,
                                        productImage: product.productImage ?? "",
                                        unit: product.unit ?? "",
                                        quantity: 0,
                                    }
                                    return (
                                        <ProductCard key={product.id}
                                            id={product.id}
                                            discountPrice={product.discountPrice}
                                            image={product.productImage}
                                            name={product.productName}
                                            quantity={product.quantity}
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
            </div>
        </>
    )
}

export default CategoryProducts
