import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";

const currency = (value) => `${Number(value || 0).toLocaleString("vi-VN")} VND`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

const statCards = [
  {
    key: "products",
    label: "Products",
    helper: "Live items in catalog",
    icon: <Inventory2OutlinedIcon />,
  },
  {
    key: "customers",
    label: "Customers",
    helper: "Registered accounts",
    icon: <PeopleAltOutlinedIcon />,
  },
  {
    key: "orders",
    label: "Orders",
    helper: "All checkout records",
    icon: <ReceiptLongOutlinedIcon />,
  },
  {
    key: "revenue",
    label: "Revenue",
    helper: "Total order value",
    icon: <TrendingUpOutlinedIcon />,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const headers = getAuthHeaders();
        const [productsResult, customersResult, ordersResult] =
          await Promise.allSettled([
            api.get("/api/admin/products/all", { headers }),
            api.get("/api/admin/users", { headers }),
            api.get("/api/admin/orders/", { headers }),
          ]);

        if (productsResult.status === "fulfilled") {
          setProducts(productsResult.value.data || []);
        }
        if (customersResult.status === "fulfilled") {
          setCustomers(customersResult.value.data || []);
        }
        if (ordersResult.status === "fulfilled") {
          setOrders(ordersResult.value.data || []);
        }

        const failed = [productsResult, customersResult, ordersResult].find(
          (item) => item.status === "rejected"
        );
        if (failed) {
          setError(failed.reason?.response?.data?.message || failed.reason?.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const revenue = useMemo(
    () =>
      orders.reduce(
        (total, order) =>
          total + Number(order.totalDiscountedPrice || order.totalPrice || 0),
        0
      ),
    [orders]
  );

  const stats = {
    products: products.length,
    customers: customers.length,
    orders: orders.length,
    revenue: currency(revenue),
  };

  const recentProducts = products.slice(0, 6);
  const recentOrders = orders.slice(0, 6);

  return (
    <Box>
      <Card sx={{ borderRadius: 0, mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="overline" color="text.secondary">
                Admin dashboard
              </Typography>
              <Typography variant="h4" fontWeight={900}>
                Store overview
              </Typography>
              <Typography color="text.secondary">
                Real data from products, customers, and orders APIs.
              </Typography>
            </Box>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                variant="contained"
                onClick={() => navigate("/admin/products")}
                sx={{ borderRadius: 0, bgcolor: "#171717" }}
              >
                Manage Products
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/customers")}
                sx={{ borderRadius: 0, borderColor: "#171717", color: "#171717" }}
              >
                Manage Customers
              </Button>
            </Stack>
          </Stack>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        {statCards.map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item.key}>
            <Card sx={{ height: "100%", borderRadius: 0 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography color="text.secondary">{item.label}</Typography>
                    <Typography mt={1} variant="h4" fontWeight={900}>
                      {loading ? "..." : stats[item.key]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.helper}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "grid",
                      width: 46,
                      height: 46,
                      placeItems: "center",
                      bgcolor: "#f0c7a5",
                      color: "#171717",
                    }}
                  >
                    {item.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} lg={7}>
          <Card sx={{ borderRadius: 0, height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Box>
                  <Typography variant="h6" fontWeight={900}>
                    Recent products
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Items currently shown in the storefront.
                  </Typography>
                </Box>
                <Button onClick={() => navigate("/admin/products")}>View all</Button>
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentProducts.map((product) => (
                      <TableRow key={product.id} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar
                              src={product.imageUrl}
                              variant="rounded"
                              sx={{ width: 48, height: 64, borderRadius: 0 }}
                            />
                            <Box>
                              <Typography fontWeight={800}>
                                {product.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {product.brand}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{currency(product.discountedPrice)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {!loading && recentProducts.length === 0 && (
                <Typography color="text.secondary" textAlign="center" py={5}>
                  No products yet. Add the first product from Products.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ borderRadius: 0, height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Box>
                  <Typography variant="h6" fontWeight={900}>
                    Recent orders
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latest customer checkout activity.
                  </Typography>
                </Box>
                <Button onClick={() => navigate("/admin/orders")}>View all</Button>
              </Stack>

              <Stack spacing={1.5}>
                {recentOrders.map((order) => (
                  <Box
                    key={order.id}
                    sx={{
                      border: "1px solid #eadfd1",
                      bgcolor: "#fff",
                      p: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={2}
                    >
                      <Box>
                        <Typography fontWeight={900}>Order #{order.id}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.user?.email || "Guest customer"}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={order.orderStatus || "PENDING"}
                        color={order.orderStatus === "DELIVERED" ? "success" : "default"}
                      />
                    </Stack>
                    <Typography mt={1} fontWeight={800}>
                      {currency(order.totalDiscountedPrice || order.totalPrice)}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              {!loading && recentOrders.length === 0 && (
                <Typography color="text.secondary" textAlign="center" py={5}>
                  No orders yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
