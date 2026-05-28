import React from "react";

const PrivacyPolicy = () => {
  return (
    <main className="bg-[#f7f3ed] px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl border border-stone-200 bg-white p-8 soft-shadow">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a24d24]">
          Privacy
        </p>
        <h1 className="mt-4 text-4xl font-black text-stone-950">
          Privacy Policy
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-8 text-stone-600">
          <p>
            This demo stores only the information required for ecommerce flows:
            account details, addresses, carts, orders, reviews, and payment
            status. Passwords are encrypted before being saved.
          </p>
          <p>
            Product browsing is public. Cart, checkout, order, review, and admin
            features require authentication with a JWT token.
          </p>
          <p>
            Payment integration is configured as a demo feature. Replace payment
            keys with your own provider credentials before using it in a real
            environment.
          </p>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
