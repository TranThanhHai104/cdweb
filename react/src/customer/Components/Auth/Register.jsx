import {
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../Redux/Auth/Action";
import { useEffect, useState } from "react";

export default function RegisterUserForm({ onSwitchMode }) {
  const dispatch = useDispatch();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const { auth } = useSelector((store) => store);

  useEffect(() => {
    if (auth.registrationSuccess || auth.error) {
      setOpenSnackBar(true);
    }
  }, [auth.registrationSuccess, auth.error]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const userData = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
      role: data.get("role") || "ROLE_CUSTOMER",
    };
    dispatch(register(userData));
  };

  const handleClose = () => setOpenSnackBar(false);

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a24d24]">
          Create account
        </p>
        <h2 className="mt-2 text-2xl font-black text-stone-950">Register</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="firstName"
              name="firstName"
              label="First Name"
              fullWidth
              autoComplete="given-name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="lastName"
              name="lastName"
              label="Last Name"
              fullWidth
              autoComplete="family-name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="email"
              name="email"
              label="Email"
              fullWidth
              autoComplete="email"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                label="Role"
                name="role"
                defaultValue="ROLE_CUSTOMER"
              >
                <MenuItem value="ROLE_CUSTOMER">Customer</MenuItem>
                <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              id="password"
              name="password"
              label="Password"
              fullWidth
              autoComplete="new-password"
              type="password"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              className="w-full"
              type="submit"
              variant="contained"
              size="large"
              disabled={auth.isLoading}
              sx={{
                padding: ".8rem 0",
                bgcolor: "#171717",
                borderRadius: 0,
                fontWeight: 800,
                letterSpacing: ".14em",
                "&:hover": { bgcolor: "#a24d24" },
              }}
            >
              {auth.isLoading ? "Registering..." : "Register"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center py-4">
          <p className="m-0 p-0 text-sm text-stone-600">
            Already have an account?
          </p>
          <Button onClick={onSwitchMode} className="ml-2" size="small">
            Login
          </Button>
        </div>
      </div>

      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={auth.error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {auth.error || auth.successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
