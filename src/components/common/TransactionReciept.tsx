import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Divider,
  Button,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
  deduction: number;
}

interface TransactionReceiptProps {
  receiptData: {
    id: string;
    date: string;
    referenceNumber: string;
    farmerName: string;
    farmerId: string;
    farmerPhone?: string;
    agrodealerName: string;
    merchantId: string;
    merchantPhone?: string;
    wallet: string;
    items: ReceiptItem[];
    total: number;
    deduction: number;
  };
  onDownload?: () => void;
}

const TransactionReceipt: React.FC<TransactionReceiptProps> = ({
  receiptData,
  onDownload,
}) => {
  const formattedDate = new Date(receiptData.date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Paper
      elevation={3}
      sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, md: 4 } }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ bgcolor: "#355E3B", color: "white", py: 2, mb: 3 }}
        >
          Transaction Receipt
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <img
              src="/bank-logo.png"
              alt="Bank Logo"
              style={{ height: 40, width: "auto" }}
            />
            <img
              src="/county-logo.png"
              alt="County Logo"
              style={{ height: 40, width: "auto" }}
            />
          </Box>
        </Box>

        <Typography variant="body2" sx={{ textAlign: "right", mb: 2 }}>
          PAGE 1 OF 1
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" component="div" sx={{ mb: 0.5 }}>
            <strong>Date:</strong> {formattedDate}
          </Typography>
          <Typography variant="body2" component="div" sx={{ mb: 0.5 }}>
            <strong>Reference Number:</strong> {receiptData.referenceNumber}
          </Typography>
          <Typography variant="body2" component="div" sx={{ mb: 0.5 }}>
            <strong>Wallet:</strong> {receiptData.wallet}
          </Typography>
          <Typography variant="body2" component="div" sx={{ mb: 0.5 }}>
            <strong>Farmer Name/ID:</strong> {receiptData.farmerName} -{" "}
            {receiptData.farmerId}
          </Typography>
          <Typography variant="body2" component="div" sx={{ mb: 0.5 }}>
            <strong>Farmer Phone No:</strong> {receiptData.farmerPhone || ""}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" component="div" sx={{ mb: 0.5 }}>
            <strong>Agro-dealer Name:</strong> {receiptData.agrodealerName}
          </Typography>
          <Typography variant="body2" component="div" sx={{ mb: 0.5 }}>
            <strong>Merchant ID:</strong> {receiptData.merchantId}
          </Typography>
          <Typography variant="body2" component="div" sx={{ mb: 0.5 }}>
            <strong>Phone Number:</strong> {receiptData.merchantPhone || ""}
          </Typography>
        </Grid>
      </Grid>

      <TableContainer sx={{ mb: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Product Code</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell align="right">Deduction</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receiptData.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell align="right">{item.price.toFixed(2)}</TableCell>
                <TableCell align="right">{item.total.toFixed(2)}</TableCell>
                <TableCell align="right">{item.deduction.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} sx={{ border: "none" }} />
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                TOTAL
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {receiptData.deduction.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="body1">Thank you for baking with us.</Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mt: 4 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic" }}
        >
          <strong>Note:</strong> This document is computer generated and
          therefore not signed.
        </Typography>
      </Box>

      {onDownload && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={onDownload}
            sx={{
              bgcolor: "#355E3B",
              "&:hover": {
                bgcolor: "#2A4A30",
              },
            }}
          >
            Download Receipt
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default TransactionReceipt;
