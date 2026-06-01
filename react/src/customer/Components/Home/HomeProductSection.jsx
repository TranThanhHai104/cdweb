import HomeProductCard from "./HomeProductCard";
import "./HomeProductSection.css";
import { useNavigate } from "react-router-dom";

const HomeProductSection = ({
  section,
  data,
  path = "/men/clothing/mens_kurta",
}) => {
  const navigate = useNavigate();
  const products = data?.slice(0, 10) || [];

  return (
    <div className="relative px-4 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#a24d24]">
            Database category
          </p>
          <h2 className="mt-2 text-2xl font-black text-stone-950">{section}</h2>
        </div>
        <button
          type="button"
          onClick={() => navigate(path)}
          className="hidden rounded-full border border-stone-300 bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-700 transition hover:border-stone-950 hover:text-stone-950 sm:block"
        >
          View all
        </button>
      </div>

      <div className="rounded-sm border border-stone-200 bg-white/70 p-4 soft-shadow sm:p-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((item, index) => (
            <HomeProductCard
              key={`${section}-${item?.title || item?.brand || index}`}
              product={item}
              path={path}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeProductSection;
