import MainApi from "api-manage/MainApi";
import { useQuery } from "react-query";

import {
  onErrorResponse,
  onSingleErrorResponse,
} from "api-manage/api-error-response/ErrorResponses";
import { trip_details } from "../../../ApiRoutes";
import { getGuestId, getToken } from "helper-functions/getToken";
import { getApiContent } from "api-manage/getApiContent";

// Define a standalone fetcher function
const fetchGetTripDetails = async (id) => {
  if (id) {
    const { data } = await MainApi.get(
      `${trip_details}?trip_id=${id}&guest_id=${
        getToken() ? null : getGuestId()
      }`,
      {}
    );
    return getApiContent(data);
  }
};

// Use the fetcher function in useQuery
export const useGetTripDetails = (id) => {
  // The id belongs in the key: without it every trip shares one cache entry,
  // so opening a newly placed trip first renders the previously viewed one —
  // and this key is shared with the track-order copy of the hook.
  return useQuery(["trip-details", id], () => fetchGetTripDetails(id), {
    onError: onSingleErrorResponse, // Prevent refetching when the window regains focus
  });
};
