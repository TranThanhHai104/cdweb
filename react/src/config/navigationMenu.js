export const navigation = {
  categories: [
    {
      id: "women",
      name: "Women",
      featured: [
        {
          name: "New Season Dresses",
          href: "/women/clothing/women_dress",
          imageSrc:
            "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
          imageAlt: "Woman wearing a soft fashion dress.",
        },
        {
          name: "Occasion Edit",
          href: "/women/clothing/lengha_choli",
          imageSrc:
            "https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=900&q=80",
          imageAlt: "Traditional embroidered occasion wear.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", id: "top", href: "/women/clothing/top" },
            {
              name: "Dresses",
              id: "women_dress",
              href: "/women/clothing/women_dress",
            },
            {
              name: "Lengha Choli",
              id: "lengha_choli",
              href: "/women/clothing/lengha_choli",
            },
            { name: "Sarees", id: "saree", href: "/women/clothing/saree" },
            { name: "Gowns", id: "gouns", href: "/women/clothing/gouns" },
            { name: "Kurtas", id: "kurtas", href: "/women/clothing/kurtas" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Bags", id: "bag", href: "/women/accessories/bag" },
            {
              name: "Sunglasses",
              id: "sunglasse",
              href: "/women/accessories/sunglasse",
            },
            { name: "Belts", id: "belt", href: "/women/accessories/belt" },
          ],
        },
        {
          id: "collections",
          name: "Collections",
          items: [
            {
              name: "Workwear",
              id: "workwear",
              href: "/women/clothing/women_dress",
            },
            {
              name: "Wedding Guest",
              id: "wedding_guest",
              href: "/women/clothing/lengha_choli",
            },
            {
              name: "Weekend",
              id: "weekend",
              href: "/women/clothing/top",
            },
          ],
        },
      ],
    },
    {
      id: "men",
      name: "Men",
      featured: [
        {
          name: "Linen Essentials",
          href: "/men/clothing/shirt",
          imageSrc:
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
          imageAlt: "Men linen shirt editorial product photo.",
        },
        {
          name: "Modern Classics",
          href: "/men/clothing/mens_kurta",
          imageSrc:
            "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=900&q=80",
          imageAlt: "Modern menswear outfit.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            {
              name: "Mens Kurtas",
              id: "mens_kurta",
              href: "/men/clothing/mens_kurta",
            },
            { name: "Shirts", id: "shirt", href: "/men/clothing/shirt" },
            {
              name: "Men Jeans",
              id: "men_jeans",
              href: "/men/clothing/men_jeans",
            },
            { name: "T-Shirts", id: "t-shirt", href: "/men/clothing/t-shirt" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", id: "watch", href: "/men/accessories/watch" },
            { name: "Wallets", id: "wallet", href: "/men/accessories/wallet" },
            { name: "Belts", id: "belt", href: "/men/accessories/belt" },
          ],
        },
        {
          id: "collections",
          name: "Collections",
          items: [
            {
              name: "Smart Casual",
              id: "smart_casual",
              href: "/men/clothing/shirt",
            },
            {
              name: "Everyday Denim",
              id: "everyday_denim",
              href: "/men/clothing/men_jeans",
            },
            {
              name: "Festive Wear",
              id: "festive_wear",
              href: "/men/clothing/mens_kurta",
            },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
};
