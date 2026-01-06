import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  paymentId: null,
  orderId: null,
  requestId: null,
  amount: null,
  phone: null,
  callback: null,
  status: "idle",
  message: "",
  error: "",
};

const digiWalletSlice = createSlice({
  name: "digiWallet",
  initialState,
  reducers: {
    hydrateFromQuery(state, action) {
      const payload = action.payload || {};
      state.paymentId = payload.paymentId || payload.payment_id || state.paymentId;
      state.orderId = payload.orderId || payload.order_id || state.orderId;
      state.requestId = payload.requestId || payload.request_id || state.requestId;
      state.amount = payload.amount || state.amount;
      state.phone = payload.phone || state.phone;
      state.callback = payload.callback || state.callback;
      state.status = state.paymentId ? "ready" : state.status;
      state.message = payload.message || state.message;
      state.error = "";
    },
    setRequestId(state, action) {
      state.requestId = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setMessage(state, action) {
      state.message = action.payload || "";
    },
    setError(state, action) {
      state.error = action.payload || "";
    },
    resetDigiWallet(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  hydrateFromQuery,
  setRequestId,
  setStatus,
  setMessage,
  setError,
  resetDigiWallet,
} = digiWalletSlice.actions;

export default digiWalletSlice.reducer;
