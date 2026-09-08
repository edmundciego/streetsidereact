import MainApi from "../../MainApi";
import { landing_page_api } from "../../ApiRoutes";
import { useQuery } from "react-query";

const getData = async () => {
  const { data } = await MainApi.get(landing_page_api);
  return data;
};

export default function useGetLandingPage(options = {}) {
  const {
    initialData,
    initialDataUpdatedAt,
    enabled = false,
    ...queryOptions
  } = options;

  return useQuery("landing-page-data", getData, {
    // Most existing consumers explicitly own when this CMS document is
    // fetched. The landing page opts in with its SSR data instead.
    enabled,
    initialData,
    initialDataUpdatedAt,
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnMount: initialData ? false : true,
    ...queryOptions,
  });
}
