export const color = [
  "white",
  "Black",
  "Red",
  "marun",
  "Being",
  "Pink",
  "Green",
  "Yellow",
];

export const filters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White" },
      { value: "beige", label: "Beige" },
      { value: "blue", label: "Blue" },
      { value: "brown", label: "Brown" },
      { value: "green", label: "Green" },
      { value: "gray", label: "Gray" },
      { value: "ivory", label: "Ivory" },
      { value: "maroon", label: "Maroon" },
      { value: "purple", label: "Purple" },
      { value: "rose", label: "Rose" },
      {value:"yellow",label:"Yellow"}
    ],
  },

  {
    id: "size",
    name: "Size",
    options: [
      { value: "S", label: "S" },
      { value: "M", label: "M" },
      { value: "L", label: "L" },
    ],
  },
  
];

export const singleFilter=[
  {
    id: "price",
    name: "Price",
    options: [
      { value: "0-500000", label: "0 to 500.000 VND" },
      { value: "500000-1000000", label: "500.000 to 1.000.000 VND" },
      { value: "1000000-1600000", label: "1.000.000 to 1.600.000 VND" },
      { value: "1600000-3000000", label: "1.600.000 to 3.000.000 VND" },
    ],
  },
  {
    id: "discount",
    name: "Discount Range",
    options: [
      {
        value: "10",
        label: "10% And Above",
      },
      { value: "20", label: "20% And Above" },
      { value: "30", label: "30% And Above" },
      { value: "40", label: "40% And Above" },
      { value: "50", label: "50% And Above" },
      { value: "60", label: "60% And Above" },
      { value: "70", label: "70% And Above" },
      { value: "80", label: "80% And Above" },
    ],
  },
  {
    id: "stock",
    name: "Availability",
    options: [
      { value: "in_stock", label: "In Stock" },
      { value: "out_of_stock", label: "Out Of Stock" },
      
    ],
  },
]

export const sortOptions = [
  
  { name: "Price: Low to High", query: "price_low", current: false },
  { name: "Price: High to Low", query: "price_high", current: false },
];
