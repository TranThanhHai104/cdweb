import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeProductSection from "../customer/Components/Home/HomeProductSection";
import HomeProductCard from "../customer/Components/Home/HomeProductCard";
import api from "../config/api";

const heroSlides = [
  {
    title: "Bộ Sưu Tập Hè 2026",
    subtitle: "Phong cách tươi mát, năng động cho mùa hè rực rỡ.",
    cta: "Khám phá ngay",
    path: "/women/clothing/women_dress",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=80",
    accent: "#f0c7a5",
  },
  {
    title: "Men's Premium Collection",
    subtitle: "Phong cách lịch lãm, sang trọng dành cho quý ông.",
    cta: "Mua sắm nam",
    path: "/men/clothing/shirt",
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1800&q=80",
    accent: "#a8d8ea",
  },
];

const collections = [
  {
    title: "Áo Sơ Mi Nam",
    subtitle: "Tinh tế, lịch lãm cho mọi dịp.",
    path: "/men/clothing/shirt",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
  },
  {
    title: "Váy Đầm Nữ",
    subtitle: "Duyên dáng, nữ tính và thời thượng.",
    path: "/women/clothing/women_dress",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    badge: "Mới về",
  },
  {
    title: "Quần Jeans",
    subtitle: "Cá tính, năng động cho mọi lứa tuổi.",
    path: "/men/clothing/men_jeans",
    image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=800&q=80",
    badge: "Hot",
  },
  {
    title: "Áo Thun & Top",
    subtitle: "Thoải mái, trẻ trung cho ngày bình thường.",
    path: "/women/clothing/top",
    image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?auto=format&fit=crop&w=800&q=80",
    badge: "Sale -30%",
  },
];

const promoStrip = [
  "🚚 Miễn phí vận chuyển đơn từ 500K",
  "🎁 Quà tặng cho đơn hàng đầu tiên",
  "🔄 Đổi trả trong 30 ngày",
  "⭐ Hơn 10.000 khách hàng hài lòng",
  "💳 Thanh toán an toàn nhiều hình thức",
];

const testimonials = [
  { name: "Nguyễn Thu Hà", role: "Khách hàng thân thiết", text: "Chất lượng sản phẩm tuyệt vời, giao hàng nhanh. Mình đã mua hàng chục lần và chưa bao giờ thất vọng!", rating: 5 },
  { name: "Trần Minh Khoa", role: "Khách hàng mới", text: "Lần đầu mua nhưng rất hài lòng. Áo sơ mi đúng size, chất liệu thoáng mát, giá cả hợp lý.", rating: 5 },
  { name: "Lê Phương Anh", role: "Khách hàng VIP", text: "LUMINA là địa chỉ mua sắm tin cậy của mình. Mẫu mã đa dạng, cập nhật xu hướng liên tục.", rating: 5 },
];

const brands = [
  { name: "ZARA Style", desc: "Phong cách châu Âu" },
  { name: "H&M Inspired", desc: "Trẻ trung, đa dạng" },
  { name: "Local Premium", desc: "Thương hiệu Việt" },
  { name: "Sport & Life", desc: "Năng động, khỏe khoắn" },
];

const categoryLabels = {
  shirt: "Áo Sơ Mi Nam", mens_kurta: "Áo Kurta Nam", men_jeans: "Quần Jeans Nam",
  women_dress: "Đầm Nữ", saree: "Saree", gouns: "Váy Đầm Dài", lengha_choli: "Lengha Choli", top: "Áo Nữ",
};

const readableCategory = (value = "Sản phẩm") =>
  categoryLabels[value] || value.split("_").filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

const categoryPath = (category) => {
  const third = category?.name || "shirt";
  const second = category?.parentCategory?.name || "clothing";
  const top = category?.parentCategory?.parentCategory?.name || "men";
  return `/${top}/${second}/${third}`;
};

