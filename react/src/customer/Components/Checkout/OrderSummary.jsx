import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Snackbar,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../../Redux/Customers/Order/Action.jsx";
import api from "../../../config/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const BANK = {
  bankName: "Vietcombank",
  bankLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Vietcombank_logo.svg/320px-Vietcombank_logo.svg.png",
  accountNumber: "1234567890",
  accountName: "CONG TY LUMINA FASHION",
  branch: "Chi nhánh TP. Hồ Chí Minh",
  swiftCode: "BFTVVNVX",
};

const currency = (v) => `${Number(v || 0).toLocaleString("vi-VN")} ₫`;

const formatTime = (value) => {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const buildQrMatrix = (payload, size = 29) => {
  let seed = 17;
  for (let i = 0; i < payload.length; i += 1) {
    seed = (seed * 31 + payload.charCodeAt(i)) % 2147483647;
  }
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));
  const addFinder = (startX, startY) => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        const edge = x === 0 || y === 0 || x === 6 || y === 6;
        const center = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        matrix[startY + y][startX + x] = edge || center;
      }
    }
  };
  addFinder(1, 1);
  addFinder(size - 8, 1);
  addFinder(1, size - 8);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const inFinder =
        (x >= 1 && x <= 7 && y >= 1 && y <= 7) ||
        (x >= size - 8 && x <= size - 2 && y >= 1 && y <= 7) ||
        (x >= 1 && x <= 7 && y >= size - 8 && y <= size - 2);
      if (inFinder) continue;
      const mixed = (seed + x * 37 + y * 53 + x * y * 7) % 11;
      matrix[y][x] = mixed === 0 || mixed === 2 || mixed === 5 || mixed === 7;
    }
  }
  return matrix;
};

function DemoQrCode({ payload }) {
  const matrix = useMemo(() => buildQrMatrix(payload), [payload]);
  const cell = 8;
  const quiet = 2;
  const size = matrix.length;
  return (
    <svg
      viewBox={`0 0 ${(size + quiet * 2) * cell} ${(size + quiet * 2) * cell}`}
      className="h-full w-full"
      role="img"
      aria-label="Lumina QR demo"
    >
      <rect width="100%" height="100%" fill="#ffffff" />
      {matrix.map((row, y) =>
        row.map((active, x) =>
          active ? (
            <rect
              key={`${x}-${y}`}
              x={(x + quiet) * cell}
              y={(y + quiet) * cell}
              width={cell}
              height={cell}
              rx="1"
              fill="#00509D"
            />
          ) : null
        )
      )}
    </svg>
  );
}

