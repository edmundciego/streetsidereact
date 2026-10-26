import { useQuery } from "react-query";
import { zoneId_api } from "../../../ApiRoutes";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "../../../api-error-response/ErrorResponses";
import MainApi from "../../../MainApi";
import { getApiContent } from "../../../getApiContent";
import { store } from "redux/store";
import { mergeZoneData } from "redux/slices/zoneData";
const getZoneId = async (location, zoneIdEnabled) => {
  if (
    location?.lat !== undefined &&
    location?.lat !== null &&
    location?.lng !== undefined &&
    location?.lng !== null
  ) {
    const { data } = await MainApi.get(
      `${zoneId_api}?lat=${location?.lat}&lng=${location?.lng}`
    );
    const content = getApiContent(data);
    store.dispatch(mergeZoneData(content?.zone_data));
    return content;
  }
};

export default function useGetZoneId(location, zoneIdEnabled) {
  return useQuery(["zoneId", location], () => getZoneId(location), {
    enabled: zoneIdEnabled,
    //onError: onErrorResponse,
    retry: 0
  });
}
