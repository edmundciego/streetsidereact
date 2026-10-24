import { useQuery } from "react-query";
import { getModuleId } from "helper-functions/getModuleId";
import { provider_banner } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import MainApi from "api-manage/MainApi";
import { getApiList } from "api-manage/getApiContent";

const getBanners = async (id, moduleId) => {
  if (!id || !moduleId) return null;
  const { data } = await MainApi.get(`${provider_banner}/${id}`);
  // The consumer spreads this (`[...bannerData]`), so it must be an array —
  // v4.2 puts the rows at content.data.
  return getApiList(data) ?? [];
};

export default function useGetProviderBanner(id) {
  const moduleId = getModuleId();
  return useQuery(["provider-banners", id, moduleId], () => getBanners(id, moduleId), {
    enabled: Boolean(id) && Boolean(moduleId),
    onError: onSingleErrorResponse,
    retry: false,
  });
}
