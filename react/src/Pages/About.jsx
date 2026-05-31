import React from "react";

const About = () => {
  return (
    <main className="bg-[#f7f3ed] px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a24d24]">
            About the store
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-stone-950 sm:text-5xl">
            A complete fashion ecommerce experience for your final project.
          </h1>
          <p className="mt-6 text-base leading-8 text-stone-600">
            Lumina is designed as a practical web-specialized course project:
            customers can browse collections, inspect products, sign in, manage
            carts, and complete a checkout flow. Admin users can manage products
            and orders from a dedicated dashboard.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            ["Spring Boot API", "JWT security, MySQL persistence, product APIs."],
            ["React Storefront", "Responsive shopping screens and category pages."],
            ["Admin Panel", "Product, order, and customer management screens."],
            ["Demo Data", "Seeded products so the project looks complete fast."],
          ].map(([title, copy]) => (
            <div key={title} className="border border-stone-200 bg-white p-6 soft-shadow">
              <h2 className="text-lg font-black text-stone-950">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-500">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default About;
