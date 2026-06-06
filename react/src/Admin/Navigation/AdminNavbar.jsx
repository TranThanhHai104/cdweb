import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import {
  AppBar,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar({ handleSideBarViewInMobile }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/");
    window.location.reload();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (muiTheme) => muiTheme.zIndex.drawer + 1,
          bgcolor: "#171717",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          {!isLargeScreen && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={handleSideBarViewInMobile}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                display: "grid",
                width: 38,
                height: 38,
                placeItems: "center",
                border: "1px solid rgba(255,255,255,0.35)",
                bgcolor: "#f0c7a5",
                color: "#171717",
                fontWeight: 900,
              }}
            >
              L
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={900} lineHeight={1.1}>
                LUMINA Admin
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.68)" }}>
                Products, customers, and orders
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Chip
              icon={<AccountCircle />}
              label="Admin"
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                bgcolor: "rgba(255,255,255,0.1)",
                color: "#fff",
                "& .MuiChip-icon": { color: "#f0c7a5" },
              }}
            />
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                border: "1px solid rgba(255,255,255,0.24)",
                borderRadius: 0,
                px: 2,
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
