import React, { useEffect, useRef, useState } from 'react'
import axios, { AxiosError } from 'axios'
import Modal from '../../components/Modal'
import { LuEye, LuPlus, LuTrash2, LuUpload, LuX } from 'react-icons/lu'
import { LucideEdit } from 'lucide-react';
import ProductDetailsModal from '../../components/admin/ProductDetailsModal';

import { superstoreCategories } from '../../data/superStoreCategories'

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
  const [dataLoading, setDataLoading] = useState<boolean>(true)

  const [images, setImages] = useState<GalleryPreview[] | []>([]);
  const [products, setProducts] = useState<ProductType[] | []>([]);

  const [removedGalleryImages, setRemovedGalleryImages] = useState<string[]>([]);


  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const multipleFileInputRef = useRef<HTMLInputElement | null>(null);

  const [editingItem, setEditingItem] = useState<ProductType | null>(null)

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [query, setQuery] = useState<string>('')


  const categoryObj = superstoreCategories.find((item) => item.name === selectedCategory)


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

  useEffect(() => {
    setDataLoading(true)
    const searchProducts = setTimeout(async () => {
      const term = query.trim().toLowerCase();
      try {
        if (term.length > 2) {
          const res = await axios.get(`${baseUrl}/products/search/${term}`)
          if (res) {
            setProducts(res.data.products)
          } else {
            setProducts([])
          }
        } else {
          const res = await axios.get(`${baseUrl}/products`)
          if (res) {
            setProducts(res.data)
          } else {
            setProducts([])
          }
        }
      } catch (error) {
        console.log("Error Searching Products: ", error)
      } finally {
        setDataLoading(false)
      }
    }, 300)

    return () => clearTimeout(searchProducts);
  }, [query])

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
      setSelectedCategory(editingItem.category)

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

      setSelectedCategory(null)
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

    return () => {
      setSelectedCategory(null)
    }

  }, [editingItem, showModal]);

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

        setShowModal(false)
        getAllProducts();

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
        getAllProducts();
      }
    } catch (error) {
      console.log("Error Deleting Product: ", error)
      alert("Error Deleting Product")
    } finally {
      setIsLoading(false)
    }
  }

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

  // useEffect(() => {
  //   getAllProducts();
  // }, [])


  return (
    <>
      <div className='px-6 mt-5'>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management ({products.length})</h1>
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

        <div className='flex justify-between items-center mt-5'>
          <input
            type="text"
            onChange={(e) => { setQuery(e.target.value) }}
            className={`${query.length > 0 ? 'border border-darkGreen' : 'border'} w-full outline-none py-3.5 px-4 rounded-xl font-poppins text-sm`}
            placeholder='Search Product by Id, name, category'
          />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name='category'
                  value={formData.category}
                  onChange={(e) => {
                    handleChange(e);
                    setSelectedCategory(e.target.value)
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option hidden>Select Category</option>
                  {superstoreCategories.map((category, index) => (
                    <option key={index} value={category.name} className='capitalize'>{category.name}</option>
                  ))}
                </select>
                {error.category && <span className='font-poppins text-sm text-red-500 mt-0.5'>{error.category}</span>}

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                <div className='max-h-20'>
                  <select
                    name='subCategory'
                    disabled={!selectedCategory}
                    value={formData.subCategory}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option hidden>Select SubCategory</option>
                    {categoryObj?.subCategories.map((subCategory, index) => (
                      <option key={index} value={subCategory} className='capitalize'>{subCategory}</option>
                    ))}

                  </select>
                  {error.subCategory && <span className='font-poppins text-sm text-red-500 mt-0.5'>{error.subCategory}</span>}

                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Brand</label>
                <select
                  name='brand'
                  disabled={!selectedCategory}
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"

                >
                  <option hidden>Select a brand</option>
                  {categoryObj?.brands.map((brand, index) => (
                    <option key={index} value={brand} className='capitalize'>{brand}</option>
                  ))}

                </select>
                {error.brand && <span className='font-poppins text-sm text-red-500 mt-0.5'>{error.brand}</span>}

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

      {dataLoading ? (
        <div className="grid grid-cols-1 gap-4 px-6 py-4">
          {[...Array(6)].map((_, i) => (
            <>
              <div key={i} className={`bg-[linear-gradient(110deg,#f8f8f8,45%,#f1f1f1,55%,#f8f8f8)] bg-[length:200%_100%] animate-shine rounded-md ${i === 0 ? 'h-12' : 'h-20'} w-full shadow`}></div>
            </>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="overflow-auto px-6 py-4">
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
                  Brand
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
              {products.reverse().map((product) => (
                <tr key={product?.prodId} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.prodId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center max-w-64">
                      <img
                        src={product?.mainImageUrl?.url || "/placeholder.svg"}
                        alt={product.name}
                        className={`w-14 h-14 rounded object-cover mr-3 border`}
                      />
                      <div>
                        <div className="text-xs font-medium text-gray-900 capitalize text-wrap line-clamp-2">{product.name}</div>
                        {/* <div className="text-xs font-medium text-purple-600 capitalize">{product?.brand}</div> */}
                        <div className="text-xs text-gray-500">{product.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 capitalize">{product.brand}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 capitalize">{product.category}</div>
                      <div className="text-xs text-darkGreen capitalize">{product.subCategory}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">₹{product.price}</div>
                      {product.mrp > product.price &&
                        <div className="text-xs text-gray-500 line-through">MRP: ₹{product.mrp}</div>
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-darkGreen">{Number(product?.discount) === 0 ? `N/A` : `${product?.discount + '% OFF'}`}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div
                        className={`text-sm font-medium capitalize ${Number(product.stockQuantity) < Number(product.minStock) ? "text-red-600" : "text-gray-900"
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
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <img
            src="/not-found.webp"
            alt="No Products Found"
            className="w-64 h-64 mb-6"
          />
          <h2 className="text-2xl font-semibold mb-2">🔍 No Products Found</h2>
          <p className="text-gray-600 mb-4">
            We couldn’t find any matching products. Please try a different search term.
          </p>
          <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
            <li>Check for spelling mistakes</li>
            <li>Try using broader keywords</li>
            <li>Search by product name or ID</li>
          </ul>
        </div>
      )}

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
