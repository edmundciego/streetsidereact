import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { make_payment } from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";
import { getApiContent } from "api-manage/getApiContent";

// v4.2 wraps the payload in `content` — a digital payment answers with
// `{ redirect_link }` for the browser to follow, cash/wallet with the settled
// trip — while `message` stays on the envelope and the callers toast it. Hand
// back both, payload winning, the same way `useTripBooking` does. Only success
// responses reach here; axios rejects on failure, so the error handlers still
// read `error.response.data.message`.
const addData = async (postData) => {
  const { data } = await MainApi.post(make_payment, postData);
  const content = getApiContent(data);
  const isObject =
    !!content && typeof content === "object" && !Array.isArray(content);
  return isObject ? { message: data?.message, ...content } : content;
};

export default function useMakePayment() {
  return useMutation("make_payment", addData);
}
