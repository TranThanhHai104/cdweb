import * as React from "react";
import { Grid, TextField, Button, Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../Redux/Auth/Action";
import { useEffect, useState } from "react";

export default function LoginUserForm({ onSwitchMode }) {
  const dispatch = useDispatch();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const { auth } = useSelector((store) => store);

  useEffect(() => {
    if (auth.error) {
      setOpenSnackBar(true);
    }
  }, [auth.error]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {
      email: data.get("email"),
      password: data.get("password"),
    };
    dispatch(login(userData));
  };

  return (
    <React.Fragment>
      <div className="mb-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a24d24]">
          Welcome back
        </p>
        <h2 className="mt-2 text-2xl font-black text-stone-950">Login</h2>
      </div>

      <form className="w-full" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
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
            <TextField
              required
              id="password"
              name="password"
              label="Password"
              fullWidth
              autoComplete="current-password"
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
              {auth.isLoading ? "Logging in..." : "Login"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center py-4">
          <p className="m-0 p-0 text-sm text-stone-600">
            Don't have an account?
          </p>
          <Button onClick={onSwitchMode} className="ml-2" size="small">
            Register
          </Button>
        </div>
      </div>

      <Snackbar
        open={openSnackBar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackBar(false)}
      >
        <Alert
          onClose={() => setOpenSnackBar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {auth.error}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
