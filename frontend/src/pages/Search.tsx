import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { products } from "../data/productData";
import { type ProductType } from "../types/ProductTypeProps";
import ProductCard from "../components/ProductCard";
import { useCart } from "../contexts/CartContext";
import { type CartItemType } from "../types/CartItemType";
import { useSearch } from "../contexts/SearchContext";

const Search = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const { query, setQuery, input, setInput } = useSearch();

  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [suggestionClicked, setSuggestionClicked] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);

  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);


  // ✅ Ref to detect manual typing
  const isManualTyping = useRef(true);

  const getRelatedProducts = (selectedProduct) => {
    return products.filter((product) => {
      const isSameProduct = product.id === selectedProduct.id;

      const isSameCategory = product.category === selectedProduct.category;
      const isSameSubCategory = product.subCategory === selectedProduct.subCategory;

      const hasCommonWord = product.productName
        .toLowerCase()
        .split(' ')
        .some((word) =>
          selectedProduct.productName.toLowerCase().includes(word)
        );

      return !isSameProduct && (isSameSubCategory || isSameCategory || hasCommonWord);
    });
  };


  // Filter products on input
  useEffect(() => {
    const timeout = setTimeout(() => {
      const term = input.trim().toLowerCase();

      if (term.length < 2) {
        setFilteredProducts([]);
        return;
      }

      const matched = products.filter((product) =>
        product.productName.toLowerCase().includes(term)
      );
      setFilteredProducts(matched);

      if (matched.length > 0) {
        const related = getRelatedProducts(matched[0])
        setRelatedProducts(related)
      } else {
        setRelatedProducts([])
      }


    }, 300);

    return () => clearTimeout(timeout);
  }, [input]);

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
  },[window.location])



  return (
    <div className="max-w-6xl mx-auto px-4 py-4">

      {/* ✅ Suggestions only if not clicked */}
      {filteredProducts.length > 0 && !suggestionClicked && (
        <div className="space-y-2 mb-4">
          {filteredProducts.slice(0, 8).map((product, idx) => (
            <button
              key={idx}
              onClick={() => {
                const value = product.productName.toLowerCase();
                isManualTyping.current = false; // 👈 prevent useEffect from resetting suggestionClicked
                setInput(value);
                setQuery(value);
                setRecentSearches((prev) => {
                  const updated = [value, ...prev.filter((item) => item !== value)];
                  return updated.slice(0, 10); // keep only 10 latest
                });

                setSuggestionClicked(true);
                setTimeout(() => {
                  isManualTyping.current = true; // reset for future typing
                }, 50);
              }}
              className="flex items-center space-x-2 hover:bg-gray-100 w-full rounded"
            >
              <img
                src={product.productImage}
                alt={product.productName}
                className="h-10 w-10 border rounded"
              />
              <span className="font-poppins text-sm font-medium">
                {product.productName}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Product Cards */}
      {filteredProducts.length > 0 ? (
        <>
          <h1 className="my-2 font-poppins font-semibold">
            Search Results For "{input}"
          </h1>
          <div className="grid grid-cols-6 gap-4">
            {filteredProducts.map((product, idx) => {
              const cartItem: CartItemType =
                cart.find((item) => item.id === product.id) ?? {
                  id: product.id,
                  productName: product.productName ?? "",
                  productPrice: product.discountPrice ?? 0,
                  productMrp: product?.mrp,
                  productImage: product.productImage ?? "",
                  unit: product.unit ?? "",
                  quantity: 0,
                };

              return (
                <ProductCard
                  key={idx}
                  id={product.id}
                  name={product.productName}
                  category={product.category}
                  subCategory={product.subCategory}
                  discountPrice={product.discountPrice}
                  image={product.productImage}
                  mrp={product.mrp}
                  unit={product.unit}
                  quantity={product.quantity}
                  cartItem={cartItem}
                />
              );
            })}
          </div>

          <h1 className="my-2 font-poppins font-semibold">
            Search Related Products
          </h1>
          <div className="grid grid-cols-6 gap-4">
            {relatedProducts.map((product, idx) => {
              const cartItem: CartItemType =
                cart.find((item) => item.id === product.id) ?? {
                  id: product.id,
                  productName: product.productName ?? "",
                  productPrice: product.discountPrice ?? 0,
                  productMrp: product?.mrp,
                  productImage: product.productImage ?? "",
                  unit: product.unit ?? "",
                  quantity: 0,
                };

              return (
                <ProductCard
                  key={idx}
                  id={product.id}
                  name={product.productName}
                  category={product.category}
                  subCategory={product.subCategory}
                  discountPrice={product.discountPrice}
                  image={product.productImage}
                  mrp={product.mrp}
                  unit={product.unit}
                  quantity={product.quantity}
                  cartItem={cartItem}
                />
              );
            })}
          </div>
        </>
      ) : (
        <>
          {recentSearches.length > 0
            ? (
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
            ) : (
              <>
              </>
            )}
        </>
      )}
    </div>
  );
};

export default Search;
