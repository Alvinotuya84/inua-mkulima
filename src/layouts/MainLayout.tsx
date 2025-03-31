import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "@/hooks/use-auth";
import useUserStore from "@/stores/user.stores";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = useUserStore((state) => state.user);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    logout();
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{ bgcolor: "#355E3B", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inua Mkulima Subsidy Program
          </Typography>

          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.name || "KIMATHI"}
          </Typography>

          <Button
            color="inherit"
            startIcon={<ExitToAppIcon />}
            onClick={handleLogoutClick}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: 240,
          flexShrink: 0,
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem onClick={() => handleNavigation("/dashboard")}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem onClick={() => handleNavigation("/products")}>
              <ListItemIcon>
                <ShoppingBasketIcon />
              </ListItemIcon>
              <ListItemText primary="Products" />
            </ListItem>

            <ListItem onClick={() => handleNavigation("/transactions")}>
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary="Transactions" />
            </ListItem>

            <ListItem onClick={() => handleNavigation("/reports")}>
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem onClick={handleLogoutClick}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem onClick={() => handleNavigation("/dashboard")}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem onClick={() => handleNavigation("/products")}>
              <ListItemIcon>
                <ShoppingBasketIcon />
              </ListItemIcon>
              <ListItemText primary="Products" />
            </ListItem>

            <ListItem onClick={() => handleNavigation("/transactions")}>
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary="Transactions" />
            </ListItem>

            <ListItem onClick={() => handleNavigation("/reports")}>
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>

      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
      >
        <DialogTitle id="logout-dialog-title">
          Log Out?
          <IconButton
            aria-label="close"
            onClick={handleLogoutCancel}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 2,
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                border: "1px solid #ccc",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <ExitToAppIcon sx={{ fontSize: 30, color: "#666" }} />
            </Box>
            <Typography variant="body1">
              Are you sure you want to log out?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 3 }}>
          <Button
            onClick={handleLogoutCancel}
            variant="outlined"
            sx={{ minWidth: 120 }}
          >
            Back
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            sx={{
              minWidth: 120,
              bgcolor: "black",
              "&:hover": {
                bgcolor: "#333",
              },
            }}
          >
            Yes, log out
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainLayout;
