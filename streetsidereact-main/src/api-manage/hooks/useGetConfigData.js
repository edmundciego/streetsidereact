import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { config_api } from "api-manage/ApiRoutes";
export const getData = async () => {
  const { data } = await MainApi.get(config_api);
  return data;
};
export const useGetConfigData = (options = {}) => {
  const {
    initialData,
    initialDataUpdatedAt,
    enabled = false,
    ...queryOptions
  } = options;

  return useQuery("getConfig", () => getData(), {
    enabled,
    initialData,
    initialDataUpdatedAt,
    staleTime: 60 * 1000,
    onError: onSingleErrorResponse,
    retry: 1,
    cacheTime: 5 * 60 * 1000,
    refetchOnMount: initialData ? false : true,
    ...queryOptions,
  });
};
