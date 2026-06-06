import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import StorefrontIcon from "@mui/icons-material/Storefront";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { customTheme } from "./them/customeThem";
import AdminNavbar from "./Navigation/AdminNavbar";
import Dashboard from "./Views/Admin";
import DemoAdmin from "./Views/DemoAdmin";
import CreateProductForm from "./componets/createProduct/CreateProductFrom";
import ProductsTable from "./componets/Products/ProductsTable";
import OrdersTable from "./componets/Orders/OrdersTable";
import Customers from "./componets/customers/customers";
import UpdateProductForm from "./componets/updateProduct/UpdateProduct";
import "./AdminPannel.css";

const drawerWidth = 260;

const menu = [
  { name: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
  { name: "Products", path: "/admin/products", icon: <Inventory2Icon /> },
  { name: "Customers", path: "/admin/customers", icon: <PeopleAltIcon /> },
  { name: "Orders", path: "/admin/orders", icon: <ReceiptLongIcon /> },
];

export default function AdminPannel() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [sideBarVisible, setSideBarVisible] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    setSideBarVisible(false);
  };

  const drawer = (
    <Box sx={{ display: "flex", minHeight: "100%", flexDirection: "column" }}>
      {isLargeScreen && <Toolbar sx={{ minHeight: 72 }} />}

      <Box sx={{ p: 2.5 }}>
        <Box
          sx={{
            border: "1px solid #eadfd1",
            bgcolor: "#fff",
            p: 2,
          }}
        >
          <StorefrontIcon sx={{ color: "#a24d24" }} />
          <Typography mt={1} fontWeight={900}>
            Store manager
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quan ly san pham, khach hang va don hang dang chay tren web.
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 1.5 }}>
        {menu.map((item) => {
          const active =
            item.path === "/admin"
              ? location.pathname === "/admin" || location.pathname === "/admin/"
              : location.pathname.startsWith(item.path);

          return (
            <ListItem key={item.name} disablePadding sx={{ mb: 0.75 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 0,
                  border: "1px solid",
                  borderColor: active ? "#171717" : "transparent",
                  bgcolor: active ? "#171717" : "transparent",
                  color: active ? "#fff" : "#3f3a35",
                  "&:hover": {
                    bgcolor: active ? "#171717" : "#fff",
                    borderColor: active ? "#171717" : "#eadfd1",
                  },
                }}
              >
                <ListItemIcon
                  sx={{ minWidth: 42, color: active ? "#f0c7a5" : "#a24d24" }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2.5 }}>
        <Typography variant="caption" color="text.secondary">
          LUMINA Fashion Studio admin panel
        </Typography>
      </Box>
    </Box>
  );

  const drawerVariant = isLargeScreen ? "permanent" : "temporary";

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: isLargeScreen ? "flex" : "block" }}>
        <CssBaseline />
        <AdminNavbar handleSideBarViewInMobile={() => setSideBarVisible(true)} />

        <Drawer
          variant={drawerVariant}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "#fbf8f4",
              borderRight: "1px solid #eadfd1",
            },
          }}
          open={isLargeScreen || sideBarVisible}
          onClose={() => setSideBarVisible(false)}
        >
          {drawer}
        </Drawer>

        <Box className="adminContainer" component="main" sx={{ flexGrow: 1 }}>
          <Toolbar sx={{ minHeight: 72 }} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/product/create" element={<CreateProductForm />} />
            <Route path="/product/update/:productId" element={<UpdateProductForm />} />
            <Route path="/products" element={<ProductsTable />} />
            <Route path="/orders" element={<OrdersTable />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/demo" element={<DemoAdmin />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
