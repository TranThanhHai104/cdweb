import { Box, Grid, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import AdjustIcon from "@mui/icons-material/Adjust";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import StarIcon from "@mui/icons-material/Star";
import { cancelOrder } from "../../../Redux/Customers/Order/Action";

const statusConfig = {
  PENDING:    { label: "Chờ xử lý",   color: "default",  Icon: HourglassEmptyIcon },
  PLACED:     { label: "Chờ xử lý",   color: "default",  Icon: HourglassEmptyIcon },
  CONFIRMED:  { label: "Đã xác nhận", color: "primary",  Icon: AdjustIcon },
  SHIPPED:    { label: "Đang giao",   color: "warning",  Icon: LocalShippingOutlinedIcon },
  DELIVERED:  { label: "Đã giao",     color: "success",  Icon: CheckCircleOutlineIcon },
  CANCELLED:  { label: "Đã hủy",      color: "error",    Icon: CancelOutlinedIcon },
};

// Statuses where cancel is still allowed
const CANCELLABLE_STATUSES = ["PENDING", "PLACED", "CONFIRMED"];

const OrderCard = ({ item, order }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currency = (value) => `${Number(value || 0).toLocaleString("vi-VN")} VND`;

  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const status = order.orderStatus || "PENDING";
  const cfg = statusConfig[status] || statusConfig["PENDING"];
  const StatusIcon = cfg.Icon;

  const canCancel = CANCELLABLE_STATUSES.includes(status);
  const canReview = status === "DELIVERED";

  const handleCancelConfirm = async () => {
    setCancelling(true);
    setCancelError("");
    const ok = await dispatch(cancelOrder(order.id));
    setCancelling(false);
    if (ok) {
      setCancelOpen(false);
    } else {
      setCancelError("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
    }
  };

  return (
    <>
      <Box className="p-5 shadow-md hover:shadow-xl border rounded-md bg-white transition-shadow">
        <Grid spacing={2} container sx={{ justifyContent: "space-between", alignItems: "center" }}>
          {/* Sản phẩm */}
          <Grid item xs={12} sm={6}>
            <div onClick={() => navigate(`/account/order/${order?.id}`)} className="flex cursor-pointer">
              <img
                className="w-[5rem] h-[5rem] object-cover object-top rounded"
                src={item?.product?.imageUrl}
                alt={item?.product?.title}
              />
              <div className="ml-4">
                <p className="font-medium mb-1">{item?.product?.title}</p>
                <p className="opacity-50 text-xs font-semibold space-x-3">
                  <span>Size: {item?.size}</span>
                  <span>SL: {item?.quantity}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">{item?.product?.brand}</p>
              </div>
            </div>
          </Grid>

          {/* Giá */}
          <Grid item xs={6} sm={2}>
            <p className="font-semibold text-sm">{currency(item?.price)}</p>
          </Grid>

          {/* Trạng thái + hành động */}
          <Grid item xs={6} sm={4}>
            <div className="flex items-center gap-2 flex-wrap">
              <Chip
                icon={<StatusIcon style={{ fontSize: 16 }} />}
                label={cfg.label}
                color={cfg.color}
                size="small"
                variant="outlined"
              />
            </div>

            {/* Chỉ hiện "Đánh giá" khi đã giao */}
            {canReview && (
              <div
                onClick={() => navigate(`/account/rate/${item?.product?.id}`)}
                className="flex items-center text-blue-600 cursor-pointer mt-2 hover:underline"
              >
                <StarIcon sx={{ fontSize: "1.2rem" }} className="mr-1" />
                <span className="text-xs">Đánh giá sản phẩm</span>
              </div>
            )}

            {/* Nút hủy đơn khi chưa giao */}
            {canCancel && (
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => setCancelOpen(true)}
                sx={{ mt: 1, textTransform: "none", fontSize: 11, px: 1.5, py: 0.5 }}
              >
                Hủy đơn hàng
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Dialog xác nhận hủy */}
      <Dialog open={cancelOpen} onClose={() => !cancelling && setCancelOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Xác nhận hủy đơn hàng?</DialogTitle>
        <DialogContent>
          <p className="text-sm text-gray-600">
            Đơn hàng <strong>#{order?.id}</strong> sẽ bị hủy. Bạn có chắc chắn không?
          </p>
          {cancelError && (
            <p className="mt-2 text-xs text-red-600 bg-red-50 rounded p-2">{cancelError}</p>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCancelOpen(false)} color="inherit" disabled={cancelling}>
            Không
          </Button>
          <Button onClick={handleCancelConfirm} color="error" variant="contained" disabled={cancelling}>
            {cancelling ? <CircularProgress size={18} color="inherit" /> : "Hủy đơn"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderCard;
