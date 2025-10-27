import { TextField } from "@mui/material";
import React from "react";

const DigiWalletOTP = ({ value, onChange, disabled }) => {
  const handleChange = (event) => {
    const nextValue = event.target.value.replace(/\D/g, "").slice(0, 6);
    onChange(nextValue);
  };

  return (
    <TextField
      value={value}
      onChange={handleChange}
      disabled={disabled}
      fullWidth
      inputProps={{
        inputMode: "numeric",
        pattern: "[0-9]*",
        maxLength: 6,
        style: {
          textAlign: "center",
          letterSpacing: "0.6rem",
          fontSize: "1.5rem",
        },
      }}
    />
  );
};

export default DigiWalletOTP;
