import { t } from "i18next"
import toast from "react-hot-toast"
import { OrderApi } from "../api-manage/another-formated-api/orderApi"
import { getInitiatedPaymentData } from "./paymentRedirect"
import { cod_exceeds_message } from "./toasterMessages"

export const buildFailedPaymentCallbackUrl = (origin = "") =>
  `${origin}/profile?page=my-orders`

const getDefaultOrigin = () =>
  typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : ""

const getDefaultStorage = () =>
  typeof window !== "undefined" ? window.localStorage : null

export const initiateFailedPaymentRedirect = async ({
  paymentMethod,
  orderId,
  customerId,
  router,
  orderApi = OrderApi,
  storage = getDefaultStorage(),
  origin = getDefaultOrigin(),
  notifyError = (message) => toast.error(message),
}) => {
  const callback = buildFailedPaymentCallbackUrl(origin)
  const initiatePayload = {
    order_id: orderId,
    customer_id: customerId,
    payment_platform: "web",
    callback,
    payment_method: paymentMethod,
  }

  try {
    const { data } = await orderApi.initiatePayment(initiatePayload)
    const { paymentId, redirectUrl } = getInitiatedPaymentData(data)

    if (!redirectUrl) {
      throw new Error("Missing payment redirect.")
    }

    const isDigiWallet = String(paymentMethod).toLowerCase() === "digiwallet"
    if (isDigiWallet && !paymentId) {
      throw new Error("Missing DigiWallet payment id.")
    }

    if (orderId && paymentId && storage?.setItem) {
      storage.setItem(`pending_payment_${orderId}`, paymentId)
    }

    if (isDigiWallet) {
      await router.push(
        {
          pathname: "/digiwallet-payment",
          query: {
            payment_id: paymentId,
            order_id: orderId,
            callback,
          },
        },
        undefined,
        { shallow: true }
      )
    } else {
      await router.push(redirectUrl, undefined, { shallow: true })
    }

    return {
      callback,
      paymentId,
      redirectUrl,
    }
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      t("Unable to initiate payment.")
    notifyError(message)
    return null
  }
}

export const handleFailedOrderPlace = async ({
  paymentMethod,
  paymentFailedData,
  failPayment,
  handlePayment,
  paymentMethodUpdateMutation,
  walletPaymentMutation,
  profileInfo,
  orderId,
  router,
  orderApi = OrderApi,
  storage = getDefaultStorage(),
  origin = getDefaultOrigin(),
  notifyError = (message) => toast.error(message),
}) => {
  const failedData = paymentFailedData || failPayment

  if (paymentMethod === "cash_on_delivery") {
    if (failedData?.maximum_cod_order_amount > failedData?.order_amount) {
      handlePayment(paymentMethodUpdateMutation)
      return "cash_on_delivery"
    }

    notifyError(cod_exceeds_message)
    return null
  }

  if (paymentMethod === "wallet") {
    handlePayment(walletPaymentMutation)
    return "wallet"
  }

  if (paymentMethod === "offline_payment") {
    await router.push(
      {
        pathname: "/checkout",
        query: {
          page: "cart",
          method: "offline",
          incomplete_payment: true,
          order_id: orderId,
        },
      },
      undefined,
      { shallow: true }
    )

    return "offline_payment"
  }

  return initiateFailedPaymentRedirect({
    paymentMethod,
    orderId,
    customerId: profileInfo?.id,
    router,
    orderApi,
    storage,
    origin,
    notifyError,
  })
}
