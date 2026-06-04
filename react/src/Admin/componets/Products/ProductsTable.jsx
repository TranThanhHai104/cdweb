import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useEffect, useMemo, useState } from "react";
import api from "../../../config/api";

const emptyProduct = {
  imageUrl: "",
  brand: "",
  title: "",
  color: "",
  discountedPrice: "",
  price: "",
  discountPersent: "",
  quantity: "",
  topLavelCategory: "women",
  secondLavelCategory: "clothing",
  thirdLavelCategory: "women_dress",
  description: "",
  sizeS: 10,
  sizeM: 10,
  sizeL: 10,
};

const categoryOptions = [
  { value: "women_dress", label: "Women Dress", top: "women" },
  { value: "top", label: "Women Top", top: "women" },
  { value: "saree", label: "Saree", top: "women" },
  { value: "lengha_choli", label: "Lengha Choli", top: "women" },
  { value: "gouns", label: "Gowns", top: "women" },
  { value: "shirt", label: "Men Shirts", top: "men" },
  { value: "mens_kurta", label: "Mens Kurta", top: "men" },
  { value: "men_jeans", label: "Men Jeans", top: "men" },
];

const currency = (value) => `${Number(value || 0).toLocaleString("vi-VN")} VND`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

const productToForm = (product) => {
  const sizes = product.sizes || [];
  const getSize = (name) =>
    sizes.find((size) => size.name === name)?.quantity || 0;
  const category = product.category?.name || "women_dress";
  const option = categoryOptions.find((item) => item.value === category);

  return {
    imageUrl: product.imageUrl || "",
    brand: product.brand || "",
    title: product.title || "",
    color: product.color || "",
    discountedPrice: product.discountedPrice || "",
    price: product.price || "",
    discountPersent: product.discountPersent || "",
    quantity: product.quantity || "",
    topLavelCategory: option?.top || "women",
    secondLavelCategory: "clothing",
    thirdLavelCategory: category,
    description: product.description || "",
    sizeS: getSize("S"),
    sizeM: getSize("M"),
    sizeL: getSize("L"),
  };
};

const formToRequest = (form) => ({
  imageUrl: form.imageUrl,
  brand: form.brand,
  title: form.title,
  color: form.color,
  discountedPrice: Number(form.discountedPrice),
  price: Number(form.price),
  discountPersent: Number(form.discountPersent),
  quantity: Number(form.quantity),
  topLavelCategory: form.topLavelCategory,
  secondLavelCategory: form.secondLavelCategory,
  thirdLavelCategory: form.thirdLavelCategory,
  description: form.description,
  size: [
    { name: "S", quantity: Number(form.sizeS) },
    { name: "M", quantity: Number(form.sizeM) },
    { name: "L", quantity: Number(form.sizeL) },
  ],
});

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/admin/products/all", {
        headers: getAuthHeaders(),
      });
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return products;
    return products.filter((product) =>
      [product.title, product.brand, product.color, product.category?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [products, search]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setForm(emptyProduct);
    setOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setForm(productToForm(product));
    setOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "thirdLavelCategory") {
        const option = categoryOptions.find((item) => item.value === value);
        next.topLavelCategory = option?.top || "women";
        next.secondLavelCategory = "clothing";
      }
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = formToRequest(form);
      if (editingProduct) {
        await api.put(`/api/admin/products/${editingProduct.id}/update`, payload, {
          headers: getAuthHeaders(),
        });
      } else {
        await api.post("/api/admin/products/", payload, {
          headers: getAuthHeaders(),
        });
      }
      setOpen(false);
      await fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product) => {
    const ok = window.confirm(`Delete product "${product.title}"?`);
    if (!ok) return;
    setLoading(true);
    setError("");
    try {
      await api.delete(`/api/admin/products/${product.id}/delete`, {
        headers: getAuthHeaders(),
      });
      await fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Card sx={{ borderRadius: 0, mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography variant="overline" color="text.secondary">
                Product management
              </Typography>
              <Typography variant="h4" fontWeight={900}>
                Products
              </Typography>
              <Typography color="text.secondary">
                Add, edit, delete, and review real storefront products.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{ borderRadius: 0, bgcolor: "#171717" }}
            >
              Add Product
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 0 }}>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
            <TextField
              label="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              fullWidth
            />
            <Chip
              icon={<Inventory2OutlinedIcon />}
              label={`${products.length} products`}
              sx={{ height: 56, borderRadius: 0, px: 2 }}
            />
          </Stack>

          {error && (
            <Typography sx={{ mb: 2 }} color="error">
              {error}
            </Typography>
          )}

          <TableContainer>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          src={item.imageUrl}
                          variant="rounded"
                          sx={{ width: 58, height: 76, borderRadius: 0 }}
                        />
                        <Box>
                          <Typography fontWeight={800}>{item.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.brand} · {item.color}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{item.category?.name}</TableCell>
                    <TableCell>
                      <Typography fontWeight={800}>
                        {currency(item.discountedPrice)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through" }}
                      >
                        {currency(item.price)}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.discountPersent}%</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell align="right">
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(item)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!loading && filteredProducts.length === 0 && (
            <Typography textAlign="center" color="text.secondary" py={5}>
              No products found.
            </Typography>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingProduct ? "Edit Product" : "Add Product"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12}>
                <TextField
                  label="Image URL"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Brand"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Category"
                  name="thirdLavelCategory"
                  value={form.thirdLavelCategory}
                  onChange={handleChange}
                  fullWidth
                >
                  {categoryOptions.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Color"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Sale Price"
                  name="discountedPrice"
                  value={form.discountedPrice}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Discount %"
                  name="discountPersent"
                  value={form.discountPersent}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Quantity"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Size S stock"
                  name="sizeS"
                  value={form.sizeS}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Size M stock"
                  name="sizeM"
                  value={form.sizeM}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Size L stock"
                  name="sizeL"
                  value={form.sizeL}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  minRows={3}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ borderRadius: 0, bgcolor: "#171717" }}
            >
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProductsTable;
