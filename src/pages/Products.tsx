import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Rating,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/constants/network";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { fetchJson, fetchWithParams } from "@/utils/fetch.utils";

// Product type definition
interface Product {
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

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const Products = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addItem } = useCart();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await fetchJson(`${BASE_URL}/products/categories`);
        return response;
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
    },
  });

  const productsQuery = useQuery({
    queryKey: [
      "products",
      searchQuery,
      sortBy,
      sortOrder,
      page,
      limit,
      selectedCategory,
    ],
    queryFn: async () => {
      try {
        let url;
        let params = {};

        if (searchQuery) {
          url = `${BASE_URL}/products/search`;
          params = { q: searchQuery };
        } else if (selectedCategory !== "all") {
          url = `${BASE_URL}/products/category/${selectedCategory}`;
        } else {
          url = `${BASE_URL}/products`;
        }

        params = {
          ...params,
          limit,
          skip: (page - 1) * limit,
          sortBy,
          order: sortOrder,
        };

        const response = await fetchWithParams(url, params);
        return response;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    staleTime: 60000, // 1 minute
  });

  // Calculate total pages
  const totalPages = productsQuery.data
    ? Math.ceil(productsQuery.data.total / limit)
    : 0;

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      productsQuery.refetch();
    }
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1); // Reset to first page on category change
  };

  const handleAddToCart = (product) => {
    // Convert price to KES (assuming 1 USD = 150 KES)
    const convertedProduct = {
      ...product,
      price: Math.round(product.price * 150),
    };

    // Calculate default subsidy (60% of price)
    const defaultSubsidy = Math.round(convertedProduct.price * 0.6);

    addItem(convertedProduct, 1, defaultSubsidy);

    toast({
      title: "Product Added",
      description: `${product.title} has been added to cart`,
      duration: 3000,
      variant: "success",
    });
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const getAgriculturalLabel = (category) => {
    // Map non-agricultural categories to agricultural equivalents for demo purposes
    const categoryMap = {
      beauty: "Pesticides",
      fragrances: "Fertilizers",
      furniture: "Farming Tools",
      smartphones: "Smart Farming Devices",
      laptops: "Farm Management Systems",
      groceries: "Seeds",
      "home-decoration": "Farm Supplies",
      skincare: "Plant Health",
      tops: "Protective Gear",
      "womens-dresses": "Farm Clothing",
      "womens-shoes": "Farm Footwear",
      "mens-shirts": "Worker Uniforms",
      "mens-shoes": "Heavy Duty Boots",
      "mens-watches": "Farm Timers",
      "womens-watches": "Irrigation Timers",
      "womens-bags": "Harvest Bags",
      sunglasses: "Sun Protection",
      automotive: "Farm Vehicles",
      motorcycle: "Field Transport",
      lighting: "Greenhouse Lighting",
    };

    return categoryMap[category] || "Farm Supplies";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Agricultural Products
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Search field */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchQuery("")} size="small">
                      ×
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Category filter */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={selectedCategory}
                label="Category"
                onChange={handleCategoryChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categoriesQuery.data?.map((category) => (
                  <MenuItem key={category} value={category}>
                    {getAgriculturalLabel(category)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sort by */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel id="sort-by-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                value={sortBy}
                label="Sort By"
                onChange={handleSortByChange}
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="title">Name</MenuItem>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="stock">Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Sort order */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel id="sort-order-label">Order</InputLabel>
              <Select
                labelId="sort-order-label"
                value={sortOrder}
                label="Order"
                onChange={handleSortOrderChange}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Loading state */}
        {productsQuery.isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error state */}
        {productsQuery.isError && (
          <Box sx={{ my: 4, textAlign: "center" }}>
            <Typography color="error">
              Error loading products. Please try again.
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => productsQuery.refetch()}
            >
              Retry
            </Button>
          </Box>
        )}

        {/* Products grid */}
        {productsQuery.isSuccess && (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing{" "}
                {productsQuery.data.products.length > 0
                  ? `${(page - 1) * limit + 1} - ${Math.min(
                      page * limit,
                      productsQuery.data.total
                    )}`
                  : "0"}{" "}
                of {productsQuery.data.total} products
              </Typography>
            </Box>

            {productsQuery.data.products.length === 0 ? (
              <Box sx={{ textAlign: "center", my: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No products found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Try adjusting your search or filters
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {productsQuery.data.products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                          cursor: "pointer",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="180"
                        image={product.thumbnail}
                        alt={product.title}
                        sx={{ objectFit: "cover" }}
                        onClick={() => handleViewProduct(product.id)}
                      />
                      <CardContent
                        sx={{ flexGrow: 1 }}
                        onClick={() => handleViewProduct(product.id)}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="div"
                            sx={{
                              fontWeight: "bold",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              height: "3rem",
                            }}
                          >
                            {product.title}
                          </Typography>
                          <Chip
                            label={
                              product.stock > 10
                                ? "In Stock"
                                : product.stock > 0
                                ? "Low Stock"
                                : "Out of Stock"
                            }
                            color={
                              product.stock > 10
                                ? "success"
                                : product.stock > 0
                                ? "warning"
                                : "error"
                            }
                            size="small"
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            height: "3rem",
                          }}
                        >
                          {product.description}
                        </Typography>

                        <Chip
                          label={getAgriculturalLabel(product.category)}
                          size="small"
                          sx={{ mb: 1, bgcolor: "#f0f0f0" }}
                        />

                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Rating
                            value={product.rating}
                            precision={0.5}
                            readOnly
                            size="small"
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ ml: 1 }}
                          >
                            {product.rating.toFixed(1)}
                          </Typography>
                        </Box>
                      </CardContent>

                      <Divider />

                      <CardActions
                        sx={{ justifyContent: "space-between", p: 2 }}
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          color="primary"
                        >
                          KES {Math.round(product.price * 150).toLocaleString()}
                        </Typography>

                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<AddShoppingCartIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          disabled={product.stock === 0}
                          sx={{
                            bgcolor: "#E0B643",
                            "&:hover": {
                              bgcolor: "#C9A43B",
                            },
                          }}
                        >
                          Add
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Products;
