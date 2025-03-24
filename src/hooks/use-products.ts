import { useState, useEffect } from "react";
import { BASE_URL } from "@/constants/network";
import { toast } from "@/hooks/use-toast";
import { fetchJson } from "@/utils/fetch.utils";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  discountPercentage: number;
  stock: number;
  brand: string;
  thumbnail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchJson<ProductsResponse>(
        `${BASE_URL}/products`
      );

      // Transform the products to match our application's format
      const transformedProducts = response.products.map((product) => ({
        ...product,
        // For demonstration purposes, we're converting the price to KES
        // In a real app, you might have actual KES prices from your API
        price: Math.round(product.price * 150), // Assuming 1 USD = 150 KES
      }));

      setProducts(transformedProducts);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch products";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProductById = (id: number) => {
    return products.find((product) => product.id === id) || null;
  };

  // For the Inua Mkulima application, we'll provide agricultural products
  const getAgricultureProducts = () => {
    // In a real app, you'd have actual agricultural products or filter by category
    // Here we're just simulating agricultural products based on the existing data
    return [
      {
        id: 1,
        title: "Animal feeds 10kg",
        price: 1500,
        category: "agriculture",
        stock: 50,
        discountPercentage: 0,
        description: "High quality animal feeds",
        brand: "FarmFresh",
        thumbnail: "",
      },
      {
        id: 2,
        title: "Mineral salts 500g",
        price: 300,
        category: "agriculture",
        stock: 100,
        discountPercentage: 0,
        description: "Essential mineral supplements for livestock",
        brand: "VitaGro",
        thumbnail: "",
      },
      {
        id: 3,
        title: "Maize seeds 2kg",
        price: 360,
        category: "agriculture",
        stock: 75,
        discountPercentage: 0,
        description: "High yield maize seed variety",
        brand: "SeedTech",
        thumbnail: "",
      },
      {
        id: 4,
        title: "Mango seedling 1pc",
        price: 150,
        category: "agriculture",
        stock: 40,
        discountPercentage: 0,
        description: "Quality mango seedlings ready for transplanting",
        brand: "FruitGrow",
        thumbnail: "",
      },
      {
        id: 5,
        title: "Mango fruit fly trap 1pc",
        price: 1500,
        category: "agriculture",
        stock: 30,
        discountPercentage: 0,
        description: "Effective trap for mango fruit flies",
        brand: "PestGuard",
        thumbnail: "",
      },
    ];
  };

  return {
    products,
    agriculturalProducts: getAgricultureProducts(),
    isLoading,
    error,
    refreshProducts: fetchProducts,
    getProductById,
  };
};
