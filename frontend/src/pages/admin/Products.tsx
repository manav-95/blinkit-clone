import React, { useEffect, useRef, useState } from 'react'
import { LuPlus, LuUpload, LuX } from 'react-icons/lu'
import Modal from '../../components/Modal'
import axios, { AxiosError } from 'axios'

interface ProductType {
  name: string;
  brand: string;
  category: string;
  subCategory: string;
  price: number;
  mrp: number;
  unit: string;
  type: string;
  stockQuantity: number;
  minStock: number;
  description: string;
}

type ImagePreview = {
  file: File;
  preview: string;
};


const Products = () => {

  const [modalType, setModalType] = useState<string>("")
  const [mainImage, setMainImage] = useState<ImagePreview | null>(null)

  const [showModal, setShowModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [images, setImages] = useState<ImagePreview[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const multipleFileInputRef = useRef<HTMLInputElement | null>(null);

  const [editingItem, setEditingItem] = useState(null)

  const [formData, setFormData] = useState<ProductType>({
    name: '',
    brand: '',
    category: '',
    subCategory: '',
    price: 0,
    mrp: 0,
    unit: '',
    type: '',
    stockQuantity: 0,
    minStock: 0,
    description: '',
  })


  const brands = [
    { name: 'amul', value: 'Amul', },
    { name: 'pepsi', value: 'Pepsi', },
    { name: 'cococola', value: 'Cococola', },
    { name: 'lays', value: 'Lays', },
    { name: 'balaji', value: 'Balaji', },
  ]

  const categories = [
    { name: 'dairy & breakfast', value: 'Dairy & Breakfast', },
    { name: 'vegetables & fruits', value: 'Vegetables & Fruits', },
    { name: 'cold drink & juices', value: 'Cold Drink & Juices', },
    { name: 'munchies', value: 'Munchies', },
  ]

  const subCategories = [
    { name: 'milk', value: 'Milk', },
    { name: 'soft drinks', value: 'Soft Drinks', },
    { name: 'mango drinks', value: 'Mango Drinks', },
    { name: 'fruit juices', value: 'fruit juices', },
    { name: 'chips & crips', value: 'chips & crips', },
    { name: 'nachos', value: 'nachos', },
    { name: 'fresh fruits', value: 'fresh fruits', },
    { name: 'fresh vegetables', value: 'fresh vegetables', },
  ]


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const existingFileKeys = new Set(images.map((img) => `${img.file.name}-${img.file.size}`));

    const newImages = files
      .filter((file) => !existingFileKeys.has(`${file.name}-${file.size}`)) // prevent duplicates
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    setImages((prev) => [...prev, ...newImages]);
  };

  useEffect(() => {
    console.log("Gallery Updated:", images);
  }, [images]);

  const handleRemove = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };


  const triggerMainImageSelect = () => {
    fileInputRef.current?.click();
  };

  const triggerGalleryImageSelect = () => {
    multipleFileInputRef.current?.click();
  };



  const uploadToCloudinary = async (file: File) => {

    // Get Signature from backend
    const sigRes = await axios.get('http://localhost:5000/api/cloudinary/signature');

    const { timestamp, signature, apiKey, cloudName, folder } = sigRes.data;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);

    const cloudRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    return cloudRes.data.secure_url;
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)

    try {

      if (!mainImage?.file) {
        console.error("Main image file is missing.");
        return;
      }

      const mainImageUrl = await uploadToCloudinary(mainImage.file);

      const galleryUploads = await Promise.all(
        images.map((img) => uploadToCloudinary(img?.file))
      )

      const productId = Math.floor(100000 + Math.random() * 900000);
      const discount = (((formData.mrp - formData.price) / formData.mrp) * 100).toFixed(0);
      const formDataToSend = {
        prodId: productId,
        prodName: formData.name,
        prodBrand: formData.brand,
        category: formData.category,
        subCategory: formData.subCategory,
        unit: formData.unit,
        type: formData.type,
        price: formData.price,
        mrp: formData.mrp,
        discount: discount,
        stockQuantity: formData.stockQuantity,
        minStock: formData.minStock,
        mainImageUrl: mainImageUrl,
        galleryUrls: galleryUploads,
        description: formData.description,
      }

      const res = await axios.post('http://localhost:5000/api/products/add', formDataToSend)

      console.log("Product Saved: ", res.data)

      setIsLoading(false)

      setFormData({
        name: '',
        brand: '',
        category: '',
        subCategory: '',
        price: 0,
        mrp: 0,
        unit: '',
        type: '',
        stockQuantity: 0,
        minStock: 0,
        description: '',
      })

      setMainImage(null)
      setImages([])


    } catch (error) {
      const axiosError = error as AxiosError;

      const status = axiosError.response?.status;
      const message = (axiosError.response?.data as { message: string })?.message || "Something went wrong";

      if (status === 400) {
        alert(message);
      }

      console.error("Axios error:", message);
      setIsLoading(false);
    }

  }

  return (
    <>
      <div className='px-6 py-4'>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-1">Manage your product catalog and inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setModalType("product")
                setEditingItem(null)
                setShowModal(true)
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <LuPlus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>
      </div>


      {showModal && modalType === "product" && (
        <Modal title={editingItem ? "Edit Product" : "Add New Product"} onClose={() => setShowModal(false)} size="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Brand</label>
                <select
                  name='brand'
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"

                >
                  <option hidden>Select a brand</option>
                  {brands.map((brand, index) => (
                    <option key={index} value={brand.value} className='capitalize'>{brand.name}</option>
                  ))}

                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name='category'
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option hidden>Select Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.value} className='capitalize'>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                <div className='max-h-20'>
                  <select
                    name='subCategory'
                    value={formData.subCategory}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option hidden>Select Category</option>
                    {subCategories.map((subCategory, index) => (
                      <option key={index} value={subCategory.value} className='capitalize'>{subCategory.name}</option>
                    ))}

                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  name='price'
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter price"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">MRP (₹)</label>
                <input
                  type="number"
                  name='mrp'
                  value={formData.mrp}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter MRP"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <input
                  type="text"
                  name='unit'
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Unit"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <input
                  type="text"
                  name='type'
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Type"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  name='stockQuantity'
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter stock quantity"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock</label>
                <input
                  type="number"
                  name='minStock'
                  value={formData.minStock}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter minimum stock"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  hidden
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setMainImage({
                        file,
                        preview: URL.createObjectURL(file),
                      });
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter minimum stock"
                  required
                />

                <button
                  type="button"
                  onClick={triggerMainImageSelect}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3.5 bg-darkGreen text-white rounded hover:bg-green-700"
                >
                  <LuUpload />
                  <span>Add Main Image</span>
                </button>

                {mainImage?.preview && (
                  <img
                    src={mainImage.preview}
                    alt={"Main product Image"}
                    className='h-fit w-full rounded-md aspect-square object-contain border-2 my-3'
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">More Product Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  ref={multipleFileInputRef}
                  className="hidden"
                />
                {/* Custom Upload Button */}
                <button
                  type="button"
                  onClick={triggerGalleryImageSelect}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <LuUpload />
                  <span>Add More Images</span>
                </button>

                {images.length > 0 &&
                  <div className="grid grid-cols-3 gap-4 items-center my-3">
                    {images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img.preview}
                          alt={img.preview}
                          className='h-[7.5rem] w-[7.5rem] rounded-md aspect-square object-contain border-2'
                        />
                        <button
                          className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
                          onClick={() => handleRemove(index)}
                        >
                          <LuX />
                        </button>
                      </div>
                    ))}
                  </div>
                }

              </div>

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={5}
                name='description'
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
              ></textarea>
            </div>

            {isLoading ? (
              <>
                <div
                  className="flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
                >
                  <div className='w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin'></div>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {editingItem ? "Update Product" : "Add Product"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

          </form>
        </Modal>
      )}
    </>
  )
}

export default Products