const Homepage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [heroSlide, setHeroSlide] = useState(0);
  const [stripPos, setStripPos] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/api/products/all");
        setProducts(data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Auto-rotate hero
  useEffect(() => {
    const timer = setInterval(() => setHeroSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // Scroll promo strip
  useEffect(() => {
    const timer = setInterval(() => setStripPos((s) => (s + 1) % promoStrip.length), 3000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.slice(0, 10);
  const newArrivals = products.slice(0, 6);
  const saleProducts = products.filter((p) => p.discountPersent > 10).slice(0, 6);

  const groupedSections = useMemo(() => {
    const buckets = new Map();
    products.forEach((product) => {
      const key = product.category?.name || "products";
      if (!buckets.has(key)) {
        buckets.set(key, { title: readableCategory(key), path: categoryPath(product.category), data: [] });
      }
      buckets.get(key).data.push(product);
    });
    return Array.from(buckets.values()).slice(0, 8);
  }, [products]);

  const slide = heroSlides[heroSlide];

  return (
    <main className="bg-[#f7f3ed]">

      {/* ── Promo Strip ── */}
      <div className="bg-stone-950 text-white py-2 overflow-hidden">
        <div className="flex gap-12 animate-none justify-center">
          {promoStrip.map((msg, i) => (
            <span key={i} className={`text-xs font-semibold tracking-wide whitespace-nowrap transition-opacity duration-500 ${i === stripPos ? "opacity-100" : "opacity-30"}`}>
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] overflow-hidden bg-stone-950 text-white">
        <img
          src={slide.image}
          alt="Fashion hero"
          className="absolute inset-0 h-full w-full object-cover opacity-65 transition-all duration-700"
          key={heroSlide}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

        <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-white/90 backdrop-blur mb-4">
              ✨ New Collection 2026
            </span>
            <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              {slide.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-stone-200 sm:text-lg">
              {slide.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate(slide.path)}
                className="rounded-full bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-stone-950 transition hover:bg-[#f0c7a5] shadow-lg"
              >
                {slide.cta} →
              </button>
              <button
                onClick={() => navigate("/women/clothing/women_dress")}
                className="rounded-full border-2 border-white/60 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-stone-950"
              >
                Xem tất cả
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid max-w-xl grid-cols-3 gap-3">
            {[[products.length || "...", "sản phẩm"], ["10K+", "khách hàng"], ["4.9★", "đánh giá"]].map(([v, l]) => (
              <div key={l} className="border border-white/20 bg-white/10 p-4 backdrop-blur rounded-lg text-center">
                <p className="text-2xl font-black">{v}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-300">{l}</p>
              </div>
            ))}
          </div>

          {/* Slide indicators */}
          <div className="mt-8 flex gap-2">
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setHeroSlide(i)}
                className={`h-1.5 rounded-full transition-all ${i === heroSlide ? "w-8 bg-white" : "w-2 bg-white/40"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Flash Sale Banner ── */}
      {saleProducts.length > 0 && (
        <section className="bg-gradient-to-r from-red-600 to-orange-500 py-3">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-white text-red-600 font-black text-xs px-3 py-1.5 rounded-full animate-pulse">🔥 FLASH SALE</span>
              <p className="text-white font-bold text-sm">Giảm đến 50% — Số lượng có hạn!</p>
            </div>
            <button onClick={() => navigate("/women/clothing/women_dress")}
              className="text-white text-xs font-bold underline hover:no-underline">
              Xem ngay →
            </button>
          </div>
        </section>
      )}

      {/* ── Category Grid ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a24d24]">Danh mục nổi bật</p>
          <h2 className="mt-2 text-3xl font-black text-stone-950">Khám phá bộ sưu tập</h2>
          <p className="mt-2 text-sm text-stone-500">Chọn phong cách phù hợp với bạn</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((item) => (
            <button key={item.title} onClick={() => navigate(item.path)}
              className="group relative overflow-hidden rounded-2xl bg-stone-900 text-left text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              style={{ minHeight: "22rem" }}>
              <img src={item.image} alt={item.title}
                className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {item.badge && (
                <span className="absolute top-3 right-3 bg-white text-stone-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow">
                  {item.badge}
                </span>
              )}
              <div className="absolute bottom-0 p-5">
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-1 text-sm text-stone-200">{item.subtitle}</p>
                <span className="mt-3 inline-block text-xs font-bold uppercase tracking-wide text-[#f0c7a5] group-hover:underline">
                  Xem ngay →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#a24d24]">Nổi bật</p>
              <h2 className="mt-2 text-3xl font-black text-stone-950">Sản phẩm tiêu biểu</h2>
            </div>
            <button onClick={() => navigate("/women/clothing/women_dress")}
              className="rounded-full border border-stone-300 bg-white px-5 py-2 text-xs font-bold uppercase tracking-wide text-stone-700 hover:border-stone-950 transition">
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {featuredProducts.map((product) => (
              <HomeProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── Promo Banner ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white min-h-[200px] flex flex-col justify-end shadow-xl">
            <div className="absolute top-0 right-0 opacity-20 text-[180px] leading-none">👗</div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-2">Thời trang nữ</p>
            <h3 className="text-2xl font-black mb-1">Mua 2 tặng 1</h3>
            <p className="text-sm text-indigo-200 mb-4">Áp dụng cho tất cả đầm và váy</p>
            <button onClick={() => navigate("/women/clothing/women_dress")}
              className="self-start rounded-full bg-white text-indigo-700 px-5 py-2 text-xs font-bold uppercase tracking-wide hover:bg-indigo-50 transition">
              Mua ngay
            </button>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-8 text-white min-h-[200px] flex flex-col justify-end shadow-xl">
            <div className="absolute top-0 right-0 opacity-20 text-[180px] leading-none">👔</div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-200 mb-2">Thời trang nam</p>
            <h3 className="text-2xl font-black mb-1">Giảm 30%</h3>
            <p className="text-sm text-amber-200 mb-4">Bộ sưu tập áo sơ mi cao cấp</p>
            <button onClick={() => navigate("/men/clothing/shirt")}
              className="self-start rounded-full bg-white text-amber-700 px-5 py-2 text-xs font-bold uppercase tracking-wide hover:bg-amber-50 transition">
              Khám phá
            </button>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a24d24]">Mới nhất</p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">Hàng mới về</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {newArrivals.map((product) => (
              <HomeProductCard key={`new-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── Why Choose Us ── */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a24d24]">Tại sao chọn chúng tôi</p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">Cam kết của LUMINA</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🚚", title: "Giao hàng nhanh", desc: "Miễn phí ship đơn từ 500K. Nhận hàng trong 2-3 ngày làm việc." },
              { icon: "🔄", title: "Đổi trả dễ dàng", desc: "Đổi trả trong vòng 30 ngày nếu sản phẩm có lỗi từ nhà sản xuất." },
              { icon: "💎", title: "Chất lượng cao cấp", desc: "Vải nhập khẩu, may công nghiệp chuẩn xuất khẩu, bền đẹp theo thời gian." },
              { icon: "🔒", title: "Thanh toán an toàn", desc: "Hỗ trợ COD, chuyển khoản, ví điện tử. Bảo mật tuyệt đối." },
            ].map((feat) => (
              <div key={feat.title} className="rounded-2xl border border-stone-100 p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feat.icon}</div>
                <h3 className="font-black text-stone-950 mb-2">{feat.title}</h3>
                <p className="text-sm text-stone-500 leading-6">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brands ── */}
      <section className="py-12 bg-stone-100">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-xs font-bold uppercase tracking-[0.28em] text-stone-400 mb-8">Thương hiệu đối tác</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {brands.map((brand) => (
              <div key={brand.name} className="rounded-xl bg-white border border-stone-200 py-5 px-4 text-center hover:shadow-md transition">
                <p className="font-black text-stone-800 text-base">{brand.name}</p>
                <p className="text-xs text-stone-400 mt-1">{brand.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a24d24]">Khách hàng nói gì</p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">Đánh giá từ khách hàng</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-stone-100 p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-0.5 mb-4">
                  {Array(t.rating).fill(0).map((_, i) => (
                    <span key={i} className="text-amber-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-stone-700 text-sm leading-7 mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-black text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 text-sm">{t.name}</p>
                    <p className="text-xs text-stone-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product sections from DB ── */}
      {groupedSections.length > 0 && (
        <section className="space-y-16 pb-20">
          {groupedSections.map((section) => (
            <HomeProductSection key={section.title} data={section.data} section={section.title} path={section.path} />
          ))}
        </section>
      )}

      {/* ── Newsletter ── */}
      <section className="bg-stone-950 py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f0c7a5] mb-2">Ưu đãi độc quyền</p>
          <h2 className="text-3xl font-black text-white mb-3">Đăng ký nhận tin</h2>
          <p className="text-stone-400 text-sm mb-8">Nhận ngay ưu đãi 10% cho đơn hàng đầu tiên và cập nhật xu hướng mới nhất.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Email của bạn..."
              className="flex-1 rounded-full bg-white/10 border border-white/20 px-5 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-white/50" />
            <button className="rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-wide text-stone-950 hover:bg-[#f0c7a5] transition whitespace-nowrap">
              Đăng ký
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Homepage;
