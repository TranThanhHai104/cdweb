import React, { useState, useEffect } from "react";
import {
  Avatar, Button, TextField, Grid, Divider, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
  IconButton, Tooltip, CircularProgress,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import { getUser, deleteAddress, updateAddress } from "../../../Redux/Auth/Action";
import { getOrderHistory } from "../../../Redux/Customers/Order/Action";

const currency = (v) => `${Number(v || 0).toLocaleString("vi-VN")} VND`;
const statusConfig = {
  PENDING:   { label: "Chờ xử lý",   color: "default" },
  PLACED:    { label: "Đã đặt",      color: "info"    },
  CONFIRMED: { label: "Đã xác nhận", color: "primary" },
  SHIPPED:   { label: "Đang giao",   color: "warning" },
  DELIVERED: { label: "Đã giao",     color: "success" },
  CANCELLED: { label: "Đã hủy",      color: "error"   },
};
const emptyAddr = { firstName:"", lastName:"", streetAddress:"", city:"", state:"", zipCode:"", mobile:"" };

export default function UserProfile() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const jwt       = localStorage.getItem("jwt");
  const { auth }  = useSelector((s) => s);
  const { order } = useSelector((s) => s);
  const user      = auth.user;

  const [tab,          setTab]          = useState("profile");
  const [editProfile,  setEditProfile]  = useState(false);
  const [profileForm,  setProfileForm]  = useState({ firstName:"", lastName:"", mobile:"" });
  const [saving,       setSaving]       = useState(false);
  const [snack,        setSnack]        = useState({ open:false, msg:"", sev:"success" });
  const [editAddrOpen, setEditAddrOpen] = useState(false);
  const [editAddrId,   setEditAddrId]   = useState(null);
  const [editAddrForm, setEditAddrForm] = useState(emptyAddr);
  const [deleteAddrId, setDeleteAddrId] = useState(null);
  const [deleteOpen,   setDeleteOpen]   = useState(false);

  useEffect(() => { dispatch(getUser(jwt)); dispatch(getOrderHistory({ jwt })); }, [jwt]);
  useEffect(() => {
    if (user) setProfileForm({ firstName: user.firstName||"", lastName: user.lastName||"", mobile: user.mobile||"" });
  }, [user]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/api/users/profile`, profileForm, {
        headers: { Authorization:`Bearer ${jwt}`, "Content-Type":"application/json" },
      });
      dispatch(getUser(jwt));
      setEditProfile(false);
      setSnack({ open:true, msg:"Đã cập nhật thông tin!", sev:"success" });
    } catch { setSnack({ open:true, msg:"Cập nhật thất bại!", sev:"error" }); }
    setSaving(false);
  };

  const confirmDelete = () => {
    dispatch(deleteAddress(deleteAddrId, jwt));
    setDeleteOpen(false);
    setSnack({ open:true, msg:"Đã xóa địa chỉ", sev:"info" });
  };
  const handleSaveAddr = () => {
    dispatch(updateAddress(editAddrId, editAddrForm, jwt));
    setEditAddrOpen(false);
    setSnack({ open:true, msg:"Đã cập nhật địa chỉ!", sev:"success" });
  };

  const addresses = user?.addresses || [];
  const orders    = order.orders   || [];
  const initial   = user?.firstName ? user.firstName[0].toUpperCase() : "U";

  const TABS = [
    { key:"profile",   label:"Thông tin", icon:<PersonOutlineIcon fontSize="small"/> },
    { key:"addresses", label:"Địa chỉ",   icon:<LocationOnOutlinedIcon fontSize="small"/> },
    { key:"orders",    label:"Đơn hàng",  icon:<ShoppingBagOutlinedIcon fontSize="small"/> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-6 text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-5 relative">
            <Avatar sx={{ width:72, height:72, bgcolor:"rgba(255,255,255,0.2)", fontSize:28, fontWeight:700, border:"3px solid rgba(255,255,255,0.4)" }}>
              {initial}
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
              <p className="text-indigo-200 text-sm">{user?.email}</p>
              <p className="text-indigo-200 text-xs mt-1">{orders.length} đơn hàng · {addresses.length} địa chỉ</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border rounded-xl p-1.5 mb-6 shadow-sm">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab===t.key ? "bg-indigo-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Profile Tab ── */}
        {tab==="profile" && (
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-800 text-lg">Thông tin cá nhân</h2>
              {!editProfile && (
                <Button startIcon={<EditOutlinedIcon/>} onClick={() => setEditProfile(true)}
                  size="small" variant="outlined" sx={{ borderRadius:2, textTransform:"none" }}>Chỉnh sửa</Button>
              )}
            </div>
            {!editProfile ? (
              <div className="space-y-4">
                {[["Họ", user?.firstName],["Tên", user?.lastName],["Email", user?.email],
                  ["Số điện thoại", user?.mobile||"Chưa cập nhật"]].map(([l,v]) => (
                  <div key={l} className="flex border-b border-gray-100 pb-3 last:border-0">
                    <span className="text-gray-400 text-sm w-40">{l}</span>
                    <span className="text-gray-800 text-sm font-medium">{v}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <Grid container spacing={2}>
                  {[["firstName","Họ"],["lastName","Tên"]].map(([k,l]) => (
                    <Grid item xs={12} sm={6} key={k}>
                      <TextField label={l} size="small" fullWidth value={profileForm[k]}
                        onChange={e => setProfileForm(p=>({...p,[k]:e.target.value}))} />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <TextField label="Email" size="small" fullWidth value={user?.email||""} disabled
                      helperText="Email không thể thay đổi" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Số điện thoại" size="small" fullWidth value={profileForm.mobile}
                      onChange={e => setProfileForm(p=>({...p,mobile:e.target.value}))} />
                  </Grid>
                </Grid>
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => setEditProfile(false)} color="inherit" variant="outlined"
                    sx={{ borderRadius:2, textTransform:"none" }}>Hủy</Button>
                  <Button onClick={handleSaveProfile} variant="contained" disabled={saving}
                    sx={{ borderRadius:2, textTransform:"none" }}>
                    {saving ? <CircularProgress size={18} color="inherit"/> : "Lưu thay đổi"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Addresses Tab ── */}
        {tab==="addresses" && (
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-800 text-lg">Địa chỉ của tôi</h2>
              <Button startIcon={<AddCircleOutlineIcon/>} onClick={() => navigate("/checkout?step=2")}
                size="small" variant="outlined" sx={{ borderRadius:2, textTransform:"none" }}>Thêm mới</Button>
            </div>
            {addresses.length===0 ? (
              <div className="text-center py-12">
                <LocationOnOutlinedIcon sx={{ fontSize:48, color:"#d1d5db", mb:1 }}/>
                <p className="text-gray-400 text-sm">Chưa có địa chỉ nào</p>
                <Button onClick={() => navigate("/checkout?step=2")} variant="contained"
                  sx={{ mt:2, borderRadius:2, textTransform:"none" }}>Thêm địa chỉ</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr, i) => (
                  <div key={addr.id} className="relative border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    {i===0 && <Chip label="Mặc định" size="small" color="primary" variant="outlined"
                      sx={{ position:"absolute", top:12, right:12, fontSize:10 }}/>}
                    <div className="flex items-start gap-3 pr-20">
                      <LocationOnOutlinedIcon sx={{ color:"#6366f1", mt:0.3, fontSize:20 }}/>
                      <div>
                        <p className="font-semibold text-sm">{addr.firstName} {addr.lastName}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{addr.streetAddress}, {addr.city}, {addr.state} {addr.zipCode}</p>
                        <p className="text-gray-500 text-xs">📞 {addr.mobile}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-3 justify-end">
                      <Button size="small" startIcon={<EditOutlinedIcon sx={{fontSize:14}}/>}
                        sx={{ textTransform:"none", fontSize:12 }}
                        onClick={() => { setEditAddrId(addr.id);
                          setEditAddrForm({firstName:addr.firstName||"",lastName:addr.lastName||"",
                            streetAddress:addr.streetAddress||"",city:addr.city||"",
                            state:addr.state||"",zipCode:addr.zipCode||"",mobile:addr.mobile||""});
                          setEditAddrOpen(true); }}>Sửa</Button>
                      <Button size="small" color="error" startIcon={<DeleteOutlineIcon sx={{fontSize:14}}/>}
                        sx={{ textTransform:"none", fontSize:12 }}
                        onClick={() => { setDeleteAddrId(addr.id); setDeleteOpen(true); }}>Xóa</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Orders Tab ── */}
        {tab==="orders" && (
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 text-lg mb-5">Lịch sử đơn hàng</h2>
            {orders.length===0 ? (
              <div className="text-center py-12">
                <ShoppingBagOutlinedIcon sx={{ fontSize:48, color:"#d1d5db", mb:1 }}/>
                <p className="text-gray-400 text-sm">Chưa có đơn hàng nào</p>
                <Button onClick={() => navigate("/")} variant="contained"
                  sx={{ mt:2, borderRadius:2, textTransform:"none" }}>Mua sắm ngay</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {[...orders].reverse().map(ord => {
                  const cfg = statusConfig[ord.orderStatus] || statusConfig.PENDING;
                  return (
                    <div key={ord.id} onClick={() => navigate(`/account/order/${ord.id}`)}
                      className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-700">Đơn #{ord.id}</span>
                          <Chip label={cfg.label} color={cfg.color} size="small" variant="outlined"/>
                        </div>
                        <span className="text-xs text-gray-400">
                          {ord.orderDate ? new Date(ord.orderDate).toLocaleDateString("vi-VN") : ""}
                        </span>
                      </div>
                      <div className="flex gap-2 overflow-x-auto">
                        {ord.orderItems?.slice(0,4).map(item => (
                          <img key={item.id} src={item.product?.imageUrl} alt={item.product?.title}
                            className="w-12 h-12 object-cover object-top rounded-lg border border-gray-100 flex-shrink-0"/>
                        ))}
                        {(ord.orderItems?.length||0)>4 && (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                            +{ord.orderItems.length-4}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-400">{ord.totalItem} sản phẩm</span>
                        <span className="font-bold text-indigo-600 text-sm">{currency(ord.totalDiscountedPrice)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{fontWeight:700}}>Xóa địa chỉ?</DialogTitle>
        <DialogContent><p className="text-gray-600 text-sm">Địa chỉ sẽ bị xóa vĩnh viễn.</p></DialogContent>
        <DialogActions sx={{px:3,pb:2}}>
          <Button onClick={() => setDeleteOpen(false)} color="inherit">Hủy</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Xóa</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editAddrOpen} onClose={() => setEditAddrOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{fontWeight:700}}>Sửa địa chỉ</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{mt:0.5}}>
            {[["firstName","Họ"],["lastName","Tên"]].map(([k,l]) => (
              <Grid item xs={6} key={k}>
                <TextField label={l} size="small" fullWidth value={editAddrForm[k]||""}
                  onChange={e => setEditAddrForm(p=>({...p,[k]:e.target.value}))}/>
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField label="Địa chỉ" size="small" fullWidth multiline rows={2}
                value={editAddrForm.streetAddress||""}
                onChange={e => setEditAddrForm(p=>({...p,streetAddress:e.target.value}))}/>
            </Grid>
            {[["city","Thành phố"],["state","Tỉnh/Quận"],["zipCode","Mã bưu điện"],["mobile","SĐT"]].map(([k,l]) => (
              <Grid item xs={6} key={k}>
                <TextField label={l} size="small" fullWidth value={editAddrForm[k]||""}
                  onChange={e => setEditAddrForm(p=>({...p,[k]:e.target.value}))}/>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{px:3,pb:2}}>
          <Button onClick={() => setEditAddrOpen(false)} color="inherit">Hủy</Button>
          <Button onClick={handleSaveAddr} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s=>({...s,open:false}))}
        anchorOrigin={{vertical:"bottom",horizontal:"center"}}>
        <Alert severity={snack.sev} sx={{width:"100%"}}>{snack.msg}</Alert>
      </Snackbar>
    </div>
  );
}
