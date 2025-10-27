import MainApi from "api-manage/MainApi";

const JSON_HEADERS = {
  Accept: "application/json",
};

export const DigiWalletApi = {
  initiate: (params) =>
    MainApi.get("/payment-mobile", {
      params,
      headers: JSON_HEADERS,
    }),
  confirmOtp: (payload) =>
    MainApi.post("/payment/digiwallet/webhook", payload, {
      headers: JSON_HEADERS,
    }),
  resendOtp: (payload) =>
    MainApi.post("/payment/digiwallet/resend", payload, {
      headers: JSON_HEADERS,
    }),
  getStatus: (paymentId) =>
    MainApi.get(`/api/payment/digiwallet/status/${paymentId}`, {
      headers: JSON_HEADERS,
    }),
};

export default DigiWalletApi;
