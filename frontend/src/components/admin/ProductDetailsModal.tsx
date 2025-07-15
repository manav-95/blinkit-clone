import axios from "axios";
import { useEffect, useState } from "react";

interface ProductType {
    prodId?: string;
    name: string;
    brand: string;
    category: string;
    subCategory: string;
    price: string;
    mrp: string;
    discount?: string;
    unit: string;
    type: string;
    stockQuantity: string;
    minStock: string;
    description: string;
    mainImageUrl?: {
        url: string;
        public_id: string;
    };
    galleryUrls?: {
        url: string;
        public_id: string;
    }[];
}

interface ProductDetailsModalProps {
    productId: string;
}

const ProductDetailsModal = ({ productId }: ProductDetailsModalProps) => {
    const [productDetail, setProductDetail] = useState<ProductType | null>(null);

    const [activeImage, setActiveImage] = useState<string | null>(null)


    const gallery = [
        productDetail?.mainImageUrl?.url,
        ...(productDetail?.galleryUrls?.map((img) => img.url) || [])
    ]

    useEffect(() => {
        const getProductDetails = async () => {
            try {
                const res = await axios.get(`${baseUrl}/products/${productId}`);
                if (res.data.product) {
                    setProductDetail(res.data.product);
                }

            } catch (error) {
                console.error("Error Fetching Product Details: ", error);
            }
        };

        if (productId) {
            getProductDetails();
        }
    }, [productId]);

    useEffect(() => {
        if (productDetail?.mainImageUrl) {
            setActiveImage(productDetail?.mainImageUrl?.url)
        }
    }, [productDetail])

    if (!productDetail) {
        return <div className="p-4 text-center text-gray-500">Loading product details...</div>;
    }

    return (
        <div className="bg-white w-full text-gray-800 font-poppins space-y-6">
            {/* Top: Image + Gallery */}
            <div className="flex gap-6">
                {/* Main Image */}
                <div className="w-1/2">
                    <div className="h-[350px] w-full border rounded-lg overflow-hidden">
                        {activeImage && (
                            <img
                                src={activeImage}
                                alt={productDetail.name}
                                className="w-full h-full object-cover bg-gray-100"
                            />
                        )}
                    </div>
                </div>

                {/* Gallery */}
                <div className="w-1/2 max-h-[350px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {gallery.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveImage(image || '')}
                            >
                                <img
                                    src={image}
                                    alt={`Gallery ${index + 1}`}
                                    className={`${activeImage === image ? 'border-2 border-darkGreen' : 'border-2 border-transparent'} w-full h-24 p-0.5 object-fit rounded bg-gray-50`}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <hr />

            {/* Bottom: Product Info */}
            <div className="space-y-2">
                <div>
                    <span className="text-sm text-purple-600 font-medium capitalize">{productDetail.brand}</span>
                    <h2 className="text-2xl font-semibold">{productDetail.name}</h2>
                </div>

                <div className="flex items-center gap-2 text-lg">
                    <span className="flex items-center font-bold text-green-700"><span className="font-mono">₹</span>{productDetail.price}</span>
                    {productDetail.mrp !== productDetail.price && (
                        <>
                            <span className="flex items-center line-through text-gray-500 text-sm"><span className="font-mono">₹</span>{productDetail.mrp}</span>
                            <span className="text-sm text-darkGreen">
                                ({productDetail.discount || Math.round(((+productDetail.mrp - +productDetail.price) / +productDetail.mrp) * 100)}% OFF)
                            </span>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-semibold">Category:</span> {productDetail.category}</div>
                    <div><span className="font-semibold">Sub Category:</span> {productDetail.subCategory}</div>
                    <div><span className="font-semibold">Type:</span> {productDetail.type}</div>
                    <div><span className="font-semibold">Unit:</span> {productDetail.unit}</div>
                    <div><span className="font-semibold">Stock Qty:</span> {productDetail.stockQuantity}</div>
                    <div><span className="font-semibold">Min Stock:</span> {productDetail.minStock}</div>
                </div>
            </div>

            <hr />

            <div>
                <h3 className="text-base font-medium mb-1">Description</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                    {productDetail.description}
                </p>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
