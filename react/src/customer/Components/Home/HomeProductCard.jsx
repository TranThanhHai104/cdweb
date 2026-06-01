import React from "react";
import { useNavigate } from "react-router-dom";

const currency = (value) =>
  Number(value || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) +
  " VND";

const HomeProductCard = ({ product, path = "/men/clothing/mens_kurta" }) => {
  const navigate = useNavigate();
  const image = product?.imageUrl || product?.image;
  const detailPath = product?.id ? `/product/${product.id}` : path;

  return (
    <button
      type="button"
      onClick={() => navigate(detailPath)}
      className="group w-full cursor-pointer overflow-hidden rounded-sm border border-stone-200 bg-white text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <img
          className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
          src={image}
          alt={product?.title || "Product"}
        />
      </div>

      <div className="p-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#a24d24]">
          {product?.brand || "Lumina"}
        </h3>
        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm font-bold text-stone-950">
          {product?.title}
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-stone-400">
          {product?.color || product?.category?.name || "Curated"}
        </p>

        {product?.discountedPrice || product?.price ? (
          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="font-black text-stone-950">
              {currency(product?.discountedPrice || product?.price)}
            </p>
            {product?.price && product?.discountedPrice ? (
              <p className="text-xs text-stone-400 line-through">
                {currency(product.price)}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </button>
  );
};

export default HomeProductCard;
