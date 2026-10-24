import MainApi from "api-manage/MainApi";
import { quick_emergency_experts_api, data_limit } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { getApiContent } from "api-manage/getApiContent";

const getData = async ({ offset = 1, preview_count = 4 } = {}) => {
  const { data: __env } = await MainApi.get(
    `${quick_emergency_experts_api}?limit=${data_limit}&offset=${offset}&preview_count=${preview_count}`
  );
  const data = getApiContent(__env);
  return data;
};

export default function useGetQuickEmergencyExperts(params = {}, enabled = true) {
  return useQuery(
    ["quick-emergency-experts", params.offset, params.preview_count],
    () => getData(params),
    {
      staleTime: 1000 * 60 * 5,
      cacheTime: 300000,
      enabled,
      onError: onSingleErrorResponse,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
}
