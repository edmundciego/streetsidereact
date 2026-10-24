import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { service_details_api } from "./ApiRoutes";
import { getApiContent } from "api-manage/getApiContent";

// Mirrors useGetItemDetails, but against the service module's own details
// endpoint (`/api/v1/service/details/{id}`) — mart's `item_details_api`
// 404s for a service_id, since services aren't stored as items.
export const getServiceItemDetailsData = async (params) => {
  const { id, campaign } = params;
  const tempUrl = campaign
    ? `${service_details_api}/${id}?campaign=${campaign}`
    : `${service_details_api}/${id}`;
  const { data } = await MainApi.get(tempUrl);
  return getApiContent(data);
};

export const useGetServiceItemDetails = (params) => {
  const queryKey = ["service-item-details", params?.id, params?.campaign];
  return useQuery(queryKey, () => getServiceItemDetailsData(params), {
    enabled: Boolean(params?.id),
    retry: false,
    cacheTime: 30000,
    staleTime: 30000,
  });
};
