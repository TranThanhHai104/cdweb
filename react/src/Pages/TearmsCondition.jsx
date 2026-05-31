import React from "react";

const TearmsCondition = () => {
  return (
    <main className="bg-[#f7f3ed] px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl border border-stone-200 bg-white p-8 soft-shadow">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a24d24]">
          Terms
        </p>
        <h1 className="mt-4 text-4xl font-black text-stone-950">
          Terms and Conditions
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-8 text-stone-600">
          <p>
            This application is prepared as a student ecommerce project. Product
            images, payment details, stock, and prices are demo data and can be
            replaced from the admin panel.
          </p>
          <p>
            Users should create an account before checkout. Orders are stored in
            MySQL and can be viewed in the customer account area.
          </p>
          <p>
            Admin access is restricted to users with the ROLE_ADMIN role. Use the
            seeded admin account for classroom demonstrations.
          </p>
        </div>
      </section>
    </main>
  );
};

export default TearmsCondition;
