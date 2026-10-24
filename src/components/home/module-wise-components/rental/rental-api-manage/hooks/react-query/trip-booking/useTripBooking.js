import { useMutation } from "react-query";
import { trip_booking } from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";
import MainApi from "api-manage/MainApi";

import { getApiContent } from "api-manage/getApiContent";

// Mutation payloads (tax, surge price, order id, redirect_link) live in
// `content` while `message` stays on the envelope and some handlers toast it.
// Expose both, payload winning. Only success responses reach here — axios
// rejects on failure, so error.response.data.message is untouched.
const unwrapPayload = (envelope) => {
  const content = getApiContent(envelope);
  const isObject =
    !!content && typeof content === "object" && !Array.isArray(content);
  return isObject ? { message: envelope?.message, ...content } : content;
};


const orderPlace = async (orderData) => {
  const { data } = await MainApi.post(`${trip_booking}`, orderData);
  return unwrapPayload(data);
};
export const useTripBooking = () => {
  return useMutation("trip-booking", orderPlace);
};
