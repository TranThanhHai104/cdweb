import React from "react";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";

const currency = (value) =>
  Number(value || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) +
  " VND";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const {
    title,
    brand,
    imageUrl,
    price,
    discountedPrice,
    color,
    discountPersent,
  } = product;

  const handleNavigate = () => {
    navigate(`/product/${product?.id || product?._id || 2}`);
  };

  return (
    <button
      type="button"
      onClick={handleNavigate}
      className="productCard group m-3 w-[15rem] overflow-hidden rounded-sm border border-stone-200 bg-white text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="h-[20rem] overflow-hidden bg-stone-100">
        <img
          className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
          src={imageUrl}
          alt={title}
        />
      </div>
      <div className="bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
          {brand}
        </p>
        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-stone-950">
          {title}
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-stone-400">
          {color}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="font-black text-stone-950">{currency(discountedPrice)}</p>
          <p className="text-xs text-stone-400 line-through">{currency(price)}</p>
          <p className="text-xs font-bold text-[#a24d24]">
            {discountPersent}% off
          </p>
        </div>
      </div>
    </button>
  );
};

export default ProductCard;
