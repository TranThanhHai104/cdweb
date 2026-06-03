import React from "react";
import { Stepper, Step, StepLabel, Box, Button } from "@mui/material";
import AddDeliveryAddressForm from "./AddAddress";
import OrderSummary from "./OrderSummary";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const steps = ["Đăng nhập", "Địa chỉ giao hàng", "Xác nhận & Thanh toán"];

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const stepParam = parseInt(new URLSearchParams(location.search).get("step") || "2");
  const activeStep = Math.min(Math.max(stepParam - 1, 0), steps.length - 1);

  const handleBack = () => {
    if (stepParam === 3) {
      navigate("/checkout?step=2");
    } else if (stepParam === 2) {
      navigate("/cart");
    }
  };

  return (
    <Box sx={{ width: "100%", px: { xs: 2, lg: 16 }, py: 3 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {stepParam > 1 && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          variant="outlined"
          size="small"
          sx={{ mb: 3, textTransform: "none", borderRadius: 2 }}
        >
          {stepParam === 3 ? "Quay lại địa chỉ" : "Quay lại giỏ hàng"}
        </Button>
      )}

      {stepParam === 2 ? <AddDeliveryAddressForm /> : <OrderSummary />}
    </Box>
  );
}
