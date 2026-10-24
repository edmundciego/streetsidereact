import MainApi from "api-manage/MainApi";
import { related_provider_services_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { getApiList } from "api-manage/getApiContent";

const getData = async (serviceId) => {
  const { data: __env } = await MainApi.get(
    `${related_provider_services_api}/${serviceId}`
  );
  const data = getApiList(__env);
  return data;
};

export default function useGetRelatedProviderServices(serviceId, enabled = true) {
  return useQuery(
    ["related-provider-services", serviceId],
    () => getData(serviceId),
    {
      staleTime: 1000 * 60 * 5,
      cacheTime: 300000,
      enabled: enabled && !!serviceId,
      onError: onSingleErrorResponse,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
}
