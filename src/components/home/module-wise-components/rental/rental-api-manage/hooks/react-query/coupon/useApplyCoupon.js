import MainApi from "api-manage/MainApi";
import { getApiContent } from "api-manage/getApiContent";

export const CouponApi = {
  applyCoupon: (code, store_id) =>
    MainApi.get(
      `/api/v1/rental/coupon/apply?code=${code}&provider_id=${store_id}`
    ).then((r) => ({ ...r, data: getApiContent(r?.data) })),
};
