import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Rating,
  Chip,
  Divider,
  IconButton,
  CircularProgress,
  TextField,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/constants/network";
import { toast } from "@/hooks/use-toast";
import { fetchJson } from "@/utils/fetch.utils";
import { useCart } from "@/hooks/use-cart";

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0");
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [subsidy, setSubsidy] = useState(0);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", productId],
    queryFn: async () => {
      if (!productId) return null;

      try {
        const product = await fetchJson<Product>(
          `${BASE_URL}/products/${productId}`
        );
        return {
          ...product,
          price: Math.round(product.price * 150), // Convert to KES
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

  // Set default subsidy when product data loads
  React.useEffect(() => {
    if (product) {
      // Default subsidy is 60% of the price
      setSubsidy(Math.round(product.price * 0.6));
    }
  }, [product]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem(product, quantity, subsidy);

    toast({
      title: "Product Added",
      description: `${quantity} ${quantity > 1 ? "units" : "unit"} of ${
        product.title
      } added to cart`,
    });

    // Navigate to product details page
    navigate("/product-details");
  };

  const handleIncreaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
      // Update subsidy proportionally
      setSubsidy(Math.round((quantity + 1) * (product.price * 0.6)));
    } else {
      toast({
        title: "Maximum Stock Reached",
        description: "Cannot add more units of this product",
      });
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      // Update subsidy proportionally
      setSubsidy(Math.round((quantity - 1) * (Number(product?.price) * 0.6)));
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
      if (product) {
        setSubsidy(Math.round(product.price * 0.6));
      }
    } else if (product && value > product.stock) {
      setQuantity(product.stock);
      setSubsidy(Math.round(product.stock * (product.price * 0.6)));
    } else {
      setQuantity(value);
      if (product) {
        setSubsidy(Math.round(value * (product.price * 0.6)));
      }
    }
  };

  const handleSubsidyChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) {
      setSubsidy(0);
    } else if (product && value > product.price * quantity) {
      setSubsidy(product.price * quantity);
      toast({
        title: "Maximum Subsidy Reached",
        description: "Subsidy cannot exceed the total product price",
        duration: 3000,
      });
    } else {
      setSubsidy(value);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !product) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Back
        </Button>

        <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Error Loading Product
          </Typography>
          <Typography variant="body1">
            The product you're looking for could not be found or an error
            occurred.
          </Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => navigate("/products")}
          >
            Browse All Products
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{
          mb: 3,
          backgroundColor: "#E0B643",
          color: "white",
          "&:hover": {
            backgroundColor: "#C9A43B",
          },
        }}
      >
        Back to Products
      </Button>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Product images */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <img
                src={product.images[selectedImage] || product.thumbnail}
                alt={product.title}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "400px",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
              {product.images.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 80,
                    height: 80,
                    border:
                      index === selectedImage
                        ? "2px solid #E0B643"
                        : "1px solid #e0e0e0",
                    borderRadius: "4px",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#C9A43B",
                    },
                  }}
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={image}
                    alt={`${product.title} - view ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "3px",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Product details */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: "bold" }}
              >
                {product.title}
              </Typography>
              <Chip
                label={product.stock > 0 ? "In Stock" : "Out of Stock"}
                color={product.stock > 0 ? "success" : "error"}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {product.rating} Rating
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                KES {product.price.toLocaleString()}
              </Typography>
              {product.discountPercentage > 0 && (
                <Typography variant="body2" color="error">
                  {product.discountPercentage}% OFF
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Quantity:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                  sx={{ border: "1px solid #e0e0e0" }}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{
                    min: 1,
                    max: product.stock,
                    style: { textAlign: "center" },
                  }}
                  sx={{ width: 60, mx: 1 }}
                />
                <IconButton
                  onClick={handleIncreaseQuantity}
                  disabled={quantity >= product.stock}
                  sx={{ border: "1px solid #e0e0e0" }}
                >
                  <AddIcon />
                </IconButton>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 2 }}
                >
                  {product.stock} available
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Subsidy Amount:
              </Typography>
              <TextField
                value={subsidy}
                onChange={handleSubsidyChange}
                fullWidth
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>KES</Typography>,
                }}
                helperText={`Maximum: KES ${(
                  product.price * quantity
                ).toLocaleString()}`}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Summary:
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Price per unit</TableCell>
                      <TableCell align="right">
                        KES {product.price.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Quantity</TableCell>
                      <TableCell align="right">{quantity}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total price</TableCell>
                      <TableCell align="right">
                        KES {(product.price * quantity).toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Subsidy</TableCell>
                      <TableCell align="right">
                        KES {subsidy.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Customer pays
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        KES{" "}
                        {Math.max(
                          0,
                          product.price * quantity - subsidy
                        ).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              sx={{
                py: 1.5,
                backgroundColor: "#E0B643",
                "&:hover": {
                  backgroundColor: "#C9A43B",
                },
              }}
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="product information tabs"
          >
            <Tab label="Specifications" />
            <Tab label="Details" />
            <Tab label="Reviews" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                      Brand
                    </TableCell>
                    <TableCell>{product.brand}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Category
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Stock
                    </TableCell>
                    <TableCell>{product.stock} units</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Rating
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Rating
                          value={product.rating}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {product.rating}/5
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Typography variant="body1">
              This product is eligible for government subsidy under the Inua
              Mkulima program. The subsidy amount can be adjusted based on
              farmer needs and program guidelines.
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Customer Reviews
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Rating value={product.rating} precision={0.5} readOnly />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {product.rating} out of 5
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Reviews will be displayed here when available.
            </Typography>
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProductDetail;
