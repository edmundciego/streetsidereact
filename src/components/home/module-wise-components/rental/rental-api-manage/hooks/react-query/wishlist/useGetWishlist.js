import { useQuery } from "react-query";
import { wishlist_api } from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";
import MainApi from "api-manage/MainApi";
import { getApiContent } from "api-manage/getApiContent";

export const WishList = async () => {
  const { data } = await MainApi.get(`${wishlist_api}`);
  return getApiContent(data);
};

export const useGetWishList = (onSuccessHandler) => {
  return useQuery("get-rental-wishlist", () => WishList(), {
    enabled: false,
    retry: false,
    onSuccess: onSuccessHandler,
  });
};
