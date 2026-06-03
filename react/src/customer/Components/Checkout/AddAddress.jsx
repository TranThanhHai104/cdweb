import React, { useEffect, useState } from "react";
import {
  Grid, TextField, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, Tooltip, CircularProgress,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../../Redux/Customers/Order/Action";
import { deleteAddress, getUser, updateAddress } from "../../../Redux/Auth/Action";

const emptyForm = { firstName:"", lastName:"", streetAddress:"", city:"", state:"", zipCode:"", mobile:"" };

export default function AddDeliveryAddressForm() {
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const jwt        = localStorage.getItem("jwt");
  const { auth }   = useSelector((s) => s);

  const [selected,   setSelected]   = useState(null);
  const [showForm,   setShowForm]   = useState(false);
  const [form,       setForm]       = useState(emptyForm);
  const [loading,    setLoading]    = useState(false);
  const [addressError, setAddressError] = useState("");
  const [editOpen,   setEditOpen]   = useState(false);
  const [editId,     setEditId]     = useState(null);
  const [editForm,   setEditForm]   = useState(emptyForm);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId,   setDeleteId]   = useState(null);
  const [deleting,   setDeleting]   = useState(false);

  const addresses = auth.user?.addresses || [];

  useEffect(() => {
    if (jwt) dispatch(getUser(jwt));
  }, [dispatch, jwt]);

  const goToPaymentStep = (createdOrder) => {
    const orderId = createdOrder?.id || createdOrder?.order?.id || createdOrder?.data?.id;
    setLoading(false);
    if (!orderId) {
      setAddressError("Không tạo được mã đơn hàng. Vui lòng thử lại.");
      return;
    }
    navigate(`/checkout?step=3&order_id=${orderId}`);
  };

  const handleCreateFailure = (message) => {
    setLoading(false);
    setAddressError(message || "Không thể tạo đơn hàng. Vui lòng thử lại.");
  };

  const handleDeliver = (addr) => {
    setLoading(true);
    setAddressError("");
    dispatch(createOrder({
      address: addr,
      jwt,
      onSuccess: goToPaymentStep,
      onError: handleCreateFailure,
    }));
  };

  const handleAddNew = (e) => {
    e.preventDefault();
    setLoading(true);
    setAddressError("");
    dispatch(createOrder({
      address: form,
      jwt,
      onSuccess: goToPaymentStep,
      onError: handleCreateFailure,
    }));
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const ok = await dispatch(deleteAddress(deleteId, jwt));
    if (selected?.id === deleteId) setSelected(null);
    if (!ok) setAddressError("Không xóa được địa chỉ. Vui lòng thử lại.");
    setDeleting(false);
    setDeleteOpen(false);
    setDeleteId(null);
  };

  const handleEditSave = async () => {
    const ok = await dispatch(updateAddress(editId, editForm, jwt));
    if (ok) {
      setEditOpen(false);
      return;
    }
    setAddressError("Không lưu được địa chỉ. Vui lòng thử lại.");
  };

  // Helper for new address form — defined OUTSIDE render to prevent remount on each keystroke
  const handleFormChange = (name) => (e) => setForm((p) => ({ ...p, [name]: e.target.value }));
  const handleEditChange = (name) => (e) => setEditForm((p) => ({ ...p, [name]: e.target.value }));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/cart")}
          variant="outlined"
          size="small"
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Quay lại giỏ hàng
        </Button>
        <h2 className="text-xl font-bold text-gray-800">Địa chỉ giao hàng</h2>
      </div>

      {addressError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {addressError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Danh sách địa chỉ đã lưu ── */}
        <div>
          {addresses.length > 0 && (
            <div className="space-y-3 mb-4">
              {addresses.map((addr) => {
                const isSelected = selected?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelected(addr)}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className="absolute top-3 right-3 flex gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Tooltip title="Sửa">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditId(addr.id);
                            setEditForm({
                              firstName: addr.firstName || "",
                              lastName: addr.lastName || "",
                              streetAddress: addr.streetAddress || "",
                              city: addr.city || "",
                              state: addr.state || "",
                              zipCode: addr.zipCode || "",
                              mobile: addr.mobile || "",
                            });
                            setEditOpen(true);
                          }}
                        >
                          <EditOutlinedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => { setDeleteId(addr.id); setDeleteOpen(true); }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </div>

                    <div className="flex items-start gap-3 pr-16">
                      <LocationOnOutlinedIcon
                        sx={{ color: isSelected ? "#6366f1" : "#9ca3af", mt: 0.3, fontSize: 20 }}
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {addr.firstName} {addr.lastName}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {addr.streetAddress}, {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                        <p className="text-gray-500 text-xs">📞 {addr.mobile}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <Button
                        fullWidth variant="contained"
                        disabled={loading}
                        onClick={(e) => { e.stopPropagation(); handleDeliver(addr); }}
                        sx={{ mt: 2, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                      >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Giao đến đây →"}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors"
          >
            <AddCircleOutlineIcon fontSize="small" />
            {showForm ? "Ẩn form" : "Thêm địa chỉ mới"}
          </button>
        </div>

        {/* ── Form thêm địa chỉ mới ── */}
        {(showForm || addresses.length === 0) && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">
              Địa chỉ mới
            </h3>
            <form onSubmit={handleAddNew}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField label="Họ" size="small" fullWidth required
                    value={form.firstName}
                    onChange={handleFormChange("firstName")} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Tên" size="small" fullWidth required
                    value={form.lastName}
                    onChange={handleFormChange("lastName")} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Địa chỉ" size="small" fullWidth required
                    multiline rows={2}
                    value={form.streetAddress}
                    onChange={handleFormChange("streetAddress")} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Thành phố" size="small" fullWidth required
                    value={form.city}
                    onChange={handleFormChange("city")} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Tỉnh / Quận" size="small" fullWidth required
                    value={form.state}
                    onChange={handleFormChange("state")} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Mã bưu điện" size="small" fullWidth required
                    value={form.zipCode}
                    onChange={handleFormChange("zipCode")} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Số điện thoại" size="small" fullWidth required
                    value={form.mobile}
                    onChange={handleFormChange("mobile")} />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit" fullWidth variant="contained"
                    disabled={loading}
                    sx={{ py: 1.4, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Dùng địa chỉ này →"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        )}
      </div>

      {/* ── Dialog xác nhận xóa ── */}
      <Dialog open={deleteOpen} onClose={() => !deleting && setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Xóa địa chỉ?</DialogTitle>
        <DialogContent>
          <p className="text-gray-600 text-sm">Địa chỉ này sẽ bị xóa vĩnh viễn.</p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteOpen(false)} color="inherit">Hủy</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Xóa</Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog sửa địa chỉ ── */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Sửa địa chỉ</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={6}>
              <TextField label="Họ" size="small" fullWidth
                value={editForm.firstName} onChange={handleEditChange("firstName")} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Tên" size="small" fullWidth
                value={editForm.lastName} onChange={handleEditChange("lastName")} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Địa chỉ" size="small" fullWidth multiline rows={2}
                value={editForm.streetAddress} onChange={handleEditChange("streetAddress")} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Thành phố" size="small" fullWidth
                value={editForm.city} onChange={handleEditChange("city")} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Tỉnh / Quận" size="small" fullWidth
                value={editForm.state} onChange={handleEditChange("state")} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Mã bưu điện" size="small" fullWidth
                value={editForm.zipCode} onChange={handleEditChange("zipCode")} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Số điện thoại" size="small" fullWidth
                value={editForm.mobile} onChange={handleEditChange("mobile")} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)} color="inherit">Hủy</Button>
          <Button onClick={handleEditSave} variant="contained">Lưu thay đổi</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
