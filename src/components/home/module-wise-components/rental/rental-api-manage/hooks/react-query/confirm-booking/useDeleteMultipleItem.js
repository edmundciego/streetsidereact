import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { remove_multiple_cart } from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";
import { getGuestId } from "helper-functions/getToken";
import { getApiContent } from "api-manage/getApiContent";

const addData = async (postData) => {
  const { data } = await MainApi.delete(
    `${remove_multiple_cart}?cart_ids=${JSON.stringify(
      postData
    )}&guest_id=${getGuestId()}`
  );
  // v4.2 wraps the cart payload in the standard envelope; callers feed this
  // straight into `setCartList` and read `.carts` / `.status` off it, so hand
  // back the `{ carts, user_data, status }` payload rather than the envelope.
  return getApiContent(data);
};

export default function useDeleteMultipleItem() {
  return useMutation("delete_items", addData);
}
