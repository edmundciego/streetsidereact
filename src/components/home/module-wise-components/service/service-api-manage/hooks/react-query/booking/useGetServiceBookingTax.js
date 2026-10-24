import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { service_booking_get_tax_api } from "components/home/module-wise-components/service/service-api-manage/ApiRoutes";
import { getApiContent } from "api-manage/getApiContent";

const getServiceBookingTax = async (payload) => {
  const { data: __env } = await MainApi.post(service_booking_get_tax_api, payload);
  const data = getApiContent(__env);
  return data;
};

export default function useGetServiceBookingTax() {
  return useMutation("service-booking-get-tax", getServiceBookingTax);
}
