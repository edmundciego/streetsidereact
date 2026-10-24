import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import {
  comfirm_booking,
  update_location,
} from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";
import { getApiContent } from "api-manage/getApiContent";

const addData = async (postData) => {
  const { data } = await MainApi.put(
    `${update_location}/${postData?.userId}`,
    postData
  );
  // v4.2 wraps the cart payload in the standard envelope; callers feed this
  // straight into `setCartList` and read `.carts` / `.status` off it, so hand
  // back the `{ carts, user_data, status }` payload rather than the envelope.
  return getApiContent(data);
};

export default function usePostLocationUpdate() {
  return useMutation("update_user", addData);
}
