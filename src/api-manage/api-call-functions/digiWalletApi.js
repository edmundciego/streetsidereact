import MainApi from "../MainApi";

const withJsonHeaders = {
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
};

export const digiWalletApi = {
  initiate: (paymentId) =>
    MainApi.get("/payment/digiWallet/pay", {
      ...withJsonHeaders,
      params: { payment_id: paymentId },
    }),
  confirmOtp: (payload) =>
    MainApi.post("/payment/digiWallet/webhook", payload, withJsonHeaders),
  getStatus: (paymentId) =>
    MainApi.get(`/api/v1/payment/digiwallet/status/${paymentId}`, withJsonHeaders),
  resendOtp: (paymentId) =>
    MainApi.post(
      "/payment/digiwallet/resend",
      { payment_id: paymentId },
      withJsonHeaders
    ),
};
