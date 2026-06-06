import { useState, useEffect } from "react";
import {
  Slider, Checkbox, FormControlLabel, FormGroup,
  Drawer, IconButton, Chip, Pagination, CircularProgress,
  Select, MenuItem, InputLabel, FormControl, Divider,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import ProductCard from "../ProductCard/ProductCard";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findProducts } from "../../../../Redux/Customers/Product/Action";

// ── Filter data ──────────────────────────────────────────────
const COLOR_OPTIONS = [
  { value: "White",      label: "Trắng",    hex: "#FFFFFF" },
  { value: "Black",      label: "Đen",      hex: "#111111" },
  { value: "Red",        label: "Đỏ",       hex: "#EF4444" },
  { value: "Blue",       label: "Xanh dương", hex: "#3B82F6" },
  { value: "Gray",       label: "Xám",      hex: "#9CA3AF" },
  { value: "Beige",      label: "Be",       hex: "#D4B896" },
  { value: "Navy",       label: "Navy",     hex: "#1E3A5F" },
  { value: "Brown",      label: "Nâu",      hex: "#92400E" },
  { value: "Green",      label: "Xanh lá",  hex: "#16A34A" },
  { value: "Pink",       label: "Hồng",     hex: "#EC4899" },
  { value: "Rose",       label: "Hồng đất", hex: "#F43F5E" },
  { value: "Coral",      label: "Cam san hô",hex: "#F97316" },
  { value: "Gold",       label: "Vàng",     hex: "#D97706" },
  { value: "Maroon",     label: "Đỏ sẫm",   hex: "#881337" },
  { value: "Ivory",      label: "Ngà",      hex: "#FFFFF0" },
  { value: "Cream",      label: "Kem",      hex: "#FEFCE8" },
  { value: "Champagne",  label: "Champagne",hex: "#F5E6CA" },
  { value: "Terracotta", label: "Đất nung", hex: "#C2553F" },
  { value: "Emerald",    label: "Ngọc lục", hex: "#065F46" },
  { value: "Purple",     label: "Tím",      hex: "#7C3AED" },
  { value: "Khaki",      label: "Khaki",    hex: "#C3A76B" },
  { value: "Olive",      label: "Xanh olive",hex: "#6B7C3F" },
  { value: "Dusty Pink", label: "Hồng nude",hex: "#D4A5A5" },
  { value: "Tortoise",   label: "Đồi mồi",  hex: "#8B6914" },
  { value: "Tan",        label: "Nâu nhạt", hex: "#D2B48C" },
  { value: "Natural",    label: "Tự nhiên", hex: "#E8D5B7" },
  { value: "Blush",      label: "Hồng phấn",hex: "#FFB6C1" },
  { value: "Indigo",     label: "Chàm",     hex: "#4338CA" },
  { value: "Peach",      label: "Đào",      hex: "#FFCBA4" },
  { value: "Floral",     label: "Họa tiết", hex: "#FDE68A" },
  { value: "Red Plaid",  label: "Caro đỏ",  hex: "#DC2626" },
  { value: "Light Blue", label: "Xanh nhạt",hex: "#93C5FD" },
  { value: "Dark Blue",  label: "Xanh đậm", hex: "#1E40AF" },
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

const PRICE_RANGES = [
  { label: "Dưới 500K",        value: "0-500000" },
  { label: "500K – 1 triệu",   value: "500000-1000000" },
  { label: "1 – 1.6 triệu",    value: "1000000-1600000" },
  { label: "1.6 – 3 triệu",    value: "1600000-3000000" },
  { label: "Trên 3 triệu",     value: "3000000-100000000" },
];

const SORT_OPTIONS = [
  { value: "price_low",  label: "Giá: Thấp → Cao" },
  { value: "price_high", label: "Giá: Cao → Thấp" },
];

// ── Helpers ──────────────────────────────────────────────────
const toArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val.split(",").filter(Boolean);
};

