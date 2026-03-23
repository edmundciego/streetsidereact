import MainApi from "../MainApi";

const withJsonHeaders = {
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
};

export const digiWalletApi = {
  initiate: (paymentId) =>
    MainApi.get("/api/v1/payment/digiwallet/pay", {
      ...withJsonHeaders,
      params: { payment_id: paymentId },
    }),
  confirmOtp: (payload) =>
    MainApi.post("/api/v1/payment/digiwallet/webhook", payload, withJsonHeaders),
  getStatus: (paymentId) =>
    MainApi.get(`/api/v1/payment/digiwallet/status/${paymentId}`, withJsonHeaders),
  resendOtp: (paymentId) =>
    MainApi.post(
      "/api/v1/payment/digiwallet/resend",
      { payment_id: paymentId },
      withJsonHeaders
    ),
};
