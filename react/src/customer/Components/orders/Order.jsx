import { Box, Grid, Chip } from "@mui/material";
import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import { useDispatch, useSelector } from "react-redux";
import { getOrderHistory } from "../../../Redux/Customers/Order/Action";

const orderStatus = [
  { label: "Chờ xử lý",  value: "PENDING"   },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Đang giao",   value: "SHIPPED"   },
  { label: "Đã giao",     value: "DELIVERED" },
  { label: "Đã hủy",      value: "CANCELLED" },
];

const Order = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { order } = useSelector((store) => store);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  useEffect(() => {
    dispatch(getOrderHistory({ jwt }));
  }, [jwt]);

  const toggleStatus = (value) => {
    setSelectedStatuses((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  // Lọc đơn hàng theo trạng thái được chọn
  const filteredOrders = (order.orders || []).filter((ord) => {
    if (selectedStatuses.length === 0) return true;
    return selectedStatuses.includes(ord.orderStatus);
  });

  return (
    <Box className="px-5 lg:px-10 py-6">
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>

        {/* Sidebar lọc */}
        <Grid item xs={12} lg={2.5}>
          <div className="shadow-lg bg-white border p-5 sticky top-5 rounded-md">
            <h1 className="font-bold text-lg mb-4">Bộ lọc</h1>
            <h2 className="font-semibold text-xs text-gray-500 mb-3 uppercase tracking-wide">
              Trạng thái đơn hàng
            </h2>
            <div className="space-y-3">
              {orderStatus.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleStatus(option.value)}
                >
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(option.value)}
                    onChange={() => toggleStatus(option.value)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label className="text-sm text-gray-600 cursor-pointer select-none">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>

            {selectedStatuses.length > 0 && (
              <button
                onClick={() => setSelectedStatuses([])}
                className="mt-4 text-xs text-indigo-600 hover:underline"
              >
                Xóa bộ lọc ({selectedStatuses.length})
              </button>
            )}
          </div>
        </Grid>

        {/* Danh sách đơn hàng */}
        <Grid item xs={12} lg={9}>
          {/* Chip hiển thị filter đang bật */}
          {selectedStatuses.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedStatuses.map((s) => {
                const label = orderStatus.find((o) => o.value === s)?.label || s;
                return (
                  <Chip
                    key={s}
                    label={label}
                    onDelete={() => toggleStatus(s)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                );
              })}
            </div>
          )}

          <Box className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((ord) =>
                (ord?.orderItems || []).map((item, index) => (
                  <OrderCard key={`${ord.id}-${index}`} item={item} order={ord} />
                ))
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg font-semibold text-gray-700">
                  {selectedStatuses.length > 0
                    ? "Không có đơn hàng nào với trạng thái đã chọn."
                    : "Bạn chưa có đơn hàng nào."}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {selectedStatuses.length > 0
                    ? "Thử chọn bộ lọc khác."
                    : "Hãy mua sắm để tạo đơn hàng đầu tiên!"}
                </p>
              </div>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Order;