// ── Component ────────────────────────────────────────────────
export default function Product() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const param      = useParams();
  const location   = useLocation();
  const { customersProduct } = useSelector((store) => store);

  const searchParams  = new URLSearchParams(decodeURIComponent(location.search));
  const colorValues   = toArray(searchParams.get("color"));
  const sizeValues    = toArray(searchParams.get("size"));
  const priceValue    = searchParams.get("price") || "";
  const sortValue     = searchParams.get("sort")  || "price_low";
  const pageNumber    = parseInt(searchParams.get("page") || "1");
  const stockValue    = searchParams.get("stock")  || "";

  const products      = customersProduct?.products?.content || [];
  const totalPages    = customersProduct?.products?.totalPages || 1;
  const loading       = customersProduct?.loading || false;

  // ── Fetch ────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const [minPrice, maxPrice] = priceValue
      ? priceValue.split("-").map(Number)
      : [0, 100000000];
    dispatch(findProducts({
      category:    param.lavelThree || "",
      colors:      colorValues,
      sizes:       sizeValues,
      minPrice:    minPrice,
      maxPrice:    maxPrice,
      minDiscount: 0,
      sort:        sortValue,
      pageNumber:  pageNumber - 1,
      pageSize:    12,
      stock:       stockValue || null,
    }));
  }, [param.lavelThree, location.search]);

  // ── URL helpers ──────────────────────────────────────
  const setParam = (key, value) => {
    const sp = new URLSearchParams(decodeURIComponent(location.search));
    if (value) sp.set(key, value); else sp.delete(key);
    sp.delete("page");
    navigate({ search: "?" + sp.toString() });
  };

  const toggleMultiParam = (key, value) => {
    const sp  = new URLSearchParams(decodeURIComponent(location.search));
    const cur = toArray(sp.get(key));
    const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value];
    if (next.length) sp.set(key, next.join(",")); else sp.delete(key);
    sp.delete("page");
    navigate({ search: "?" + sp.toString() });
  };

  const clearAll = () => navigate({ search: "" });

  const activeFilterCount = colorValues.length + sizeValues.length
    + (priceValue ? 1 : 0) + (stockValue ? 1 : 0);

  // ── Category label ───────────────────────────────────
  const categoryLabel = (param.lavelThree || "Sản phẩm")
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());

  // ── Filter panel (dùng cho cả desktop sidebar + mobile drawer) ──
  const FilterPanel = () => (
    <div className="space-y-6 text-sm">
      {/* Sort */}
      <div>
        <p className="font-semibold text-gray-800 mb-2 uppercase tracking-wide text-xs">Sắp xếp</p>
        <FormControl fullWidth size="small">
          <Select
            value={sortValue}
            onChange={e => setParam("sort", e.target.value)}
            sx={{ fontSize: "0.8rem" }}
          >
            {SORT_OPTIONS.map(o => (
              <MenuItem key={o.value} value={o.value} sx={{ fontSize: "0.8rem" }}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <Divider />

      {/* Price */}
      <div>
        <p className="font-semibold text-gray-800 mb-2 uppercase tracking-wide text-xs">Khoảng giá</p>
        <div className="space-y-1">
          {PRICE_RANGES.map(r => (
            <button
              key={r.value}
              onClick={() => setParam("price", priceValue === r.value ? "" : r.value)}
              className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${
                priceValue === r.value
                  ? "bg-black text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <Divider />

      {/* Size */}
      <div>
        <p className="font-semibold text-gray-800 mb-2 uppercase tracking-wide text-xs">Size</p>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => toggleMultiParam("size", s)}
              className={`px-3 py-1 border rounded-md text-xs font-medium transition-colors ${
                sizeValues.includes(s)
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:border-black"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Divider />

      {/* Color */}
      <div>
        <p className="font-semibold text-gray-800 mb-2 uppercase tracking-wide text-xs">Màu sắc</p>
        <div className="grid grid-cols-5 gap-2">
          {COLOR_OPTIONS.map(c => (
            <button
              key={c.value}
              title={c.label}
              onClick={() => toggleMultiParam("color", c.value)}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                colorValues.includes(c.value)
                  ? "border-black scale-110 ring-2 ring-black ring-offset-1"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <Divider />

      {/* Stock */}
      <div>
        <p className="font-semibold text-gray-800 mb-2 uppercase tracking-wide text-xs">Tình trạng</p>
        <div className="space-y-1">
          {[
            { value: "in_stock",     label: "Còn hàng" },
            { value: "out_of_stock", label: "Hết hàng" },
          ].map(o => (
            <button
              key={o.value}
              onClick={() => setParam("stock", stockValue === o.value ? "" : o.value)}
              className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${
                stockValue === o.value
                  ? "bg-black text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear all */}
      {activeFilterCount > 0 && (
        <>
          <Divider />
          <button
            onClick={clearAll}
            className="w-full text-xs text-red-500 hover:text-red-700 py-1 underline"
          >
            Xóa tất cả bộ lọc ({activeFilterCount})
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* ── Breadcrumb & Header ── */}
      <div className="px-4 lg:px-10 pt-6 pb-3">
        <p className="text-xs text-gray-400 mb-1 capitalize">
          {param.lavelOne} / {param.lavelTwo} / {param.lavelThree?.replace(/_/g, " ")}
        </p>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{categoryLabel}</h1>
          <div className="flex items-center gap-3">
            {/* Active filter chips */}
            <div className="hidden lg:flex flex-wrap gap-1">
              {colorValues.map(v => (
                <Chip key={v} label={v} size="small" onDelete={() => toggleMultiParam("color", v)} />
              ))}
              {sizeValues.map(v => (
                <Chip key={v} label={`Size ${v}`} size="small" onDelete={() => toggleMultiParam("size", v)} />
              ))}
              {priceValue && (
                <Chip
                  label={PRICE_RANGES.find(r => r.value === priceValue)?.label || priceValue}
                  size="small"
                  onDelete={() => setParam("price", "")}
                />
              )}
            </div>
            {/* Mobile filter button */}
            <button
              className="lg:hidden flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1 text-sm"
              onClick={() => setDrawerOpen(true)}
            >
              <TuneIcon fontSize="small" />
              Lọc {activeFilterCount > 0 && <span className="ml-1 bg-black text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">{activeFilterCount}</span>}
            </button>
          </div>
        </div>
        {products.length > 0 && (
          <p className="text-xs text-gray-400 mt-1">{customersProduct?.products?.totalElements || products.length} sản phẩm</p>
        )}
      </div>

      <div className="flex px-4 lg:px-10 gap-8">
        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-4 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-gray-900 flex items-center gap-1">
                <FilterListIcon fontSize="small" /> Bộ lọc
              </span>
              {activeFilterCount > 0 && (
                <span className="text-xs bg-black text-white rounded-full px-2 py-0.5">{activeFilterCount}</span>
              )}
            </div>
            <FilterPanel />
          </div>
        </aside>

        {/* ── Product Grid ── */}
        <main className="flex-1 pb-12">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <CircularProgress />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-lg font-semibold text-gray-700">Không tìm thấy sản phẩm</p>
              <p className="text-sm text-gray-400 mt-1">Thử thay đổi hoặc xóa bộ lọc</p>
              {activeFilterCount > 0 && (
                <button onClick={clearAll} className="mt-3 text-sm text-indigo-600 underline">
                  Xóa tất cả bộ lọc
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <Pagination
                    count={totalPages}
                    page={pageNumber}
                    onChange={(_, val) => setParam("page", String(val))}
                    color="primary"
                    shape="rounded"
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Mobile Drawer ── */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="w-72 p-5">
          <div className="flex items-center justify-between mb-5">
            <span className="font-bold text-lg">Bộ lọc</span>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <FilterPanel />
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-full mt-6 bg-black text-white py-2.5 rounded-lg font-medium"
          >
            Xem kết quả ({products.length})
          </button>
        </div>
      </Drawer>
    </div>
  );
}
