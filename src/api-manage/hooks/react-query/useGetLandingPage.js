import MainApi from "../../MainApi";
import { landing_page_api } from "../../ApiRoutes";
import { getApiContent } from "../../getApiContent";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setLandingPage } from "redux/slices/storedData";
import useIsRehydrated from "hooks/useIsRehydrated";

const getData = async () => {
  const { data } = await MainApi.get(landing_page_api);
  return getApiContent(data);
};

const STALE_TIME = 1000 * 60 * 15;

// Four components consume this (page, LandingLayout, footer, home). With
// `enabled: false` each had to call refetch() on mount, and refetch() ignores
// staleTime — so the same landing payload was fetched four times per page load.
// One shared, enabled query fixes that within a session.
//
// React Query's cache is memory-only, so the CMS payload is also mirrored into
// redux (`storedData` survives redux-persist). On a reload, Redux rehydration
// may finish after this query is created; in that case the persisted copy is
// returned as `data` while it is still fresh. Server-provided landing data is
// available on the first render and seeds the shared query directly.
export default function useGetLandingPage({ initialData } = {}) {
  const dispatch = useDispatch();
  const isRehydrated = useIsRehydrated();
  const cached = useSelector((state) => state.storedData?.landingPage);

  const cachedData = cached?.data ?? undefined;
  const cachedIsStale =
    !cachedData ||
    !cached?.fetchedAt ||
    Date.now() - cached.fetchedAt > STALE_TIME;

  // The landing route already fetches this CMS document during SSR. Seed the
  // shared query from that response so the first HTML render can show the page
  // immediately instead of waiting for redux-persist and a duplicate request.
  const queryInitialData = initialData ?? cachedData;
  const queryInitialDataUpdatedAt = initialData ? undefined : cached?.fetchedAt;

  useEffect(() => {
    if (!initialData) return;
    dispatch(setLandingPage({ data: initialData, fetchedAt: Date.now() }));
  }, [dispatch, initialData]);

  const query = useQuery("landing-page-data", getData, {
    // Until rehydration lands the store still holds initialState, so deciding
    // now would discard the persisted copy and refetch on every reload.
    enabled: isRehydrated && cachedIsStale,
    initialData: queryInitialData,
    initialDataUpdatedAt: queryInitialDataUpdatedAt,
    staleTime: STALE_TIME,
    cacheTime: 1000 * 60 * 30,
    onSuccess: (data) => {
      if (data) dispatch(setLandingPage({ data, fetchedAt: Date.now() }));
    },
  });

  return { ...query, data: query.data ?? cachedData };
}
