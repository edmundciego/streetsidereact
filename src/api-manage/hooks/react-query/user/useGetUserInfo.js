import MainApi from "../../../MainApi";
import { user_info_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "../../../api-error-response/ErrorResponses";
import { getToken } from "helper-functions/getToken";

const getData = async () => {
  const userToken = getToken();
  if (userToken) {
    const { data } = await MainApi.get(user_info_api);
    return data;
  }
};

export default function useGetUserInfo(handleSuccess, options = {}) {
  const hasToken = Boolean(getToken());

  return useQuery("user-info", () => getData(), {
    // Do not create an anonymous startup query. Authenticated consumers share
    // this key, so React Query still deduplicates profile reads.
    enabled: hasToken,
    staleTime: 10000,
    cacheTime: 5000,
    onSuccess: handleSuccess,
    onError: onSingleErrorResponse,
    ...options,
  });
}
