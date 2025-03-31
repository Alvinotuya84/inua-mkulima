import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAuth } from "@/hooks/use-auth";
import useUserStore from "@/stores/user.stores";

// Mock transaction data (would come from API in real app)
const MOCK_TRANSACTIONS = [
  {
    id: "TRAN123456",
    date: "2025-03-22T10:30:00Z",
    farmerName: "John Kamau",
    farmerId: "98765432",
    amount: 2200,
    status: "completed",
  },
  {
    id: "TRAN123455",
    date: "2025-03-20T14:15:00Z",
    farmerName: "Sarah Wanjiku",
    farmerId: "87654321",
    amount: 1800,
    status: "completed",
  },
  {
    id: "TRAN123454",
    date: "2025-03-18T09:45:00Z",
    farmerName: "David Mwangi",
    farmerId: "76543210",
    amount: 3500,
    status: "completed",
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = useUserStore((state) => state.user);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [walletBalance, setWalletBalance] = useState(2400);

  const handleNewTransaction = () => {
    navigate("/products");
  };

  const handleViewTransactions = () => {
    navigate("/transactions");
  };

  const handleViewReports = () => {
    navigate("/reports");
  };

  const handleViewReceiptDetails = (transactionId: string) => {
    navigate(`/receipt/${transactionId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 4,
          p: 3,
          bgcolor: "#355E3B",
          color: "white",
          borderRadius: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Inua Mkulima Subsidy Program
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Logged In As: <strong>{user?.name || "KIMATHI"}</strong>
          </Typography>

          <Button
            variant="outlined"
            onClick={logout}
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <List component="nav" aria-label="main navigation">
              <ListItem
                button
                selected
                sx={{ bgcolor: "#f0f0f0", borderLeft: "4px solid #E0B643" }}
              >
                <ListItemText primary="Dashboard" />
              </ListItem>

              <Divider sx={{ my: 1 }} />

              <ListItem button onClick={handleViewTransactions}>
                <ListItemText primary="Transactions" />
              </ListItem>

              <Divider sx={{ my: 1 }} />

              <ListItem button onClick={handleViewReports}>
                <ListItemText primary="Reports" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Dashboard
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: "#f5f5f5" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <ReceiptIcon sx={{ mr: 1, color: "#355E3B" }} />
                      <Typography variant="h6" component="div">
                        Recent Transactions
                      </Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: "bold", mb: 2 }}
                    >
                      {transactions.length}
                    </Typography>
                    <Button
                      variant="text"
                      endIcon={<ArrowForwardIcon />}
                      onClick={handleViewTransactions}
                      sx={{ color: "#355E3B" }}
                    >
                      View all
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: "#f5f5f5" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <InventoryIcon sx={{ mr: 1, color: "#E0B643" }} />
                      <Typography variant="h6" component="div">
                        Wallet Balance
                      </Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: "bold", mb: 2 }}
                    >
                      KES {walletBalance.toFixed(2)}
                    </Typography>
                    <Button
                      variant="text"
                      endIcon={<ArrowForwardIcon />}
                      onClick={handleNewTransaction}
                      sx={{ color: "#E0B643" }}
                    >
                      New Transaction
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: "#f5f5f5" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <AssessmentIcon sx={{ mr: 1, color: "#1976d2" }} />
                      <Typography variant="h6" component="div">
                        Monthly Reports
                      </Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: "bold", mb: 2 }}
                    >
                      2
                    </Typography>
                    <Button
                      variant="text"
                      endIcon={<ArrowForwardIcon />}
                      onClick={handleViewReports}
                      sx={{ color: "#1976d2" }}
                    >
                      View reports
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Recent Transactions
              </Typography>

              <Button
                variant="contained"
                onClick={handleNewTransaction}
                sx={{
                  bgcolor: "#E0B643",
                  "&:hover": {
                    bgcolor: "#C9A43B",
                  },
                }}
              >
                New Transaction
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Farmer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{transaction.farmerName}</TableCell>
                      <TableCell align="right">
                        KES {transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          component="span"
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor:
                              transaction.status === "completed"
                                ? "#e6f7e6"
                                : "#fff3e0",
                            color:
                              transaction.status === "completed"
                                ? "#2e7d32"
                                : "#ed6c02",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          {transaction.status}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            handleViewReceiptDetails(transaction.id)
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
