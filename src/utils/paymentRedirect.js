export const extractPaymentIdFromRedirectUrl = (redirectUrl) => {
  if (!redirectUrl) {
    return null
  }

  try {
    return new URL(redirectUrl, "http://localhost").searchParams.get(
      "payment_id"
    )
  } catch (error) {
    return null
  }
}

export const getInitiatedPaymentData = (data) => {
  const redirectUrl = data?.redirect_url || data?.redirect_link || null
  const paymentId =
    data?.payment_id || extractPaymentIdFromRedirectUrl(redirectUrl)

  return {
    paymentId,
    redirectUrl,
  }
}
