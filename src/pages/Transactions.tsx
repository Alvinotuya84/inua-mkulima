import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  TablePagination,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// Mock transaction data
const MOCK_TRANSACTIONS = [
  {
    id: "ABAKFAH3913AF",
    date: "2025-03-22T10:30:00Z",
    farmerName: "Gladys Kivuva",
    farmerId: "12345678",
    amount: 1400,
    status: "completed",
  },
  {
    id: "MAAB3D27ED21",
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
  {
    id: "TRAN123453",
    date: "2025-03-15T16:20:00Z",
    farmerName: "James Odhiambo",
    farmerId: "65432109",
    amount: 2100,
    status: "completed",
  },
  {
    id: "TRAN123452",
    date: "2025-03-12T11:05:00Z",
    farmerName: "Lucy Njeri",
    farmerId: "54321098",
    amount: 1950,
    status: "completed",
  },
  {
    id: "TRAN123451",
    date: "2025-03-10T08:30:00Z",
    farmerName: "Peter Kamau",
    farmerId: "43210987",
    amount: 2700,
    status: "completed",
  },
  {
    id: "TRAN123450",
    date: "2025-03-07T13:45:00Z",
    farmerName: "Grace Atieno",
    farmerId: "32109876",
    amount: 1600,
    status: "completed",
  },
  {
    id: "TRAN123449",
    date: "2025-03-05T10:10:00Z",
    farmerName: "John Gitonga",
    farmerId: "21098765",
    amount: 3200,
    status: "completed",
  },
  {
    id: "TRAN123448",
    date: "2025-03-02T15:30:00Z",
    farmerName: "Mary Achieng",
    farmerId: "10987654",
    amount: 2450,
    status: "completed",
  },
  {
    id: "TRAN123447",
    date: "2025-02-28T09:20:00Z",
    farmerName: "Joseph Kiprop",
    farmerId: "09876543",
    amount: 1750,
    status: "completed",
  },
];

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [filteredTransactions, setFilteredTransactions] =
    useState(MOCK_TRANSACTIONS);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter transactions based on search query and status
  useEffect(() => {
    let filtered = transactions;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.id.toLowerCase().includes(query) ||
          transaction.farmerName.toLowerCase().includes(query) ||
          transaction.farmerId.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.status === statusFilter
      );
    }

    setFilteredTransactions(filtered);
    setPage(0); // Reset to first page when filters change
  }, [searchQuery, statusFilter, transactions]);

  const handleNewTransaction = () => {
    navigate("/product-details");
  };

  const handleViewReceipt = (transactionId: string) => {
    navigate(`/receipt/${transactionId}`);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Transactions
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            mb: 2,
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              flex: 1,
            }}
          >
            <TextField
              placeholder="Search by ID, farmer name, or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<CalendarTodayIcon />}
              sx={{ minWidth: { xs: "100%", sm: "auto" } }}
            >
              Date Range
            </Button>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewTransaction}
            sx={{
              bgcolor: "#E0B643",
              "&:hover": {
                bgcolor: "#C9A43B",
              },
              whiteSpace: "nowrap",
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
                <TableCell>Farmer ID</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{transaction.farmerName}</TableCell>
                    <TableCell>{transaction.farmerId}</TableCell>
                    <TableCell align="right">
                      KES {transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        component="span"
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor:
                            transaction.status === "completed"
                              ? "#e6f7e6"
                              : transaction.status === "pending"
                              ? "#fff3e0"
                              : "#ffebee",
                          color:
                            transaction.status === "completed"
                              ? "#2e7d32"
                              : transaction.status === "pending"
                              ? "#ed6c02"
                              : "#d32f2f",
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
                        onClick={() => handleViewReceipt(transaction.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="textSecondary">
                      No transactions found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredTransactions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </Box>
  );
};

export default Transactions;
