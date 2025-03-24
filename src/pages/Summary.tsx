import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCart } from "@/hooks/use-cart";
import { useTransactions } from "@/hooks/use-transaction";
import { toast } from "@/hooks/use-toast";

const Summary: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalAmount, totalDeduction } = useCart();
  const { processTransaction, verifyOtp, isLoading, error } = useTransactions();

  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");

  // Mock farmer data (would come from form or API in real app)
  const farmerData = {
    name: "Gladys Kivuva",
    id: "12345678",
    phone: "0712345678",
  };

  const handleBack = () => {
    navigate("/product-details");
  };

  const handlePayment = async () => {
    // Open OTP dialog
    setOtpDialogOpen(true);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]; // Only take the first character
    }

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      // Focus previous input when backspace is pressed on an empty input
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otpValues.join("");

    if (otpCode.length !== 6) {
      setOtpError("Please enter all 6 digits");
      return;
    }

    try {
      const verified = await verifyOtp(otpCode);

      if (verified) {
        setOtpDialogOpen(false);
        setOtpError(null);

        // Process the transaction
        const result = await processTransaction({
          farmerName: farmerData.name,
          farmerId: farmerData.id,
          farmerPhone: farmerData.phone,
          items,
          totalAmount,
          totalDeduction,
          walletBalance: 2400, // Mock wallet balance
        });

        if (result.success) {
          setPaymentSuccess(true);
          setTransactionRef(result.data.transactionId);
        }
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      toast({
        title: "Payment Failed",
        description:
          "There was an error processing your payment. Please try again.",
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  const handleResendOtp = () => {
    toast({
      title: "OTP Resent",
      description:
        "A new verification code has been sent to the registered phone number",
      duration: 3000,
      variant: "success",
    });
  };

  const handleDownloadReceipt = () => {
    toast({
      title: "Receipt Downloaded",
      description: "Transaction receipt has been downloaded successfully",
      duration: 3000,
      variant: "success",
    });
  };

  const handleDone = () => {
    // Reset cart and redirect to dashboard
    navigate("/dashboard");
  };

  // If payment is successful, show success screen
  if (paymentSuccess) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 4, maxWidth: 500, width: "100%", textAlign: "center" }}
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
            Payment Successful
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            Ref Number: <strong>{transactionRef}</strong>
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            Date: <strong>{new Date().toLocaleDateString()}</strong>
          </Typography>

          <Box sx={{ my: 4, display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                border: "2px solid green",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" color="green">
                ✓
              </Typography>
            </Box>
          </Box>

          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
            {totalDeduction.toFixed(2)} KES
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Agrovet product purchase for
            <br />
            <strong>
              {farmerData.name} - {farmerData.id}
            </strong>
          </Typography>

          <Box
            sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
          >
            <Button
              variant="outlined"
              fullWidth
              onClick={handleDownloadReceipt}
            >
              Download Receipt
            </Button>

            <Button
              variant="contained"
              fullWidth
              onClick={handleDone}
              sx={{ bgcolor: "black", "&:hover": { bgcolor: "#333" } }}
            >
              Done
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

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
          Summary
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
          Selected Products
        </Typography>

        <TableContainer sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product name</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Deduction</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.product.id}>
                  <TableCell>{item.product.title}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">
                    {item.product.price.toFixed(2)} kes
                  </TableCell>
                  <TableCell align="right">
                    {(item.product.price * item.quantity).toFixed(2)} kes
                  </TableCell>
                  <TableCell align="right">
                    {item.deduction.toFixed(2)} kes
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} sx={{ fontWeight: "bold" }}>
                  Total
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold" }}
                ></TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {totalDeduction.toFixed(2)} kes
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ my: 3 }}>
          <Typography variant="body1">
            Enter the <strong>verification code</strong> sent to the parent at{" "}
            <strong>072*****715</strong> via SMS.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{ px: 4, py: 1.5 }}
          >
            Back
          </Button>

          <Button
            variant="contained"
            onClick={handlePayment}
            disabled={isLoading}
            sx={{
              backgroundColor: "black",
              color: "white",
              px: 4,
              py: 1.5,
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Pay ${totalDeduction.toFixed(2)} Kes`
            )}
          </Button>
        </Box>
      </Paper>

      <Box sx={{ mt: 3, textAlign: "center", color: "error.main" }}>
        <Typography variant="body2">
          You will receive {totalDeduction.toFixed(2)} kes from the subsidy
          program. If this does not cover the total cost of the purchase ensure
          you get the balance from the customer.
        </Typography>
      </Box>

      {/* OTP Verification Dialog */}
      <Dialog
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          Enter Verification Code
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ textAlign: "center", mb: 3 }}>
            Please enter the 6-digit code sent to <strong>072*****715</strong>
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              mb: 2,
            }}
          >
            {otpValues.map((value, index) => (
              <TextField
                key={index}
                id={`otp-input-${index}`}
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: "center" },
                }}
                sx={{ width: 40 }}
                autoFocus={index === 0}
              />
            ))}
          </Box>

          {otpError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {otpError}
            </Alert>
          )}

          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Didn't receive OTP?
            <Button
              onClick={handleResendOtp}
              sx={{ ml: 1, textTransform: "none", p: 0 }}
            >
              Resend in 1min 30sec
            </Button>
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button
            onClick={() => setOtpDialogOpen(false)}
            variant="outlined"
            sx={{ width: 120 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerifyOtp}
            variant="contained"
            disabled={isLoading}
            sx={{
              width: 120,
              backgroundColor: "black",
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Verify"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Summary;
