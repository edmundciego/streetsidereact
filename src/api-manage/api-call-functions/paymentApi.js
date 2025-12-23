import MainApi from "api-manage/MainApi";

const JSON_HEADERS = {
  Accept: "application/json",
};

const PaymentApi = {
  initiate: (payload) =>
    MainApi.post("/api/v1/payment/initiate", payload, {
      headers: JSON_HEADERS,
    }),
  getStatus: (paymentId) =>
    MainApi.get(`/api/payment/status/${paymentId}`, {
      headers: JSON_HEADERS,
    }),
};

export default PaymentApi;
