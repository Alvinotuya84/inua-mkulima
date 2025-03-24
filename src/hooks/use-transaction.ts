import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { CartItem } from "@/hooks/use-cart";

interface TransactionDetails {
  farmerName: string;
  farmerId: string;
  farmerPhone: string;
  items: CartItem[];
  totalAmount: number;
  totalDeduction: number;
  walletBalance: number;
}

interface TransactionResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;
    date: string;
    amount: number;
    status: "completed" | "failed" | "pending";
  };
}

export const useTransactions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const navigate = useNavigate();

  const processTransaction = async (details: TransactionDetails) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real application, you would call your API
      // Here we simulate a successful transaction after a delay

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a random transaction ID for demo purposes
      const generatedTransactionId =
        "ABAK" + Math.random().toString(36).substring(2, 9).toUpperCase();
      setTransactionId(generatedTransactionId);

      // Simulate successful response
      const response: TransactionResponse = {
        success: true,
        message: "Transaction completed successfully",
        data: {
          transactionId: generatedTransactionId,
          date: new Date().toISOString(),
          amount: details.totalDeduction,
          status: "completed",
        },
      };

      toast({
        title: "Transaction Successful",
        description: `Transaction ID: ${generatedTransactionId}`,
        duration: 3000,
        variant: "success",
      });

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process transaction";
      setError(errorMessage);
      toast({
        title: "Transaction Failed",
        description: errorMessage,
        duration: 3000,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, accept any 6-digit OTP
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        toast({
          title: "OTP Verified",
          description: "Proceeding with transaction",
          duration: 2000,
          variant: "success",
        });
        return true;
      } else {
        setError("Invalid OTP. Please try again.");
        toast({
          title: "Invalid OTP",
          description: "Please enter a valid 6-digit code",
          duration: 3000,
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to verify OTP";
      setError(errorMessage);
      toast({
        title: "Verification Failed",
        description: errorMessage,
        duration: 3000,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionReceipt = (transactionId: string) => {
    // In a real app, you would fetch the receipt from the API
    // Here we return mock data for the receipt

    return {
      id: transactionId,
      date: new Date().toISOString(),
      farmerName: "Gladys Kivuva",
      farmerId: "12345678",
      agrodealerName: "Harrison Kungs",
      merchantId: "POS1123535",
      amount: 1400,
      items: [
        {
          name: "NPK 50kg",
          quantity: 1,
          price: 1000,
          total: 1000,
          deduction: 800,
        },
        {
          name: "Green Grams",
          quantity: 2,
          price: 400,
          total: 800,
          deduction: 600,
        },
      ],
      total: 1800,
      deduction: 1400,
      wallet: "Muranga Kilimo",
      referenceNumber: "MAAB3D27ED21",
    };
  };

  return {
    processTransaction,
    verifyOtp,
    getTransactionReceipt,
    isLoading,
    error,
    transactionId,
  };
};
