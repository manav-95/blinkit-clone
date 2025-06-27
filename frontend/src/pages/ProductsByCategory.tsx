import { useNavigate, useParams } from 'react-router-dom'
import { products } from '../data/productData';
import ProductCard from '../components/ProductCard';

import { type CartItemType } from '../types/CartItemType';

import { useCart } from '../contexts/CartContext';

const ProductsByCategory = () => {

    const navigate = useNavigate();
    const { categoryName, subCategoryName } = useParams();

    const { cart } = useCart();

    return (
        <>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex flex-col items-start justify-start p-1 bg-lightGray rounded-b-xl'>
                    <div className='flex justify-start items-center h-10 bg-white shadow border-b border-gray-300 rounded-sm w-full px-2'>
                        <span className='capitalize font-poppins font-semibold text-sm'>Buy {subCategoryName} online</span>
                    </div>
                    <div className='flex h-[80vh] w-full'>
                        <div className='w-1/12 overflow-auto scroll-smooth h-full p-2 flex flex-col bg-white space-y-4'>
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
                                        key={product.id} className={`flex flex-col items-center justify-center bg-gray-100 p-1 rounded-md`}>
                                        <img
                                            src={product.productImage}
                                            alt={product.productName}
                                            className='rounded-t-md'
                                        />
                                        <p className='text-xs font-poppins my-1'>{product.subCategory}</p>
                                    </button>
                                    <div className={`${product.category === categoryName && product.subCategory === subCategoryName ? 'bg-darkGreen' : 'bg-transparent'} min-w-1 h-16`}></div>
                                </div>
                            )}

                        </div>
                        <div className='w-full overflow-auto scroll-smooth h-full'>
                            <div className='grid grid-cols-5 gap-y-2 gap-x-2 p-2'>
                                {products
                                    .filter((product) => product.category === categoryName && product.subCategory === subCategoryName)
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
            </div >
        </>
    )
}

export default ProductsByCategory;
