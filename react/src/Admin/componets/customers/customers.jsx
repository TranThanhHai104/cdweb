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
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { useEffect, useMemo, useState } from "react";
import api from "../../../config/api";

const emptyCustomer = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  role: "ROLE_CUSTOMER",
  password: "",
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form, setForm] = useState(emptyCustomer);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/admin/users", {
        headers: getAuthHeaders(),
      });
      setCustomers(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return customers;
    return customers.filter((customer) =>
      [
        customer.firstName,
        customer.lastName,
        customer.email,
        customer.mobile,
        customer.role,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [customers, search]);

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setForm(emptyCustomer);
    setOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setForm({
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
      email: customer.email || "",
      mobile: customer.mobile || "",
      role: customer.role || "ROLE_CUSTOMER",
      password: "",
    });
    setOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editingCustomer) {
        await api.put(`/api/admin/users/${editingCustomer.id}`, form, {
          headers: getAuthHeaders(),
        });
      } else {
        await api.post("/api/admin/users", form, {
          headers: getAuthHeaders(),
        });
      }
      setOpen(false);
      await fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customer) => {
    const ok = window.confirm(
      `Delete customer "${customer.firstName} ${customer.lastName}"?`
    );
    if (!ok) return;
    setLoading(true);
    setError("");
    try {
      await api.delete(`/api/admin/users/${customer.id}`, {
        headers: getAuthHeaders(),
      });
      await fetchCustomers();
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
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="overline" color="text.secondary">
                Customer management
              </Typography>
              <Typography variant="h4" fontWeight={900}>
                Customers
              </Typography>
              <Typography color="text.secondary">
                Add, edit, delete, and review customer accounts.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{ borderRadius: 0, bgcolor: "#171717" }}
            >
              Add Customer
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 0 }}>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
            <TextField
              label="Search customers"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              fullWidth
            />
            <Chip
              icon={<PeopleAltOutlinedIcon />}
              label={`${customers.length} customers`}
              sx={{ height: 56, borderRadius: 0, px: 2 }}
            />
          </Stack>

          {error && (
            <Typography sx={{ mb: 2 }} color="error">
              {error}
            </Typography>
          )}

          <TableContainer>
            <Table sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((item) => (
                  <TableRow hover key={item.id}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: "#171717" }}>
                          {item.firstName?.[0]?.toUpperCase() || "U"}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={800}>
                            {item.firstName} {item.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID #{item.id}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.mobile || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.role === "ROLE_ADMIN" ? "Admin" : "Customer"}
                        color={item.role === "ROLE_ADMIN" ? "primary" : "default"}
                        size="small"
                      />
                    </TableCell>
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

          {!loading && filteredCustomers.length === 0 && (
            <Typography textAlign="center" color="text.secondary" py={5}>
              No customers found.
            </Typography>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingCustomer ? "Edit Customer" : "Add Customer"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Mobile"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="ROLE_CUSTOMER">Customer</MenuItem>
                  <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={
                    editingCustomer
                      ? "New password (leave blank to keep current)"
                      : "Password"
                  }
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required={!editingCustomer}
                  fullWidth
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
              {editingCustomer ? "Save Changes" : "Create Customer"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Customers;
