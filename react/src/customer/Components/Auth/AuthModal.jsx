import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import RegisterUserForm from "./Register";
import LoginUserForm from "./Login";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(92vw, 520px)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AuthModal({ handleClose, open }) {
  const [mode, setMode] = useState("login");
  const { auth } = useSelector((store) => store);

  useEffect(() => {
    if (open) {
      setMode("login");
    }
  }, [open]);

  useEffect(() => {
    if (auth.user) {
      handleClose();
    }
  }, [auth.user, handleClose]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-description"
    >
      <Box className="rounded-md" sx={style}>
        {mode === "login" ? (
          <LoginUserForm onSwitchMode={() => setMode("register")} />
        ) : (
          <RegisterUserForm onSwitchMode={() => setMode("login")} />
        )}
      </Box>
    </Modal>
  );
}
