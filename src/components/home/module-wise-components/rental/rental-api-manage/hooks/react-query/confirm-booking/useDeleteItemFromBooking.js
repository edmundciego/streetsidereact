import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { removeItemFromBookingList } from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";
import { getGuestId, getToken } from "helper-functions/getToken";
import { getApiContent } from "api-manage/getApiContent";

const deleteItem = async (cartId) => {
  // v4.2 wraps the cart payload in the standard envelope; callers feed this
  // straight into `setCartList` and read `.carts` / `.status` off it, so hand
  // back the `{ carts, user_data, status }` payload rather than the envelope.
  if (getToken()) {
    const { data } = await MainApi.delete(
      `${removeItemFromBookingList}/${cartId}`
    );
    return getApiContent(data);
  } else {
    const { data } = await MainApi.delete(
      `${removeItemFromBookingList}/${cartId}?guest_id=${getGuestId()}`
    );
    return getApiContent(data);
  }
};

export default function useDeleteItemFromBooking() {
  return useMutation("delete-all-cart-item_booking", deleteItem);
}
