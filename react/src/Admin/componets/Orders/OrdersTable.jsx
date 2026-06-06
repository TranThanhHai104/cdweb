import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useEffect, useState } from "react";
import api from "../../../config/api";

const currency = (value) => `${Number(value || 0).toLocaleString("vi-VN")} VND`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

const statusColor = (status) => {
  if (status === "DELIVERED") return "success";
  if (status === "SHIPPED") return "info";
  if (status === "CONFIRMED") return "secondary";
  if (status === "CANCELLED" || status === "CANCLED") return "error";
  return "default";
};

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/admin/orders/", {
        headers: getAuthHeaders(),
      });
      setOrders(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, action) => {
    setLoading(true);
    setError("");
    try {
      await api.put(`/api/admin/orders/${orderId}/${action}`, null, {
        headers: getAuthHeaders(),
      });
      await fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const deleteOrder = async (order) => {
    const ok = window.confirm(`Delete order #${order.id}?`);
    if (!ok) return;
    setLoading(true);
    setError("");
    try {
      await api.delete(`/api/admin/orders/${order.id}/delete`, {
        headers: getAuthHeaders(),
      });
      await fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

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
                Order management
              </Typography>
              <Typography variant="h4" fontWeight={900}>
                Orders
              </Typography>
              <Typography color="text.secondary">
                Confirm, ship, deliver, cancel, or delete customer orders.
              </Typography>
            </Box>
            <Chip
              label={`${orders.length} orders`}
              sx={{ height: 48, borderRadius: 0, px: 2 }}
            />
          </Stack>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 0 }}>
        <CardContent>
          <TableContainer>
            <Table sx={{ minWidth: 980 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Products</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => {
                  const orderItems = order.orderItems || [];

                  return (
                    <TableRow hover key={order.id}>
                      <TableCell>
                        <Typography fontWeight={900}>#{order.id}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.createdAt || order.orderDate || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <AvatarGroup max={4}>
                            {orderItems.map((item, index) => (
                              <Avatar
                                key={`${order.id}-${index}`}
                                src={item.product?.imageUrl || ""}
                                alt={item.product?.title || "Product"}
                                variant="rounded"
                                sx={{ borderRadius: 0 }}
                              />
                            ))}
                          </AvatarGroup>
                          <Box>
                            <Typography fontWeight={800}>
                              {orderItems
                                .map((item) => item.product?.title || "Deleted product")
                                .join(", ") || "No products"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {orderItems.length} item lines
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={800}>
                          {order.user?.firstName || ""} {order.user?.lastName || ""}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.user?.email || "Guest customer"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {currency(order.totalDiscountedPrice || order.totalPrice)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.orderStatus || "PENDING"}
                          color={statusColor(order.orderStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          justifyContent="flex-end"
                          spacing={0.5}
                          flexWrap="wrap"
                        >
                          <Button
                            size="small"
                            startIcon={<TaskAltOutlinedIcon />}
                            disabled={loading || order.orderStatus === "CONFIRMED"}
                            onClick={() => updateStatus(order.id, "confirmed")}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="small"
                            startIcon={<LocalShippingOutlinedIcon />}
                            disabled={loading || order.orderStatus === "SHIPPED"}
                            onClick={() => updateStatus(order.id, "ship")}
                          >
                            Ship
                          </Button>
                          <Button
                            size="small"
                            startIcon={<DoneAllOutlinedIcon />}
                            disabled={loading || order.orderStatus === "DELIVERED"}
                            onClick={() => updateStatus(order.id, "deliver")}
                          >
                            Deliver
                          </Button>
                          <Button
                            size="small"
                            color="warning"
                            startIcon={<CancelOutlinedIcon />}
                            disabled={loading}
                            onClick={() => updateStatus(order.id, "cancel")}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            disabled={loading}
                            onClick={() => deleteOrder(order)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {!loading && orders.length === 0 && (
            <Typography color="text.secondary" textAlign="center" py={5}>
              No orders yet.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrdersTable;
