import MainApi from "../../MainApi";
import { categories_details_api } from "../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../api-error-response/ErrorResponses";

const getData = async ({ categoryId, page_limit, offset, type }) => {
  const { data } = await MainApi.get(
    `${categories_details_api}/${categoryId}?limit=${page_limit}&offset=${offset}&type=${type}`
  );
  return data;
};

export default function useGetFeatureCategoriesProducts(pageParams,handleDataSuccess) {
  return useQuery(
    ["categories-details-items", pageParams.categoryId, pageParams.page_limit, pageParams.offset, pageParams.type], 
    () => getData(pageParams), 
    {
      enabled: !!pageParams.categoryId,
      onError: onSingleErrorResponse,
      staleTime: 1000 * 60 * 10, // 10 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onSuccess: handleDataSuccess,
    }
  );
}
