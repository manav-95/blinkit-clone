import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

type PriceListProps = {
    subCategoryName?: string;
    categoryName?: string;
    brandName?: string;
}

type ProductType = {
    prodId: number;
    name: string;
    brand: string;
    price: number;
    category: string;
    subCategory: string;
}

const PriceList = ({ brandName, subCategoryName, categoryName }: PriceListProps) => {

    const [products, setProducts] = useState<ProductType[] | []>([])

    useEffect(() => {
        const getProductDetails = async () => {
            try {
                let url = "";
                if (brandName) {
                    url = `${baseUrl}/products/brand/${brandName}`;
                } else if (subCategoryName) {
                    url = `${baseUrl}/products/subCategory/${subCategoryName}`;
                }

                if (url) {
                    const res = await axios.get(url);
                    setProducts(res.data.product || []);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error Fetching Product Details:", error);
                setProducts([]); // fallback
            }
        }

        getProductDetails()

    }, [brandName, categoryName, subCategoryName])

    const uniqueBrands = Array.from(new Set(products.filter(p => p.subCategory === subCategoryName && p.brand.toLowerCase() !== brandName?.toLowerCase()).map(p => p.brand))).slice(0, 3)

    console.log("All brands:", products.map(p => p.brand));
    console.log("Unique brands:", uniqueBrands);


    return (
        <>
            <div className='flex items-start bg-white shadow-md font-poppins'>
                <div className='w-1/2 px-8 py-6'>
                    <h1 className='text-lg font-semibold'>Buy {!brandName && subCategoryName} at Online grocery store in india</h1>
                    <div className='my-2 space-y-2 text-xs'>
                        <p>Are you super fond of online shopping because you hate crowded supermarkets? Now you don't need to be worry as Blinkit is delivering {!brandName && subCategoryName} at your doorstep superfast with easy returns for your complete peace of mind.</p>
                        <p>Get {!brandName && subCategoryName} delivered to your home in minutes. you can check {!brandName && subCategoryName} price before buying.</p>
                        <p>We deliver {!brandName && subCategoryName} at Delhi, Gurgaon, Kolkata, Lucknow, Mumbai, Bengaluru, Ahmedabad, Noida, Ghaziabad, Faridabad, Hyderabad, Jaipur, Pune, Chennai, Chandigarh, Ludhiana, Vadodara, Meerut, Kanpur, Panchkula, Kharar, Amritsar, Bhopal, Indore, Zirakpur, Jalandhar, Dehradun, Agra, Mohali, Goa, Patiala, Sonipat, Bhiwadi, Kota, Rohtak, Bahadurgarh, Haridwar, Bathinda, Kochi, Jodhpur</p>
                        {!brandName && subCategoryName &&
                            <div className='flex space-x-1'>
                                <p>Buy from several popular brands like</p>
                                {uniqueBrands.map((br, i) => (
                                    <Link key={i} to={`/br/${br}`}>
                                        <span className='text-darkGreen'>{br}{i < uniqueBrands.length - 1 ? ',' : ''}</span>
                                    </Link>
                                ))}
                            </div>
                        }
                    </div>
                </div>
                <div className='w-1/2 px-8 py-6'>
                    <h1 className='text-lg font-semibold'>{!brandName && subCategoryName} Price List</h1>
                    <div className='flex justify-between items-center w-full'>
                        <span className='font-medium text-gray-600 text-sm'>{!brandName && subCategoryName}</span>
                        <span className='font-medium text-gray-600 text-sm'>Price</span>
                    </div>
                    <div className='flex justify-between w-full my-2 text-xs'>
                        <div className='space-y-0.5'>

                            {products.sort((a, b) => a.price - b.price).slice(0, 10).map((product, index) =>
                                <div key={index}>
                                    <Link to={`/pn/${product.name}/pid/${product.prodId}`} className=''>{index + 1}. <span className='text-darkGreen'>{product.name}</span></Link>
                                </div>
                            )}
                        </div>
                        <div className='flex flex-col items-end space-y-0.5'>
                            {products.sort((a, b) => a.price - b.price).slice(0, 10).map(product =>
                                <div>
                                    <p>RS {product.price}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PriceList
