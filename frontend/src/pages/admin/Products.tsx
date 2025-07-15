import React, { useEffect, useRef, useState } from 'react'
import axios, { AxiosError } from 'axios'
import Modal from '../../components/Modal'
import { LuEye, LuPlus, LuTrash2, LuUpload, LuX } from 'react-icons/lu'
import { LucideEdit } from 'lucide-react';
import ProductDetailsModal from '../../components/admin/ProductDetailsModal';

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

type MainImagePreview = {
  file?: File;
  preview: string;
  public_id?: string;
};

type GalleryPreview = {
  file: File;
  preview: string;
  public_id?: string;
};


const Products = () => {

  const [modalType, setModalType] = useState<string>("")
  const [mainImage, setMainImage] = useState<MainImagePreview | null>(null)

  const [showModal, setShowModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [images, setImages] = useState<GalleryPreview[] | []>([]);
  const [products, setProducts] = useState<ProductType[] | []>([]);

  const [removedGalleryImages, setRemovedGalleryImages] = useState<string[]>([]);


  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const multipleFileInputRef = useRef<HTMLInputElement | null>(null);

  const [editingItem, setEditingItem] = useState<ProductType | null>(null)

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);


  const [formData, setFormData] = useState<ProductType>({
    name: '',
    brand: '',
    category: '',
    subCategory: '',
    price: '',
    mrp: '',
    unit: '',
    type: '',
    stockQuantity: '',
    minStock: '',
    description: '',
  })

  const [error, setError] = useState<ProductType>({
    name: '',
    brand: '',
    category: '',
    subCategory: '',
    price: '',
    mrp: '',
    unit: '',
    type: '',
    stockQuantity: '',
    minStock: '',
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

    const existingFileKeys = new Set(
      images
        .filter((img): img is GalleryPreview & { file: File } => !!img.file) // ✅ TS-safe filter
        .map((img) => `${img.file.name}-${img.file.size}`)
    );

    const newImages = files
      .filter((file) => !existingFileKeys.has(`${file.name}-${file.size}`)) // prevent duplicates
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    setImages((prev) => [...prev, ...newImages]);
  };



  const handleRemove = (index: number) => {
    setImages((prevImages) => {
      const removedImage = prevImages[index] as GalleryPreview & { public_id?: string };

      // Revoke object URL only if it's a new image (not from DB)
      if (removedImage.preview && !removedImage.public_id) {
        URL.revokeObjectURL(removedImage.preview);
      }

      // Only add to removedGalleryImages if public_id is a string
      if (typeof removedImage.public_id === "string") {
        setRemovedGalleryImages((prev) => [...prev, removedImage.public_id as string]);
      }

      // Return the remaining images
      return prevImages.filter((_, i) => i !== index);
    });
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };


  const validateForm = () => {
    let isValid = true;

    const newError = {
      name: '',
      brand: '',
      category: '',
      subCategory: '',
      price: '',
      mrp: '',
      unit: '',
      type: '',
      stockQuantity: '',
      minStock: '',
      description: '',
    }

    if (!formData.name || formData.name.length === 0) {
      newError.name = 'Product Name is required';
      isValid = false;
    }

    if (!formData.brand || formData.brand.length === 0) {
      newError.brand = 'Product Brand is required';
      isValid = false;
    }

    if (!formData.category || formData.category.length === 0) {
      newError.category = 'Product Category is required';
      isValid = false;
    }

    if (!formData.subCategory || formData.subCategory.length === 0) {
      newError.subCategory = 'Product Sub Category is required';
      isValid = false;
    }

    if (!formData.price || formData.price.length === 0) {
      newError.price = 'Product Price is required';
      isValid = false;
    }

    if (!formData.mrp || formData.mrp.length === 0) {
      newError.mrp = 'Product MRP is required';
      isValid = false;
    }

    if (Number(formData.price) > Number(formData.mrp)) {
      newError.price = 'Price should be less than MRP'
      isValid = false;
    }

    if (!formData.unit || formData.unit.length === 0) {
      newError.unit = 'Product Unit is required';
      isValid = false;
    }

    if (!formData.type || formData.type.length === 0) {
      newError.type = 'Product Type is required';
      isValid = false;
    }

    if (!formData.stockQuantity || formData.stockQuantity.length === 0) {
      newError.stockQuantity = 'Product Stock Quantity is required';
      isValid = false;
    }

    if (!formData.minStock || formData.minStock.length === 0) {
      newError.minStock = 'Product Minimum Stock is required';
      isValid = false;
    }

    if (!formData.description || formData.description.length === 0) {
      newError.description = 'Product Description is required';
      isValid = false;
    }

    if (!mainImage?.file) {
      alert("Main image file is missing.");
      isValid = false;
    }

    setError(newError);
    return isValid;
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)

    try {
      if (validateForm()) {

        const formDataToSend = new FormData();

        formDataToSend.append("name", formData.name);
        formDataToSend.append("brand", formData.brand);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("subCategory", formData.subCategory);
        formDataToSend.append("unit", formData.unit);
        formDataToSend.append("type", formData.type);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("mrp", formData.mrp);
        formDataToSend.append("stockQuantity", formData.stockQuantity);
        formDataToSend.append("minStock", formData.minStock);
        formDataToSend.append("description", formData.description);

        if (mainImage?.file) {
          formDataToSend.append("mainImage", mainImage.file)
        }

        if (images.length > 0) {
          images.forEach((item) => {
            formDataToSend.append("galleryImages", item.file);
          });
        }

        const res = await axios.post(`${baseUrl}/products/add`, formDataToSend);

        if (res.status === 201) {
          alert("Product Added Successfully")
        }

        console.log("Product Saved: ", res.data)

        // Reset state
        setFormData({
          name: '',
          brand: '',
          category: '',
          subCategory: '',
          price: '',
          mrp: '',
          unit: '',
          type: '',
          stockQuantity: '',
          minStock: '',
          description: '',
        })

        setMainImage(null)
        setImages([])
      } else {
        console.log("Form Validation Failed")
      }

    } catch (error) {
      const axiosError = error as AxiosError;
      const message = (axiosError.response?.data as { message: string })?.message || "Something went wrong";
      const status = axiosError.response?.status || 500;
      alert(`Error ${status}: ${message}`);
      console.error("Error:", message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (editingItem) {
      setFormData({
        prodId: editingItem.prodId,
        name: editingItem.name,
        brand: editingItem.brand,
        category: editingItem.category,
        subCategory: editingItem.subCategory,
        price: editingItem.price,
        mrp: editingItem.mrp,
        unit: editingItem.unit,
        type: editingItem.type,
        stockQuantity: editingItem.stockQuantity,
        minStock: editingItem.minStock,
        description: editingItem.description,
      });

      setMainImage(
        editingItem.mainImageUrl?.url
          ? {
            preview: editingItem.mainImageUrl.url,
            file: editingItem.mainImageUrl.url,
            public_id: editingItem.mainImageUrl.public_id,
          }
          : null
      );

      setImages(
        (editingItem.galleryUrls || []).map((img) => ({
          preview: img.url,
          file: undefined,
          public_id: img.public_id,
        }))
      );
    } else {
      // If no editing item, reset everything
      setFormData({
        name: '',
        brand: '',
        category: '',
        subCategory: '',
        price: '',
        mrp: '',
        unit: '',
        type: '',
        stockQuantity: '',
        minStock: '',
        description: '',
      });

      setMainImage(null);
      setImages([]);
    }
  }, [editingItem]);


  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!editingItem?.prodId) {
        alert("Product ID is missing. Cannot update.");
        return;
      }

      if (!validateForm()) {
        console.log("Form validation failed.");
        alert("Form validation failed.");
        return;
      }


      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("subCategory", formData.subCategory);
      formDataToSend.append("unit", formData.unit);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("mrp", formData.mrp);
      formDataToSend.append("stockQuantity", formData.stockQuantity);
      formDataToSend.append("minStock", formData.minStock);
      formDataToSend.append("description", formData.description);

      // Add prodId explicitly
      formDataToSend.append("prodId", editingItem.prodId);

      // Main image - only if updated
      if (mainImage?.file && typeof mainImage.file !== "string") {
        formDataToSend.append("mainImage", mainImage.file);
        formDataToSend.append("oldMainImageId", editingItem.mainImageUrl?.public_id || "");
      }

      // Only new gallery images
      images.forEach((img) => {
        if (!("public_id" in img)) {
          formDataToSend.append("galleryImages", img.file);
        }
      });

      // Removed gallery image IDs
      removedGalleryImages.forEach((public_id) => {
        if (public_id) {
          formDataToSend.append("removedGalleryImages", public_id);
        }
      });


      // Send update request
      const res = await axios.put(`${baseUrl}/products/${editingItem.prodId}`, formDataToSend);

      if (res.status === 201) {
        alert("✅ Product updated successfully");

        // Reset form and modal state
        setFormData({
          name: '',
          brand: '',
          category: '',
          subCategory: '',
          price: '',
          mrp: '',
          unit: '',
          type: '',
          stockQuantity: '',
          minStock: '',
          description: '',
        });
        setMainImage(null);
        setImages([]);
        setRemovedGalleryImages([]);
        setShowModal(false);
        setEditingItem(null);

        // Refresh product list
        const refreshed = await axios.get(`${baseUrl}/products`);
        setProducts(refreshed.data);
      }
    } catch (error) {
      console.error("❌ Update failed", error);
      alert("Update failed. Please check console.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleProductDelete = async () => {
    setIsLoading(true)
    try {
      const res = await axios.delete(`${baseUrl}/products/${selectedProductId}`)
      if (res.status === 200) {
        alert("Product Deleted Successfully")
        setShowModal(false)
      }
    } catch (error) {
      console.log("Error Deleting Product: ", error)
      alert("Error Deleting Product")
    } finally {
      setIsLoading(false)
    }
  }




  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await axios.get(`${baseUrl}/products`)
        if (res) {
          setProducts(res.data)
        }
      } catch (error) {
        console.error("Error Fetching products: ", error)
      }
    };

    getAllProducts();
  }, [])


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
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <LuPlus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>
      </div>


      {showModal && modalType === "product" && (
        <Modal title={editingItem ? "Edit Product" : "Add New Product"} onClose={() => setShowModal(false)} size="lg">
          <form className="space-y-6">
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
                {error.name && <span className='font-poppins text-sm text-red-500 mt-0.5'>{error.name}</span>}
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
                {error.brand && <span className='font-poppins text-sm text-red-500 mt-0.5'>{error.brand}</span>}

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
                {error.category && <span className='font-poppins text-sm text-red-500 mt-0.5'>{error.category}</span>}

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
                  {error.subCategory && <span className='font-poppins text-sm text-red-500 mt-0.5'>{error.subCategory}</span>}

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
                {error.price && <span className='font-poppins text-sm text-red-500 mt-0.5'>{error.price}</span>}
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
                {error.mrp && <span className='font-poppins text-sm text-red-500 mt-0.5'>{error.mrp}</span>}

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
                {error.unit && <span className='font-poppins text-sm text-red-500 mt-0.5'>{error.unit}</span>}

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
                {error.type && <span className='font-poppins text-sm text-red-500 mt-0.5'>{error.type}</span>}

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
                {error.stockQuantity && <span className='font-poppins text-sm text-red-500 mt-0.5'>{error.stockQuantity}</span>}

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
                {error.minStock && <span className='font-poppins text-sm text-red-500 mt-0.5'>{error.minStock}</span>}

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
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3.5 bg-darkGreen text-white rounded hover:bg-green-700"
                >
                  <LuUpload />
                  <span>Add Main Image</span>
                </button>

                {mainImage?.preview && (
                  <div className='relative'>
                    <img
                      src={mainImage.preview}
                      alt={"Main product Image"}
                      className='h-fit w-full rounded-md aspect-square object-contain border-2 my-3'
                    />
                    <button
                      className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => setMainImage(null)}
                    >
                      <LuX />
                    </button>
                  </div>
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
                  onClick={() => multipleFileInputRef.current?.click()}
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
              {error.description && <span className='font-poppins text-sm text-red-500 mt-0.5'>{error.description}</span>}

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
                  {editingItem ? (
                    <button
                      onClick={handleUpdateSubmit}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Update Product
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Add Product
                    </button>
                  )}

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


      <div className="overflow-x-auto px-6 py-4">
        <table className="w-full font-poppins">
          <thead className="bg-gradient-to-r from-green-600 to-green-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                Id
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                Discount
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products
              // .filter(
              //   (product) =>
              //     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              //     product.category.toLowerCase().includes(searchTerm.toLowerCase()),
              // )
              .map((product) => (
                <tr key={product?.prodId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.prodId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product?.mainImageUrl?.url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs font-medium text-purple-600">{product?.brand}</div>
                        <div className="text-xs text-gray-500">{product.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{product.category}</div>
                      <div className="text-xs text-darkGreen">{product.subCategory}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">₹{product.price}</div>
                      <div className="text-xs text-gray-500 line-through">MRP: ₹{product.mrp}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-darkGreen">{product?.discount}% OFF</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div
                        className={`text-sm font-medium ${Number(product.stockQuantity) < 0.5 * Number(product.minStock) ? "text-red-600" : "text-gray-900"
                          }`}
                      >
                        {product.stockQuantity} units
                      </div>
                      <div className="text-xs text-gray-500">Min. Stock {product.minStock}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (product.prodId) {
                            setSelectedProductId(product.prodId);
                          }
                          setModalType("product-details")
                          setShowModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <LuEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingItem(product)
                          setModalType("product")
                          setShowModal(true)
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        <LucideEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (product.prodId) {
                            setSelectedProductId(product.prodId);
                          }
                          setModalType("delete-product")
                          setShowModal(true)
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <LuTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showModal && modalType === "product-details" && selectedProductId && (
        <Modal title={"Product Details"} onClose={() => setShowModal(false)} size="lg">
          <ProductDetailsModal productId={selectedProductId} />
        </Modal>
      )}

      {showModal && modalType === "delete-product" && selectedProductId && (
        <Modal title={"Delete Product"} onClose={() => setShowModal(false)} size="md">
          <div className='flex items-center justify-center'>
            <LuTrash2 className='h-20 w-20 text-red-600' />
          </div>
          <div className='flex justify-center items-center font-poppins my-5'>
            <span className='text-center'>Are you really want to delete this product, this process cannot be undone</span>
          </div>

          {isLoading ? (
            <>
              <div
                className="flex items-center justify-center bg-red-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
              >
                <div className='w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin'></div>
              </div>
            </>
          ) : (
            <>
              <div className='flex w-full space-x-2 font-poppins'>
                <button
                  onClick={handleProductDelete}
                  className='w-full bg-red-600 py-2 px-4 text-white rounded'
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className='w-full bg-gray-300 hover:bg-gray-400/65 text-gray-700 py-2 px-4 rounded'
                >
                  Cancel
                </button>
              </div>
            </>
          )}

        </Modal>
      )}

    </>
  )
}

export default Products
