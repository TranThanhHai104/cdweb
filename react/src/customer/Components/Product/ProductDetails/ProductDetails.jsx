import { useEffect, useMemo, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Rating, Snackbar } from "@mui/material";
import HomeProductCard from "../../Home/HomeProductCard";
import ProductReviewCard from "./ProductReviewCard";
import { useDispatch, useSelector } from "react-redux";
import { findProductById } from "../../../../Redux/Customers/Product/Action";
import { addItemToCart } from "../../../../Redux/Customers/Cart/Action";
import { getAllReviews } from "../../../../Redux/Customers/Review/Action";
import api from "../../../../config/api";

const fallbackImages = [
  {
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    alt: "Fashion product editorial image",
  },
  {
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    alt: "Fashion store product detail",
  },
  {
    src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    alt: "Fashion dress detail",
  },
];

const fallbackSizes = [
  { name: "S", quantity: 10 },
  { name: "M", quantity: 10 },
  { name: "L", quantity: 10 },
];

const highlights = [
  "Curated for a modern fashion storefront",
  "Responsive product detail layout",
  "Connected to Spring Boot and MySQL data",
  "Editable from the admin dashboard",
];

const currency = (value) =>
  Number(value || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) +
  " VND";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetails() {
  const [selectedSize, setSelectedSize] = useState();
  const [activeImage, setActiveImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cartNoticeOpen, setCartNoticeOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customersProduct } = useSelector((store) => store);
  const { productId } = useParams();
  const jwt = localStorage.getItem("jwt");
  const currentProduct = customersProduct.product;

  useEffect(() => {
    // FIX: Scroll lên đầu trang khi mở trang chi tiết sản phẩm
    window.scrollTo({ top: 0, behavior: "smooth" });
    const data = { productId: Number(productId), jwt };
    dispatch(findProductById(data));
    dispatch(getAllReviews(productId));
  }, [productId, jwt, dispatch]);

  useEffect(() => {
    let mounted = true;

    api
      .get("/api/products/all")
      .then(({ data }) => {
        if (!mounted) return;
        setRelatedProducts(
          (data || []).filter((product) => String(product.id) !== String(productId))
        );
      })
      .catch(() => {
        if (mounted) setRelatedProducts([]);
      });

    return () => {
      mounted = false;
    };
  }, [productId]);

  const galleryImages = useMemo(() => {
    if (!currentProduct?.imageUrl) {
      return fallbackImages;
    }
    return [
      { src: currentProduct.imageUrl, alt: currentProduct.title },
      ...fallbackImages,
    ];
  }, [currentProduct]);

  const availableSizes =
    currentProduct?.sizes?.length > 0 ? currentProduct.sizes : fallbackSizes;

  const similarProducts = useMemo(() => {
    const currentCategory = currentProduct?.category?.name;
    const sameCategory = relatedProducts.filter(
      (product) => product.category?.name === currentCategory
    );
    return (sameCategory.length ? sameCategory : relatedProducts).slice(0, 8);
  }, [currentProduct, relatedProducts]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!jwt) {
      alert("Please sign in before adding products to your cart.");
      return;
    }
    const sizeName = selectedSize?.name || availableSizes[0]?.name || "M";
    const data = { productId, size: sizeName, quantity: 1 };
    dispatch(addItemToCart({ data, jwt }));
    setCartNoticeOpen(true);
  };

  return (
    <main className="bg-[#f7f3ed] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <nav className="mb-8 text-sm text-stone-500">
          <button onClick={() => navigate("/")} className="hover:text-stone-950">
            Home
          </button>
          <span className="px-2">/</span>
          <button
            onClick={() =>
              navigate(`/${currentProduct?.category?.parentCategory?.parentCategory?.name || "men"}/${currentProduct?.category?.parentCategory?.name || "clothing"}/${currentProduct?.category?.name || "shirt"}`)
            }
            className="capitalize hover:text-stone-950"
          >
            {currentProduct?.category?.name || "Product"}
          </button>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="overflow-hidden rounded-sm border border-stone-200 bg-white soft-shadow">
              <img
                src={activeImage?.src || galleryImages[0]?.src}
                alt={activeImage?.alt || currentProduct?.title || "Product"}
                className="h-[34rem] w-full object-cover object-top"
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {galleryImages.map((image) => (
                <button
                  type="button"
                  key={image.src}
                  onClick={() => setActiveImage(image)}
                  className="h-24 overflow-hidden rounded-sm border border-stone-200 bg-white"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover object-top"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="border border-stone-200 bg-white p-6 soft-shadow lg:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a24d24]">
              {currentProduct?.brand || "Lumina"}
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-stone-950">
              {currentProduct?.title || "Loading product..."}
            </h1>
            <p className="mt-4 text-sm uppercase tracking-[0.2em] text-stone-400">
              {currentProduct?.color || "Curated color"}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <p className="text-2xl font-black text-stone-950">
                {currency(currentProduct?.discountedPrice)}
              </p>
              <p className="text-stone-400 line-through">
                {currency(currentProduct?.price)}
              </p>
              <p className="rounded-full bg-[#f0c7a5] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-stone-950">
                {currentProduct?.discountPersent || 0}% off
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Rating name="read-only" value={4.6} precision={0.5} readOnly />
              <p className="text-sm text-stone-500">
                4.6 average customer rating
              </p>
            </div>

            <p className="mt-8 text-base leading-8 text-stone-600">
              {currentProduct?.description ||
                "Product details are loading from the backend."}
            </p>

            <form className="mt-8" onSubmit={handleSubmit}>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-stone-950">
                  Size
                </h2>
                <span className="text-xs text-stone-500">
                  {currentProduct?.quantity || 0} items in stock
                </span>
              </div>

              <RadioGroup
                value={selectedSize}
                onChange={setSelectedSize}
                className="mt-4"
              >
                <RadioGroup.Label className="sr-only">
                  Choose a size
                </RadioGroup.Label>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {availableSizes.map((size) => {
                    const inStock = size.quantity > 0;
                    return (
                      <RadioGroup.Option
                        key={size.name}
                        value={size}
                        disabled={!inStock}
                        className={({ active, checked }) =>
                          classNames(
                            inStock
                              ? "cursor-pointer bg-white text-stone-950"
                              : "cursor-not-allowed bg-stone-100 text-stone-300",
                            active || checked
                              ? "border-stone-950 ring-1 ring-stone-950"
                              : "border-stone-200",
                            "flex items-center justify-center rounded-sm border px-4 py-3 text-sm font-bold uppercase transition"
                          )
                        }
                      >
                        {size.name}
                      </RadioGroup.Option>
                    );
                  })}
                </div>
              </RadioGroup>

              <Button
                variant="contained"
                type="submit"
                sx={{
                  mt: 4,
                  px: 5,
                  py: 1.4,
                  bgcolor: "#171717",
                  borderRadius: 0,
                  fontWeight: 800,
                  letterSpacing: ".16em",
                  "&:hover": { bgcolor: "#a24d24" },
                }}
              >
                Add To Cart
              </Button>
            </form>

            <div className="mt-10 border-t border-stone-200 pt-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-stone-950">
                Highlights
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-stone-600">
                {highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#a24d24]" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl border border-stone-200 bg-white p-6 soft-shadow">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-xl font-black text-stone-950">
              Recent Reviews and Ratings
            </h2>
            <div className="mt-6 space-y-5">
              {currentProduct?.reviews?.length ? (
                currentProduct.reviews.map((item) => (
                  <ProductReviewCard key={item.id} item={item} />
                ))
              ) : (
                <p className="text-sm leading-7 text-stone-500">
                  No reviews yet. This keeps the first database clean while the
                  storefront is still ready for customer reviews.
                </p>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-950">
              Product Ratings
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <Rating name="read-only" value={4.6} precision={0.5} readOnly />
              <p className="text-sm text-stone-500">Customer score</p>
            </div>
            <div className="mt-6 space-y-4 text-sm">
              {["Excellent", "Very Good", "Good", "Average", "Poor"].map(
                (label, index) => (
                  <div key={label} className="grid grid-cols-[6rem_1fr_3rem] items-center gap-3">
                    <span className="text-stone-600">{label}</span>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                      <div
                        className="h-full rounded-full bg-[#a24d24]"
                        style={{ width: `${[70, 52, 34, 20, 8][index]}%` }}
                      />
                    </div>
                    <span className="text-right text-stone-400">
                      {[128, 74, 39, 12, 4][index]}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl">
        <h2 className="mb-6 text-2xl font-black text-stone-950">
          Similar Products
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {similarProducts.map((item) => (
            <HomeProductCard
              key={item.id}
              product={item}
            />
          ))}
        </div>
      </section>
      <Snackbar
        open={cartNoticeOpen}
        autoHideDuration={2200}
        onClose={() => setCartNoticeOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={() => setCartNoticeOpen(false)}>
          Đã thêm vào giỏ hàng
        </Alert>
      </Snackbar>
    </main>
  );
}
