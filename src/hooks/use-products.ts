import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/constants/network";
import { toast } from "@/hooks/use-toast";
import { fetchJson } from "@/utils/fetch.utils";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductSearchOptions {
  searchQuery?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  category?: string;
}

export const useProducts = () => {
  const [searchOptions, setSearchOptions] = useState<ProductSearchOptions>({
    searchQuery: "",
    sortBy: "title",
    sortOrder: "asc",
    page: 1,
    limit: 12,
    category: "all",
  });

  // Fetch all categories
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const categories = await fetchJson<string[]>(
          `${BASE_URL}/products/categories`
        );
        return categories;
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to load product categories",
          variant: "destructive",
        });
        throw error;
      }
    },
    staleTime: 30 * 60 * 1000,
  });

  const productsQuery = useQuery({
    queryKey: ["products", searchOptions],
    queryFn: async () => {
      try {
        const { searchQuery, sortBy, sortOrder, page, limit, category } =
          searchOptions;
        let url = `${BASE_URL}/products`;

        if (searchQuery) {
          url = `${BASE_URL}/products/search?q=${searchQuery}`;
        } else if (category && category !== "all") {
          url = `${BASE_URL}/products/category/${category}`;
        }

        const separator = url.includes("?") ? "&" : "?";
        url += `${separator}sortBy=${sortBy}&order=${sortOrder}&limit=${limit}&skip=${
          (page - 1) * limit
        }`;

        const response = await fetchJson<ProductsResponse>(url);

        response.products = response.products.map((product) => ({
          ...product,
          price: Math.round(product.price * 150),
        }));

        return response;
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products",
          duration: 3000,
          variant: "destructive",
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const getProductById = (productId: number) => {
    return useQuery({
      queryKey: ["product", productId],
      queryFn: async () => {
        try {
          const product = await fetchJson<Product>(
            `${BASE_URL}/products/${productId}`
          );
          return {
            ...product,
            price: Math.round(product.price * 150),
          };
        } catch (error) {
          console.error(`Error fetching product ${productId}:`, error);
          toast({
            title: "Error",
            description: "Failed to load product details",
            duration: 3000,
            variant: "destructive",
          });
          throw error;
        }
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  const updateSearchOptions = (newOptions: Partial<ProductSearchOptions>) => {
    setSearchOptions((prev) => ({
      ...prev,
      ...newOptions,
      page: newOptions.page || ("page" in newOptions ? newOptions.page : 1),
    }));
  };

  return {
    products: productsQuery.data?.products || [],
    totalProducts: productsQuery.data?.total || 0,
    currentPage: searchOptions.page,
    totalPages: productsQuery.data
      ? Math.ceil(productsQuery.data.total / searchOptions.limit)
      : 0,
    isLoadingProducts: productsQuery.isLoading,
    isErrorProducts: productsQuery.isError,
    refetchProducts: productsQuery.refetch,

    categories: categoriesQuery.data || [],
    isLoadingCategories: categoriesQuery.isLoading,
    isErrorCategories: categoriesQuery.isError,

    searchOptions,
    updateSearchOptions,
    getProductById,

    // Convenience methods
    setSearchQuery: (query: string) =>
      updateSearchOptions({ searchQuery: query, page: 1 }),
    setSortBy: (sortBy: string) => updateSearchOptions({ sortBy }),
    setSortOrder: (sortOrder: "asc" | "desc") =>
      updateSearchOptions({ sortOrder }),
    setPage: (page: number) => updateSearchOptions({ page }),
    setLimit: (limit: number) => updateSearchOptions({ limit, page: 1 }),
    setCategory: (category: string) =>
      updateSearchOptions({ category, page: 1 }),
  };
};
