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

  // ✅ Ref to detect manual typing
  const isManualTyping = useRef(true);

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
    }, 300);

    return () => clearTimeout(timeout);
  }, [input]);

  // ✅ Only reset suggestionClicked if user typed manually
  useEffect(() => {
    if (isManualTyping.current) {
      setSuggestionClicked(false);
    }
  }, [input]);

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
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="font-gilroy text-lg text-gray-800">
              Recent Searches
            </h1>
            <button className="text-[#318616] font-medium">clear</button>
          </div>
          <div className="flex space-x-4 text-nowrap">
            <button className="border shadow-sm px-4 py-1 rounded-lg text-sm font-[450] text-gray-600 my-4">
              wwe 2k24
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