function CopyField({ label, value, highlight }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(String(value)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${highlight ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className={`text-sm font-bold truncate ${highlight ? "text-blue-700" : "text-gray-800"}`}>{value}</p>
      </div>
      <Tooltip title={copied ? "Đã sao chép!" : "Sao chép"}>
        <IconButton size="small" onClick={handleCopy} sx={{ ml: 1, color: copied ? "#16a34a" : "#6b7280" }}>
          {copied ? <VerifiedOutlinedIcon sx={{ fontSize: 18 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default function OrderSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { order } = useSelector((s) => s);

  const orderId = new URLSearchParams(location.search).get("order_id");
  const invalidOrderId = !orderId || orderId === "undefined" || orderId === "null";
  const o = order.order;

  const [method, setMethod] = useState(null);
  const [codDone, setCodDone] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [qrStatus, setQrStatus] = useState("idle");
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [activeTab, setActiveTab] = useState("qr"); // "qr" | "manual"
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (!invalidOrderId) dispatch(getOrderById(orderId));
  }, [dispatch, invalidOrderId, orderId]);

  useEffect(() => {
    if (!showBank || qrStatus === "paid") return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [showBank, qrStatus]);

  useEffect(() => {
    if (showBank) {
      setSecondsLeft(600);
      setQrStatus((status) => (status === "paid" ? status : "idle"));
    }
  }, [showBank, orderId]);

  const shippAddr = o?.shippingAddress;
  const discount = o?.discount ?? o?.discounte ?? 0;
  const amount = o?.totalDiscountedPrice ?? 0;
  const transferContent = `LUMINA ${o?.id || orderId || ""}`;
  const transactionId = `QR-${o?.id || orderId || "ORDER"}-${Math.max(amount, 0)}`;
  const qrPayload = JSON.stringify({
    bank: BANK.bankName, account: BANK.accountNumber,
    name: BANK.accountName, amount, content: transferContent, transactionId,
  });

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleConfirmQrPayment = async () => {
    if (!o?.id) {
      showToast("Chưa có mã đơn hàng để xác nhận.", "error");
      return;
    }
    setQrStatus("verifying");
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1800));
      await api.post(`/api/payments/qr/${o.id}/confirm`, {
        transactionId, amount: String(amount), content: transferContent,
      });
      await dispatch(getOrderById(o.id));
      setQrStatus("paid");
      showToast("Xác nhận chuyển khoản thành công! Đơn hàng đang chờ xử lý.");
    } catch (error) {
      setQrStatus("idle");
      showToast("Chưa xác nhận được. Vui lòng thử lại.", "error");
    }
  };

  const timerPercent = (secondsLeft / 600) * 100;
  const timerColor = secondsLeft > 180 ? "#16a34a" : secondsLeft > 60 ? "#f59e0b" : "#ef4444";

  if (invalidOrderId) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="font-bold text-amber-800">Không tìm thấy mã đơn hàng.</p>
        <p className="mt-2 text-sm text-amber-700">Hãy quay lại giỏ hàng và chọn địa chỉ giao hàng một lần nữa.</p>
        <Button onClick={() => navigate("/cart")} variant="contained" sx={{ mt: 3, borderRadius: 2, textTransform: "none", fontWeight: 700 }}>
          Quay lại giỏ hàng
        </Button>
      </div>
    );
  }

  if (order.loading && !o) {
    return <div className="flex justify-center py-20"><CircularProgress /></div>;
  }

  if (order.error && !o) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-bold text-red-700">Không tải được đơn hàng.</p>
        <p className="mt-2 text-sm text-red-600">{order.error}</p>
        <Button onClick={() => navigate("/cart")} variant="contained" color="error" sx={{ mt: 3, borderRadius: 2, textTransform: "none", fontWeight: 700 }}>
          Quay lại giỏ hàng
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Xác nhận đơn hàng</h2>
        {o?.id && <Chip label={`Đơn #${o.id}`} variant="outlined" size="small" />}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {shippAddr && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <LocationOnOutlinedIcon sx={{ color: "#6366f1", fontSize: 20 }} />
                <span className="text-sm font-semibold uppercase tracking-wide text-gray-700">Giao đến</span>
              </div>
              <p className="font-semibold text-gray-800">{shippAddr.firstName} {shippAddr.lastName}</p>
              <p className="mt-0.5 text-sm text-gray-500">{shippAddr.streetAddress}, {shippAddr.city}, {shippAddr.state} {shippAddr.zipCode}</p>
              <p className="text-sm text-gray-500">SĐT: {shippAddr.mobile}</p>
            </div>
          )}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ShoppingBagOutlinedIcon sx={{ color: "#6366f1", fontSize: 20 }} />
              <span className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                Sản phẩm ({o?.totalItem || 0})
              </span>
            </div>
            <div className="space-y-4">
              {o?.orderItems?.length ? (
                o.orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <img src={item.product?.imageUrl} alt={item.product?.title} className="h-16 w-16 flex-shrink-0 rounded-lg object-cover object-top" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-800">{item.product?.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500">Size: {item.size} · SL: {item.quantity} · {item.product?.brand}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-semibold text-gray-800">{currency(item.discountedPrice)}</p>
                      {item.price !== item.discountedPrice && (
                        <p className="text-xs text-gray-400 line-through">{currency(item.price)}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                  Đơn hàng chưa có sản phẩm. Hãy quay lại giỏ hàng để kiểm tra.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">Chi tiết giá</p>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính ({o?.totalItem || 0} sp)</span>
                <span>{currency(o?.totalPrice)}</span>
              </div>
              <div className="flex justify-between font-medium text-green-600">
                <span>Giảm giá</span>
                <span>-{currency(discount)}</span>
              </div>
              <div className="flex justify-between font-medium text-green-600">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <Divider />
              <div className="flex justify-between pt-1 text-base font-bold text-gray-900">
                <span>Tổng cộng</span>
                <span className="text-indigo-600">{currency(amount)}</span>
              </div>
            </div>
          </div>

          {!codDone ? (
            <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-700">Chọn phương thức thanh toán</p>

              <button
                onClick={() => { setMethod("cod"); setCodDone(true); }}
                className={`flex w-full items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${
                  method === "cod" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <LocalShippingIcon sx={{ color: "#6366f1", fontSize: 22 }} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-xs text-gray-500">Trả tiền mặt khi nhận</p>
                </div>
              </button>

              <button
                onClick={() => { setMethod("transfer"); setShowBank(true); }}
                className={`flex w-full items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${
                  method === "transfer" ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"
                }`}
              >
                <AccountBalanceIcon sx={{ color: "#059669", fontSize: 22 }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800">Chuyển khoản ngân hàng</p>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                      QR Pay
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Quét mã QR hoặc chuyển khoản thủ công</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3">
                <CheckCircleOutlineIcon sx={{ color: "#16a34a" }} />
                <div>
                  <p className="text-sm font-semibold text-green-700">Đặt hàng thành công!</p>
                  <p className="text-xs text-gray-500">Thanh toán khi nhận hàng (COD)</p>
                </div>
              </div>
              <Button fullWidth variant="contained" onClick={() => navigate("/account/order")}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
                Xem đơn hàng của tôi
              </Button>
              <Button fullWidth variant="text" size="small"
                onClick={() => { setCodDone(false); setMethod(null); }}
                sx={{ textTransform: "none", color: "text.secondary" }}>
                Đổi phương thức
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Bank Transfer Dialog ── */}
      <Dialog open={showBank} onClose={() => qrStatus !== "verifying" && setShowBank(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#00509D] to-[#003f7f] px-6 py-4 flex items-center gap-3">
          <img src={BANK.bankLogo} alt="Vietcombank" className="h-7 bg-white rounded px-1" onError={(e) => e.target.style.display='none'} />
          <div className="flex-1">
            <p className="text-white font-bold text-base">Thanh toán chuyển khoản</p>
            <p className="text-blue-200 text-xs">{BANK.bankName} – {BANK.branch}</p>
          </div>
          {o?.id && <Chip label={`Đơn #${o.id}`} size="small" sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", fontSize: 11 }} />}
        </div>

        {/* Timer bar */}
        {qrStatus !== "paid" && (
          <div className="px-6 pt-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <AccessTimeIcon sx={{ fontSize: 14 }} />
                <span>Thời hạn thanh toán</span>
              </div>
              <span className="font-mono text-sm font-bold" style={{ color: timerColor }}>
                {formatTime(secondsLeft)}
              </span>
            </div>
            <LinearProgress variant="determinate" value={timerPercent}
              sx={{ height: 4, borderRadius: 2, bgcolor: "#e5e7eb",
                "& .MuiLinearProgress-bar": { bgcolor: timerColor, transition: "none" } }} />
          </div>
        )}

        <DialogContent sx={{ px: 3, py: 2 }}>
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {["qr", "manual"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {tab === "qr" ? "📱 Quét QR Code" : "🏦 Chuyển khoản thủ công"}
              </button>
            ))}
          </div>

          {activeTab === "qr" && (
            <div className="grid gap-5 md:grid-cols-[1fr_1.2fr]">
              {/* QR */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative rounded-2xl border-4 border-blue-600 bg-white p-3 shadow-lg w-52 h-52">
                  <DemoQrCode payload={qrPayload} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white rounded-full p-1 shadow">
                      <QrCode2Icon sx={{ fontSize: 22, color: "#00509D" }} />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center max-w-[200px]">
                  Mở app ngân hàng → Chuyển tiền → Quét QR
                </p>
                {qrStatus === "paid" && (
                  <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-700 w-full justify-center">
                    <VerifiedOutlinedIcon sx={{ fontSize: 20 }} />
                    Đã xác nhận thanh toán!
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-2.5">
                <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 flex items-center gap-3">
                  <AccountBalanceIcon sx={{ color: "#00509D", fontSize: 28 }} />
                  <div>
                    <p className="font-black text-blue-900 text-base">{BANK.bankName}</p>
                    <p className="text-xs text-blue-600">{BANK.branch}</p>
                    <p className="text-xs text-gray-400">SWIFT: {BANK.swiftCode}</p>
                  </div>
                </div>
                <CopyField label="Số tài khoản" value={BANK.accountNumber} />
                <CopyField label="Tên tài khoản" value={BANK.accountName} />
                <CopyField label="Số tiền cần chuyển" value={currency(amount)} highlight />
                <CopyField label="Nội dung chuyển khoản" value={transferContent} highlight />

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex gap-2">
                  <WarningAmberIcon sx={{ color: "#d97706", fontSize: 18, mt: 0.2 }} />
                  <p className="text-xs text-amber-700 leading-5">
                    Vui lòng nhập <strong>đúng nội dung</strong> khi chuyển khoản để đơn hàng được xác nhận tự động.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "manual" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 flex items-center gap-4">
                <AccountBalanceIcon sx={{ color: "#00509D", fontSize: 40 }} />
                <div>
                  <p className="font-black text-blue-900 text-lg">{BANK.bankName}</p>
                  <p className="text-sm text-blue-600">{BANK.branch}</p>
                  <p className="text-xs text-gray-400 mt-0.5">SWIFT: {BANK.swiftCode}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <CopyField label="Số tài khoản" value={BANK.accountNumber} />
                <CopyField label="Tên tài khoản" value={BANK.accountName} />
                <CopyField label="Số tiền" value={currency(amount)} highlight />
                <CopyField label="Nội dung chuyển khoản" value={transferContent} highlight />
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2">
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <InfoOutlinedIcon sx={{ fontSize: 16 }} /> Hướng dẫn chuyển khoản
                </p>
                {[
                  "Đăng nhập Internet Banking / Mobile Banking của bạn",
                  "Chọn Chuyển tiền → Chuyển khoản nội địa",
                  `Nhập STK: ${BANK.accountNumber} tại ${BANK.bankName}`,
                  `Nhập số tiền: ${currency(amount)}`,
                  `Nhập nội dung: ${transferContent}`,
                  "Xác nhận và hoàn tất giao dịch",
                  'Nhấn "Tôi đã chuyển khoản" bên dưới để xác nhận',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex gap-2">
                <WarningAmberIcon sx={{ color: "#d97706", fontSize: 18, mt: 0.2 }} />
                <p className="text-xs text-amber-700 leading-5">
                  Đơn hàng sẽ ở trạng thái <strong>Chờ xử lý</strong> cho đến khi admin xác nhận thanh toán.
                </p>
              </div>
            </div>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1.5, borderTop: "1px solid #e5e7eb" }}>
          <Button onClick={() => setShowBank(false)} color="inherit" variant="outlined"
            disabled={qrStatus === "verifying"}
            startIcon={<ArrowBackIcon />}
            sx={{ textTransform: "none", borderRadius: 2 }}>
            Quay lại
          </Button>

          <div className="flex-1" />

          {qrStatus === "paid" ? (
            <Button onClick={() => navigate("/account/order")} variant="contained"
              startIcon={<CheckCircleOutlineIcon />}
              sx={{ bgcolor: "#059669", "&:hover": { bgcolor: "#047857" }, textTransform: "none", fontWeight: 700, borderRadius: 2, px: 3 }}>
              Xem đơn hàng của tôi
            </Button>
          ) : (
            <Button onClick={handleConfirmQrPayment} variant="contained"
              disabled={qrStatus === "verifying" || secondsLeft === 0}
              sx={{ bgcolor: "#00509D", "&:hover": { bgcolor: "#003f7f" }, textTransform: "none", fontWeight: 700, borderRadius: 2, px: 3 }}>
              {qrStatus === "verifying"
                ? <><CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />Đang xác nhận...</>
                : secondsLeft === 0 ? "Hết thời gian" : "✅ Tôi đã chuyển khoản"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
