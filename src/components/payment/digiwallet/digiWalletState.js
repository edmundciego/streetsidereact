const DIGIWALLET_SUCCESS_STATES = ["SUCCESS", "COMPLETED", "PAID", "APPROVED"]
const DIGIWALLET_FAILED_STATES = [
  "FAILED",
  "ERROR",
  "REJECTED",
  "CANCELLED",
  "INSUFFICIENT_FUNDS",
  "INVALID_MOBILE",
  "OTP_ALREADY_USED",
]

const getMessageFromPayload = (data, fallback) =>
  data?.message ||
  data?.errors?.[0]?.message ||
  data?.error ||
  data?.status ||
  fallback

export const getDigiWalletErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors?.[0]?.message ||
  error?.message ||
  fallback

export const resolveDigiWalletInitiation = (data, t) => {
  if (data?.status === "OTP_SENT") {
    return {
      nextStatus: "otp_sent",
      requestId: data.request_id,
      message: data.message || t("OTP sent successfully."),
      error: "",
      resendCooldown: 60,
    }
  }

  return {
    nextStatus: "failed",
    requestId: null,
    message: "",
    error: getMessageFromPayload(
      data,
      t("Unable to start DigiWallet payment.")
    ),
    resendCooldown: 0,
  }
}

export const resolveDigiWalletConfirmation = (data, t) => {
  const apiStatus = String(data?.status || "").toUpperCase()

  if (apiStatus === "SUCCESS") {
    return {
      nextStatus: "success",
      message: data?.message || t("Payment completed successfully."),
      error: "",
    }
  }

  if (apiStatus === "PENDING") {
    return {
      nextStatus: "polling",
      message: data?.message || t("Payment is pending."),
      error: "",
    }
  }

  const retryable =
    Boolean(data?.allow_retry) && apiStatus === "INVALID_OTP"

  return {
    nextStatus: retryable ? "otp_sent" : "failed",
    message: "",
    error: data?.message || t("Payment failed. Please try again."),
  }
}

export const resolveDigiWalletResend = (data, t) => {
  if (data?.status === "OTP_SENT") {
    return {
      nextStatus: "otp_sent",
      requestId: data.request_id,
      message: data?.message || t("OTP sent successfully."),
      error: "",
      resendCooldown: 60,
      clearOtp: true,
    }
  }

  return {
    nextStatus: "failed",
    requestId: null,
    message: "",
    error: data?.message || t("Unable to resend OTP."),
    resendCooldown: 0,
    clearOtp: false,
  }
}

export const resolveDigiWalletPollStatus = ({
  data,
  pollCount,
  t,
  maxPolls = 30,
}) => {
  const rawStatus =
    typeof data?.digiwallet_status === "string"
      ? data.digiwallet_status
      : data?.digiwallet_status?.status
  const normalizedStatus = String(rawStatus || "").toUpperCase()

  if (DIGIWALLET_SUCCESS_STATES.includes(normalizedStatus)) {
    return {
      nextStatus: "success",
      message: t("Payment completed successfully."),
      error: "",
      pollCount,
    }
  }

  if (DIGIWALLET_FAILED_STATES.includes(normalizedStatus)) {
    return {
      nextStatus: "failed",
      message: "",
      error: data?.message || t("Payment failed. Please try again."),
      pollCount,
    }
  }

  const nextPollCount = pollCount + 1
  if (nextPollCount > maxPolls) {
    return {
      nextStatus: "pending",
      message: t("Payment is still pending. Please check again later."),
      error: "",
      pollCount: nextPollCount,
    }
  }

  return {
    nextStatus: "polling",
    message: "",
    error: "",
    pollCount: nextPollCount,
  }
}
