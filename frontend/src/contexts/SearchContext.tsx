import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { useSearchParams } from "react-router-dom";

interface SearchContextType {
  query: string;
  setQuery: (q: string) => void;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  showIcon: boolean;
  setShowIcon: Dispatch<SetStateAction<boolean>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState<string>("");
  const [showIcon, setShowIcon] = useState<boolean>(false);

  const query = searchParams.get("q") || "";

  const setQuery = (q: string) => {
    if (q.trim()) {
      setSearchParams({ q });
    } else {
      setSearchParams({});
    }
  };

  // Optional: Sync input -> query param automatically
  useEffect(() => {
    if (input.trim()) {
      setShowIcon(true);
      setQuery(input);
    } else {
      setShowIcon(false);
      setQuery("");
    }
  }, [input]);

  return (
    <SearchContext.Provider
      value={{ query, setQuery, input, setInput, showIcon, setShowIcon }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within a SearchProvider");
  return context;
};
