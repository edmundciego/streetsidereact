import MainApi from "../../../MainApi";
import { new_arrival_stores_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";
import {getModuleId} from "helper-functions/getModuleId";

const getData = async (pageParams) => {
  // Backend paginates with default limit 50 (each row = withOpen + counts +
  // full store formatting). Homepage carousels show ~6-12, so cap it here —
  // no Laravel change needed.
  const { offset = 1, type, limit = 12 } = pageParams || {};
  const { data } = await MainApi.get(
    `${new_arrival_stores_api}?type=${type}&limit=${limit}&offset=${offset}`
  );
  return data;
};

export default function useGetNewArrivalStores(pageParams) {
  return useQuery(["new-arrival-stores", pageParams?.type, getModuleId(), pageParams?.limit ?? 12], () => getData(pageParams), {
    enabled: true,
      cacheTime: 1000 * 60 * 5,   // 5 minutes
      staleTime: 1000 * 60 * 4,   // 4 minutes
    onError: onErrorResponse,
  });
}