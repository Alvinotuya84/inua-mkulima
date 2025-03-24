import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";

// Shadcn UI components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Material icons
import DownloadIcon from "@mui/icons-material/Download";
import BarChartIcon from "@mui/icons-material/BarChart";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { toast } from "@/hooks/use-toast";

// Mock report data
const MOCK_MONTHLY_REPORT = {
  month: "March 2025",
  totalTransactions: 45,
  totalAmount: 87500,
  productCategories: [
    { name: "Fertilizers", amount: 32500, percentage: 37.1 },
    { name: "Seeds", amount: 24800, percentage: 28.3 },
    { name: "Pesticides", amount: 18700, percentage: 21.4 },
    { name: "Tools", amount: 6800, percentage: 7.8 },
    { name: "Other", amount: 4700, percentage: 5.4 },
  ],
  topProducts: [
    { name: "NPK Fertilizer 50kg", quantity: 85, amount: 21250 },
    { name: "Hybrid Maize Seeds 2kg", quantity: 62, amount: 18600 },
    { name: "Pesticide Spray 1L", quantity: 39, amount: 15600 },
    { name: "CAN Fertilizer 50kg", quantity: 45, amount: 11250 },
    { name: "Garden Tools Set", quantity: 17, amount: 6800 },
  ],
  dailyTransactions: [
    { date: "2025-03-01", count: 2, amount: 3200 },
    { date: "2025-03-02", count: 1, amount: 1500 },
    { date: "2025-03-03", count: 3, amount: 4500 },
    // Additional data entries omitted for brevity
  ],
};

// Custom tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
      style={{ paddingTop: 20 }}
    >
      {value === index && children}
    </div>
  );
}

// Date picker component using Shadcn UI
function DatePickerWithPreview({ date, setDate, label }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{label || "Pick a date"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

const Reports = () => {
  const [tabValue, setTabValue] = useState(0);
  const [reportType, setReportType] = useState("monthly");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("March 2025");
  const [selectedYear, setSelectedYear] = useState("2025");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleReportTypeChange = (value) => {
    setReportType(value);
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: `${
        reportType.charAt(0).toUpperCase() + reportType.slice(1)
      } report has been generated successfully.`,
      duration: 3000,
      variant: "default",
    });
  };

  const handleDownloadReport = (format) => {
    toast({
      title: "Report Downloaded",
      description: `Report has been downloaded as ${format.toUpperCase()} file.`,
      duration: 3000,
      variant: "default",
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Reports
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="reports tabs"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: "medium",
              },
            }}
          >
            <Tab label="Report Generator" />
            <Tab label="Saved Reports" />
            <Tab label="Dashboard" />
          </Tabs>
        </Box>

        {/* Report Generator Panel */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <div className="mb-4">
                <label className="text-sm text-gray-700 mb-1 block">
                  Report Type
                </label>
                <Select
                  onValueChange={handleReportTypeChange}
                  defaultValue={reportType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Report</SelectItem>
                    <SelectItem value="weekly">Weekly Report</SelectItem>
                    <SelectItem value="monthly">Monthly Report</SelectItem>
                    <SelectItem value="quarterly">Quarterly Report</SelectItem>
                    <SelectItem value="annual">Annual Report</SelectItem>
                    <SelectItem value="custom">Custom Date Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Grid>

            {reportType === "monthly" && (
              <Grid item xs={12} md={4}>
                <div className="mb-4">
                  <label className="text-sm text-gray-700 mb-1 block">
                    Month
                  </label>
                  <Select
                    onValueChange={setSelectedMonth}
                    defaultValue={selectedMonth}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="January 2025">January 2025</SelectItem>
                      <SelectItem value="February 2025">
                        February 2025
                      </SelectItem>
                      <SelectItem value="March 2025">March 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Grid>
            )}

            {reportType === "annual" && (
              <Grid item xs={12} md={4}>
                <div className="mb-4">
                  <label className="text-sm text-gray-700 mb-1 block">
                    Year
                  </label>
                  <Select
                    onValueChange={setSelectedYear}
                    defaultValue={selectedYear}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Grid>
            )}

            {reportType === "custom" && (
              <>
                <Grid item xs={12} md={4}>
                  <div className="mb-4">
                    <label className="text-sm text-gray-700 mb-1 block">
                      Start Date
                    </label>
                    <DatePickerWithPreview
                      date={startDate}
                      setDate={setStartDate}
                      label="Select start date"
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={4}>
                  <div className="mb-4">
                    <label className="text-sm text-gray-700 mb-1 block">
                      End Date
                    </label>
                    <DatePickerWithPreview
                      date={endDate}
                      setDate={setEndDate}
                      label="Select end date"
                    />
                  </div>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button
                onClick={handleGenerateReport}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <BarChartIcon className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Saved Reports Panel */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Report Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date Range</TableCell>
                  <TableCell>Generated On</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>March 2025 Monthly Summary</TableCell>
                  <TableCell>Monthly</TableCell>
                  <TableCell>Mar 1 - Mar 31, 2025</TableCell>
                  <TableCell>Mar 31, 2025</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleDownloadReport("pdf")}
                      >
                        <FileDownloadIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <PrintIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <ShareIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Q1 2025 Quarterly Report</TableCell>
                  <TableCell>Quarterly</TableCell>
                  <TableCell>Jan 1 - Mar 31, 2025</TableCell>
                  <TableCell>Mar 31, 2025</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleDownloadReport("pdf")}
                      >
                        <FileDownloadIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <PrintIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <ShareIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Dashboard Panel */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {MOCK_MONTHLY_REPORT.month} Performance Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: "#f5f5f5" }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Transactions
                    </Typography>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: "bold", my: 1 }}
                    >
                      {MOCK_MONTHLY_REPORT.totalTransactions}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      +12% from last month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: "#f5f5f5" }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Subsidy Amount
                    </Typography>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: "bold", my: 1 }}
                    >
                      KES {MOCK_MONTHLY_REPORT.totalAmount.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      +8.5% from last month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: "#f5f5f5" }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Average Transaction Value
                    </Typography>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: "bold", my: 1 }}
                    >
                      KES{" "}
                      {Math.round(
                        MOCK_MONTHLY_REPORT.totalAmount /
                          MOCK_MONTHLY_REPORT.totalTransactions
                      ).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="error.main">
                      -3.2% from last month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Product Category Breakdown
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Amount (KES)</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MOCK_MONTHLY_REPORT.productCategories.map((category) => (
                    <TableRow key={category.name}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell align="right">
                        {category.amount.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {category.percentage}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="h6" gutterBottom>
              Top Products
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Amount (KES)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MOCK_MONTHLY_REPORT.topProducts.map((product) => (
                    <TableRow key={product.name}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell align="right">{product.quantity}</TableCell>
                      <TableCell align="right">
                        {product.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outline"
              onClick={() => handleDownloadReport("excel")}
              className="mr-2"
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download Excel
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDownloadReport("pdf")}
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Reports;
