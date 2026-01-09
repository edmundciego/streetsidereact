import { useQuery } from "react-query";

import { categories_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const getData = async (searchKey) => {
  if (searchKey && searchKey !== "") {
    return await MainApi.get(`${categories_api}/${searchKey}`);
  } else {
    return await MainApi.get(`${categories_api}`);
  }
};
export const useGetCategories = (
  searchKey,
  handleRequestOnSuccess,
  queryKey
) => {
  return useQuery(
    queryKey ? queryKey : "catogories-list",
    () => getData(searchKey),
    {
      enabled: false,
      onSuccess: handleRequestOnSuccess,
      onError: onErrorResponse,
      cacheTime: 1000 * 60 * 30, // 30 minutes
      staleTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};

const getFeaturedData = async () => {
  return await MainApi.get(`${categories_api}`);
};
export const useGetFeaturedCategories = (handleSuccess) => {
  return useQuery(["featured-categories-lists",getCurrentModuleType()], () => getFeaturedData(), {
     enabled: true,
    cacheTime: 1000 * 60 * 30,   // 30 minutes - keep in memory
    staleTime: 1000 * 60 * 10,   // 10 minutes - don't refetch for 10 min
    refetchOnWindowFocus: false, // Don't refetch when tab regains focus
    refetchOnMount: false,       // Don't refetch when component remounts
    onError: onErrorResponse,
    onSuccess: (data) => {
      if (handleSuccess) {
        handleSuccess(data); // Call handleSuccess if provided
      }
    },
  });
};
