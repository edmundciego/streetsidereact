
import { useQuery } from "react-query";
import { get_store_reviews } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import MainApi from "api-manage/MainApi";
import { getApiCollection } from "api-manage/getApiContent";


  
  const getData = async (id) => {
    const { data } = await MainApi.get(`${get_store_reviews}/${id}`);
    return getApiCollection(data, "reviews");
  };
  
  export default function useGetProviderReviews(id) {
    return useQuery("tr", () => getData(id), {
      enabled: false,
      onError: onSingleErrorResponse,
    });
  }
  