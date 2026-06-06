import { Link } from "react-router-dom";

const footerGroups = [
  {
    title: "Shop",
    links: [
      ["Women", "/women/clothing/women_dress"],
      ["Men", "/men/clothing/shirt"],
      ["Saree", "/women/clothing/saree"],
      ["Kurta", "/men/clothing/mens_kurta"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Contact", "/contact"],
      ["Privacy", "/privacy-policy"],
      ["Terms", "/terms-condition"],
    ],
  },
  {
    title: "Account",
    links: [
      ["Cart", "/cart"],
      ["Orders", "/account/order"],
      ["Search", "/products/search"],
      ["Admin", "/admin"],
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#171717] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1.4fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-black tracking-widest text-stone-950">
              LM
            </span>
            <div>
              <p className="text-xl font-black tracking-[0.28em]">LUMINA</p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone-400">
                Fashion Studio
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-md text-sm leading-7 text-stone-400">
            A refined fashion ecommerce demo built with React, Spring Boot,
            MySQL, JWT authentication, cart, checkout, and admin management.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-bold uppercase tracking-[0.24em] text-[#f0c7a5]">
                {group.title}
              </h2>
              <div className="mt-5 space-y-3">
                {group.links.map(([label, href]) => (
                  <Link
                    key={label}
                    to={href}
                    className="block text-sm text-stone-400 transition hover:text-white"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs uppercase tracking-[0.22em] text-stone-500">
        2026 Lumina Fashion Studio. Student project demo.
      </div>
    </footer>
  );
};

export default Footer;
