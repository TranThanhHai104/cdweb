import {
  Button, Divider, Grid, Rating, TextField, Typography, useMediaQuery,
  CircularProgress, Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useDispatch, useSelector } from "react-redux";
import { createReview } from "../../../Redux/Customers/Review/Action";
import { useNavigate, useParams } from "react-router-dom";
import { findProductById } from "../../../Redux/Customers/Product/Action";
import { getOrderHistory } from "../../../Redux/Customers/Order/Action";

const RateProduct = () => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width:1200px)");
  const dispatch = useDispatch();
  const { customersProduct, order } = useSelector((store) => store);
  const { productId } = useParams();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const currency = (value) => `${Number(value || 0).toLocaleString("vi-VN")} VND`;

  useEffect(() => {
    dispatch(findProductById({ productId }));
    dispatch(getOrderHistory({ jwt }));
  }, []);

  // Check if user has a DELIVERED order containing this product
  const hasDeliveredOrder = (order.orders || []).some(
    (ord) =>
      ord.orderStatus === "DELIVERED" &&
      (ord.orderItems || []).some((item) => String(item.product?.id) === String(productId))
  );

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!hasDeliveredOrder) return;
    dispatch(createReview({ review: formData.title, productId }));
    setSubmitted(true);
    setTimeout(() => navigate(`/product/${productId}`), 1500);
  };

  return (
    <div className="px-5 lg:px-20">
      <h1 className="text-xl p-5 shadow-lg mb-8 font-bold">Đánh giá sản phẩm</h1>

      <Grid sx={{ justifyContent: "space-between" }} container>
        <Grid className="flex lg:items-center shadow-lg border rounded-md p-5" item xs={12} lg={5.8}>
          <div>
            <img className="w-[5rem] lg:w-[15rem]" src={customersProduct.product?.imageUrl} alt="" />
          </div>
          <div className="ml-3 lg:ml-5 space-y-2 lg:space-y-4">
            <p className="lg:text-lg">{customersProduct.product?.title}</p>
            <p className="opacity-50 font-semibold">{customersProduct.product?.brand}</p>
            <p>{currency(customersProduct.product?.price)}</p>
            {customersProduct.product?.color && <p>Màu: {customersProduct.product?.color}</p>}
            <div className="flex items-center space-x-3">
              <Rating name="read-only" value={4.6} precision={0.5} readOnly />
            </div>
            {hasDeliveredOrder && (
              <div>
                <p className="space-y-2 font-semibold text-sm">
                  <FiberManualRecordIcon sx={{ width: "15px", height: "15px" }} className="text-green-600 mr-2" />
                  <span className="text-green-700">Đã giao thành công</span>
                </p>
                <p className="text-xs text-gray-500">Bạn có thể đánh giá sản phẩm này</p>
              </div>
            )}
          </div>
        </Grid>

        <Grid item xs={12} lg={6}>
          <div className={`${!isLargeScreen ? "py-10" : ""} space-y-5`}>
            {!hasDeliveredOrder ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
                <LockOutlinedIcon sx={{ fontSize: 40, color: "#d97706", mb: 1 }} />
                <p className="font-bold text-amber-800 text-base">Chưa thể đánh giá</p>
                <p className="text-sm text-amber-700 mt-2">
                  Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng đã được giao thành công.
                </p>
                <Button onClick={() => navigate("/account/order")}
                  variant="outlined" size="small" sx={{ mt: 3, textTransform: "none" }}>
                  Xem đơn hàng của tôi
                </Button>
              </div>
            ) : submitted ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                <CheckCircleOutlineIcon sx={{ fontSize: 40, color: "#16a34a", mb: 1 }} />
                <p className="font-bold text-green-800">Cảm ơn bạn đã đánh giá!</p>
                <p className="text-sm text-green-700 mt-1">Đang chuyển hướng về trang sản phẩm...</p>
              </div>
            ) : (
              <>
                <div className="shadow-md border rounded-md p-5">
                  <Typography className="font-semibold mb-2" component="legend">
                    Đánh giá của bạn
                  </Typography>
                  <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(event, newValue) => setRating(newValue)}
                    size="large"
                  />
                </div>
                <form onSubmit={handleSubmit} className="space-y-5 p-5 shadow-md border rounded-md">
                  <TextField
                    label="Tiêu đề đánh giá" variant="outlined" fullWidth margin="normal"
                    value={formData.title} onChange={handleChange} name="title" required
                  />
                  <TextField
                    label="Mô tả chi tiết" variant="outlined" fullWidth margin="normal"
                    multiline rows={4} value={formData.description}
                    onChange={handleChange} name="description"
                  />
                  <Button type="submit" variant="contained" color="primary" size="large">
                    Gửi đánh giá
                  </Button>
                </form>
              </>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default RateProduct;
