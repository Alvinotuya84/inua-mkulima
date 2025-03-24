import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTransactions } from "@/hooks/use-transaction";
import TransactionReceipt from "@/components/common/TransactionReciept";
import { toast } from "@/hooks/use-toast";

const Receipt: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTransactionReceipt } = useTransactions();
  const [isLoading, setIsLoading] = useState(true);
  const [receipt, setReceipt] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        setIsLoading(true);
        // In a real application, you would fetch the receipt from your API
        // Here we're using the mock function from useTransactions
        if (id) {
          const receiptData = getTransactionReceipt(id);
          setReceipt(receiptData);
        } else {
          throw new Error("Transaction ID is required");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch receipt";
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

    fetchReceipt();
  }, [id, getTransactionReceipt]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownload = () => {
    toast({
      title: "Receipt Downloaded",
      description: "Transaction receipt has been downloaded successfully",
    });
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

  if (error || !receipt) {
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
            Error Loading Receipt
          </Typography>
          <Typography variant="body1">
            {error || "Receipt not found"}
          </Typography>
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
        Back
      </Button>

      <TransactionReceipt receiptData={receipt} onDownload={handleDownload} />
    </Box>
  );
};

export default Receipt;
