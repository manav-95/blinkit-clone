import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
//import { products } from "../data/productData";
//import { type ProductType } from "../types/ProductTypeProps";
import ProductCard from "../components/ProductCard";
import { useCart } from "../contexts/CartContext";
//import { type CartItemType } from "../types/CartItemType";
import { useSearch } from "../contexts/SearchContext";
import axios from "axios";


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


const Search = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const { query, setQuery, input, setInput } = useSearch();

  const [filteredProducts, setFilteredProducts] = useState<ProductType[] | []>([]);
  const [suggestionClicked, setSuggestionClicked] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);

  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  const [dataLoading, setDataLoading] = useState<boolean>(false)
  const [showRelated, setShowRelated] = useState<boolean>(false)



  // ✅ Ref to detect manual typing
  const isManualTyping = useRef(true);

  const getRelatedProducts = (selectedProduct: ProductType, allProducts: ProductType[]) => {
    return allProducts.filter((product) => {
      const isSameProduct = product.prodId === selectedProduct.prodId;

      const isSameCategory = product.category === selectedProduct.category;
      const isSameSubCategory = product.subCategory === selectedProduct.subCategory;

      const hasCommonWord = product.name
        .toLowerCase()
        .split(' ')
        .some((word) =>
          selectedProduct.name.toLowerCase().includes(word)
        );

      return !isSameProduct && (isSameSubCategory || isSameCategory || hasCommonWord);
    });
  };


  // Filter products on input
  useEffect(() => {
    setDataLoading(true)
    const timeout = setTimeout(async () => {
      const term = query.trim().toLowerCase();
      try {

        if (term.length < 2) {
          setFilteredProducts([]);
          return;
        }

        const res = await axios.get(`${baseUrl}/products/search/${term}`)

        if (res) {
          const fetchedProducts: ProductType[] = res.data.products ?? [];
          console.log("Fetched products:", fetchedProducts);


          const matched = fetchedProducts.filter((product) =>
            product.name.toLowerCase().includes(term) ||
            product.brand.toLowerCase().includes(term) ||
            product.subCategory.toLowerCase().includes(term) ||
            product.prodId.toString().toLowerCase().includes(term)
          );

          setFilteredProducts(matched);
          console.log("matched:", matched);


          if (matched.length > 0) {
            const related = getRelatedProducts(matched[0], fetchedProducts)
            setRelatedProducts(related)
          } else {
            setRelatedProducts([])
          }
        }

      } catch (error) {
        console.log("Error fetching Searched Products: ", error)
      } finally {
        setDataLoading(false)
      }

    }, 300);

    return () => clearTimeout(timeout);
  }, [query, suggestionClicked]);

  // ✅ Only reset suggestionClicked if user typed manually
  useEffect(() => {
    if (isManualTyping.current) {
      setSuggestionClicked(false);
    }
  }, [input]);


  useEffect(() => {
    if (isStorageLoaded) {
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }
  }, [recentSearches, isStorageLoaded]);


  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
    setIsStorageLoaded(true); // ✅ indicate it's safe to save now
  }, []);

  useEffect(() => {
    setInput('')
    setQuery('')
  }, [window.location])


  useEffect(() => {
    if (filteredProducts.length > 0 && suggestionClicked) {
      const related = getRelatedProducts(filteredProducts[0], filteredProducts);
      setRelatedProducts(related);
    }
  }, [filteredProducts, suggestionClicked]);


  return (
    <div className="max-w-6xl mx-auto px-4 py-4">

      {dataLoading ? (
        <>
          <div className="space-y-2 mb-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2 rounded w-full"
              >
                <div className="h-10 w-10 bg-[linear-gradient(110deg,#f8f8f8,45%,#f1f1f1,55%,#f8f8f8)] bg-[length:200%_100%] animate-shine rounded"></div>
                <div className="h-10 w-full bg-[linear-gradient(110deg,#f8f8f8,45%,#f1f1f1,55%,#f8f8f8)] bg-[length:200%_100%] animate-shine rounded"></div>
              </div>
            ))}
          </div>
        </>
      ) : (
        filteredProducts.length > 0 && !suggestionClicked && (
          <div className="space-y-2 mb-4">
            {filteredProducts.slice(0, 8).map((product, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const value = product.name.toLowerCase();
                  isManualTyping.current = false;
                  setInput(value);
                  setQuery(value);
                  setShowRelated(true)
                  setRecentSearches((prev) => {
                    const updated = [value, ...prev.filter((item) => item !== value)];
                    return updated.slice(0, 10);
                  });

                  setSuggestionClicked(true);
                  setTimeout(() => {
                    isManualTyping.current = true;
                  }, 50);
                }}
                className="flex items-center space-x-2 hover:bg-gray-100 w-full rounded"
              >
                <img
                  src={product?.mainImageUrl?.url}
                  alt={product.name}
                  className="h-10 w-10 border rounded"
                />
                <span className="font-poppins text-sm font-medium">
                  {product.name}
                </span>
              </button>
            ))}
          </div>
        )
      )}

      {/* Product Cards */}
      {dataLoading ? (
        <>
          <div className="grid grid-cols-6 w-full gap-8">
            {Array.from({ length: 12 }).map((_, idx) =>
              <div key={idx} className="bg-white space-y-4">
                <div className="h-44 w-full bg-[linear-gradient(110deg,#f8f8f8,45%,#f1f1f1,55%,#f8f8f8)] bg-[length:200%_100%] animate-shine rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-3 w-32 rounded-sm bg-[linear-gradient(110deg,#f8f8f8,45%,#f1f1f1,55%,#f8f8f8)] bg-[length:200%_100%] animate-shine"></div>
                  <div className="h-3 w-24 rounded-sm bg-[linear-gradient(110deg,#f8f8f8,45%,#f1f1f1,55%,#f8f8f8)] bg-[length:200%_100%] animate-shine"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-3 w-16 rounded-sm bg-[linear-gradient(110deg,#f8f8f8,45%,#f1f1f1,55%,#f8f8f8)] bg-[length:200%_100%] animate-shine"></div>
                    <div className="h-3 w-14 rounded-sm bg-[linear-gradient(110deg,#f8f8f8,45%,#f1f1f1,55%,#f8f8f8)] bg-[length:200%_100%] animate-shine"></div>
                  </div>
                  <div className="h-7 w-16 rounded bg-[linear-gradient(110deg,#f8f8f8,45%,#f1f1f1,55%,#f8f8f8)] bg-[length:200%_100%] animate-shine"></div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : input.trim().length > 0 ? (
        filteredProducts.length > 0 ? (
          <>
            <h1 className="my-2 font-poppins font-semibold">
              Search Results For "{input}"
            </h1>
            <div className="grid grid-cols-6 gap-4">
              {filteredProducts.map((product, idx) => {
                const cartItem: CartItemType =
                  cart.find((item) => item.id === product.prodId) ?? {
                    id: product.prodId,
                    quantity: 0,
                  };

                return (
                  <ProductCard
                    key={idx}
                    prodId={product.prodId}
                    name={product.name}
                    discount={product.discount}
                    mainImageUrl={product.mainImageUrl}
                    mrp={product.mrp}
                    price={product.price}
                    unit={product.unit}
                    cartItem={cartItem}
                  />
                );
              })}
            </div>

            {relatedProducts.length > 0 && showRelated && (
              <>
                <h1 className="my-2 font-poppins font-semibold">
                  Search Related Products
                </h1>
                <div className="grid grid-cols-6 gap-4">
                  {relatedProducts.map((product, idx) => {
                    const cartItem: CartItemType =
                      cart.find((item) => item.id === product.prodId) ?? {
                        id: product.prodId,
                        quantity: 0,
                      };

                    return (
                      <ProductCard
                        key={idx}
                        prodId={product.prodId}
                        name={product.name}
                        discount={product.discount}
                        mainImageUrl={product.mainImageUrl}
                        mrp={product.mrp}
                        price={product.price}
                        unit={product.unit}
                        cartItem={cartItem}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 mt-8 font-medium">
            No products found.
          </p>
        )
      ) :
        recentSearches.length > 0 ? (
          <>
            <div className="flex justify-between items-center">
              <h1 className="font-gilroy text-lg text-gray-800">
                Recent Searches
              </h1>
              <button
                onClick={() => {
                  setRecentSearches([]);
                  localStorage.removeItem('recentSearches');
                }}
                className="text-[#318616] font-medium"
              >
                clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {recentSearches.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(term);
                    setQuery(term);
                  }}
                  className="border shadow-sm px-4 py-1 rounded-lg text-sm font-[450] text-gray-600"
                >
                  {term}
                </button>
              ))}
            </div>
          </>
        ) : null}

    </div>
  );
};

export default Search;
