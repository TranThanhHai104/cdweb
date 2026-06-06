import React from "react";

const Contact = () => {
  return (
    <main className="bg-[#f7f3ed] px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a24d24]">
          Contact
        </p>
        <h1 className="mt-4 text-4xl font-black text-stone-950">
          Support for orders, returns, and styling questions.
        </h1>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["Email", "support@lumina.local", "For order and account support."],
            ["Hotline", "1900 2026", "Available 8:00 - 21:00 every day."],
            ["Studio", "District 1, Ho Chi Minh City", "Demo showroom address."],
          ].map(([title, value, copy]) => (
            <div key={title} className="border border-stone-200 bg-white p-6 soft-shadow">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">
                {title}
              </h2>
              <p className="mt-4 text-xl font-black text-stone-950">{value}</p>
              <p className="mt-3 text-sm leading-7 text-stone-500">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Contact;
