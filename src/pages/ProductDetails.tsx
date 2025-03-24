import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
  TextField,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useProducts } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";

const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const { agriculturalProducts } = useProducts();
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    updateDeduction,
    totalAmount,
    totalDeduction,
  } = useCart();

  const [walletBalance, setWalletBalance] = useState(2400); // In a real app, this would come from an API

  const handleBack = () => {
    navigate(-1);
  };

  const handleProceed = () => {
    if (items.length === 0) {
      toast({
        title: "No products selected",
        description: "Please select at least one product to proceed",
        duration: 3000,
        variant: "warning",
      });
      return;
    }

    navigate("/summary");
  };

  const handleAddProduct = (product) => {
    addItem(product, 1, calculateDefaultDeduction(product.price));
  };

  const calculateDefaultDeduction = (price) => {
    return Math.round(price * 0.6);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const product = agriculturalProducts.find((p) => p.id === productId);
    if (!product) return;

    // Update quantity
    updateQuantity(productId, newQuantity);

    // Recalculate deduction based on new quantity
    const item = items.find((i) => i.product.id === productId);
    if (item) {
      const deductionPerUnit = item.deduction / item.quantity;
      updateDeduction(productId, deductionPerUnit * newQuantity);
    }
  };

  // Handle deduction change
  const handleDeductionChange = (productId, newDeduction) => {
    const item = items.find((i) => i.product.id === productId);
    if (!item) return;

    const totalPrice = item.product.price * item.quantity;

    // Ensure deduction doesn't exceed price or available balance
    const maxDeduction = Math.min(totalPrice, walletBalance);

    if (newDeduction > maxDeduction) {
      newDeduction = maxDeduction;
      toast({
        title: "Maximum deduction reached",
        description: "Deduction cannot exceed product price or wallet balance",
        duration: 3000,
        variant: "info",
      });
    }

    updateDeduction(productId, newDeduction);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            backgroundColor: "#E0B643",
            color: "white",
            "&:hover": {
              backgroundColor: "#C9A43B",
            },
          }}
        >
          Back
        </Button>

        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Product Details
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Inua mkulima wallet balance:{" "}
          <strong>Kes {walletBalance.toFixed(2)}</strong>
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left side - Products List */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Products
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product name</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agriculturalProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.title}</TableCell>
                      <TableCell align="right">{product.price} kes</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleAddProduct(product)}
                          sx={{
                            backgroundColor: "#f5f5f5",
                            "&:hover": {
                              backgroundColor: "#e0e0e0",
                            },
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Right side - Selected Products */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Selected Products
            </Typography>

            {items.length === 0 ? (
              <Box
                sx={{
                  p: 4,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "calc(100% - 50px)",
                  color: "#888",
                }}
              >
                <Typography variant="body1">
                  Please select a product from the products panel first
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer sx={{ mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product name</TableCell>
                        <TableCell align="center">Qty</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Deduction</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.product.id}>
                          <TableCell>{item.product.title}</TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <TextField
                                value={item.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 1;
                                  handleQuantityChange(item.product.id, value);
                                }}
                                inputProps={{
                                  min: 1,
                                  style: { textAlign: "center" },
                                }}
                                sx={{ width: 40, mx: 1 }}
                                size="small"
                              />
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            {item.product.price} kes
                          </TableCell>
                          <TableCell align="right">
                            {item.product.price * item.quantity} kes
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              value={item.deduction}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                handleDeductionChange(item.product.id, value);
                              }}
                              inputProps={{
                                min: 0,
                                style: { textAlign: "right" },
                              }}
                              sx={{ width: 70 }}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => removeItem(item.product.id)}
                              sx={{ color: "error.main" }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          align="right"
                          sx={{ fontWeight: "bold" }}
                        >
                          Total
                        </TableCell>
                        <TableCell
                          colSpan={3}
                          align="right"
                          sx={{ fontWeight: "bold" }}
                        >
                          {totalAmount} kes
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleProceed}
                    sx={{
                      backgroundColor: "gray",
                      color: "white",
                      px: 4,
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: "#555",
                      },
                    }}
                  >
                    Deduct {totalDeduction.toFixed(2)} KES
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {items.length > 0 && (
        <Box sx={{ mt: 3, textAlign: "center", color: "error.main" }}>
          <Typography variant="body2">
            You will receive {totalDeduction.toFixed(2)} kes from the subsidy
            program. If this does not cover the total cost of the purchase
            ensure you get the balance from the customer.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductDetails;
