import { useInfiniteQuery, useQuery } from "react-query";
import MainApi from "../../../MainApi";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "../../../api-error-response/ErrorResponses";
import {getCurrentModuleType} from "helper-functions/getCurrentModuleType";
import {popular_provider, popular_store_api} from "../../../ApiRoutes";
const getPopularStore = async (type, limit = 12, offset = 1) => {
  // Same as new-arrival: backend defaults to limit 50, carousels need ~12.
  const { data } = await MainApi.get(
    `${popular_store_api}?type=${type}&limit=${limit}&offset=${offset}`
  );
  return data;
};
const getPopularStoreInfiniteScroll = async (pageParams) => {
  const { type, limit, offset, pageParam } = pageParams;
  const { data } = await MainApi.get(
    `${getCurrentModuleType() === "rental"?popular_provider:popular_store_api}?type=${type}&offset=${pageParam}&limit=${limit}`
  );
  return data;
};

export default function useGetPopularStore(pageParams) {
  return useInfiniteQuery(
    [pageParams?.searchKey, pageParams?.type],
    ({ pageParam = 1 }) =>
      getPopularStoreInfiniteScroll({ ...pageParams, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const maxPages = lastPage.total_size / pageParams?.limit;
        const nextPage = allPages.length + 1;
        return lastPage?.stores?.length > 0 ? nextPage : undefined;
      },
      retry: 1,
      enabled: false,
      onError: onErrorResponse,
    }
  );
}

export function useGetPopularStoreWithoutInfiniteScroll(pageParams) {
  return useQuery(
    [pageParams?.searchKey, pageParams?.type, pageParams?.limit ?? 12],
    () =>
      getPopularStore(
        pageParams?.type,
        pageParams?.limit ?? 12,
        pageParams?.offset ?? 1
      ),
    {
      enabled: false,
      staleTime: 1000 * 60 * 4, // share cache with sibling sections
      cacheTime: 1000 * 60 * 10,
      onError: onErrorResponse,
    }
  );
}
