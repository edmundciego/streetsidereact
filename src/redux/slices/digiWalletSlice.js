import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  paymentId: null,
  orderId: null,
  requestId: null,
  amount: null,
  phone: "",
  status: "idle",
  message: null,
  loading: false,
  error: null,
  transactionId: null,
  lastUpdated: null,
};

const digiWalletSlice = createSlice({
  name: "digiWallet",
  initialState,
  reducers: {
    hydrateFromQuery: (state, action) => {
      const { paymentId, orderId, requestId, amount, phone } = action.payload;
      state.paymentId = paymentId ?? state.paymentId;
      state.orderId = orderId ?? state.orderId;
      state.requestId = requestId ?? state.requestId;
      state.amount =
        typeof amount === "number"
          ? amount
          : amount
          ? Number.parseFloat(amount)
          : state.amount;
      state.phone = phone ?? state.phone;
      state.status = action.payload.status ?? "otp_sent";
      state.message = action.payload.message ?? state.message;
      state.error = null;
      state.loading = false;
      state.lastUpdated = new Date().toISOString();
    },
    setStatus: (state, action) => {
      const { status, message, transactionId, requestId } = action.payload;
      state.status = status ?? state.status;
      state.message = message ?? state.message;
      state.transactionId = transactionId ?? state.transactionId;
      state.requestId = requestId ?? state.requestId;
      state.lastUpdated = new Date().toISOString();
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      if (action.payload) {
        state.loading = false;
      }
    },
    resetDigiWallet: () => initialState,
  },
});

export const {
  hydrateFromQuery,
  setStatus,
  setLoading,
  setError,
  resetDigiWallet,
} = digiWalletSlice.actions;

export default digiWalletSlice.reducer;
