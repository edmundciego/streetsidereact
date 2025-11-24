import MainApi, { baseUrl } from "api-manage/MainApi";
import axios from "axios";
import PaymentApi from "./paymentApi";

const JSON_HEADERS = {
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest",
};

export const DigiWalletApi = {
  initiate: (payload) => PaymentApi.initiate(payload),
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
  triggerPay: async (redirectUrl) => {
    if (!redirectUrl) {
      throw new Error("Missing redirect URL for DigiWallet payment");
    }

    let resolvedUrl = redirectUrl;
    if (baseUrl && redirectUrl.startsWith(baseUrl)) {
      resolvedUrl = redirectUrl.slice(baseUrl.length);
      if (!resolvedUrl.startsWith("/")) {
        resolvedUrl = `/${resolvedUrl}`;
      }
      return MainApi.get(resolvedUrl, {
        headers: JSON_HEADERS,
        withCredentials: true,
      });
    }

    return axios.get(redirectUrl, {
      headers: JSON_HEADERS,
      withCredentials: true,
      withXSRFToken: true,
    });
  },
};

export default DigiWalletApi;
