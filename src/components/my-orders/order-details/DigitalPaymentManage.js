import React from "react";

import { Stack } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";

import { t } from "i18next";
import { useMutation } from "react-query";

import { toast } from "react-hot-toast";

import { WrapperForCustomDialogConfirm } from "../../custom-dialog/confirm/CustomDialogConfirm.style";
import {
  CustomButtonCancel,
  CustomButtonSuccess,
} from "../../../styled-components/CustomButtons.style";
import { OrderApi } from "../../../api-manage/another-formated-api/orderApi";
import { onErrorResponse } from "../../../api-manage/api-error-response/ErrorResponses";
import DigiWalletApi from "../../../api-manage/api-call-functions/digiWalletApi";
import PaymentApi from "../../../api-manage/api-call-functions/paymentApi";
import Router from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { hydrateFromQuery } from "redux/slices/digiWalletSlice";
import { hasValidPhoneNumber, normalizePhoneNumber } from "utils/CustomFunctions";

const DigitalPaymentManage = ({
  setModalOpenForPayment,
  refetchOrderDetails,
  refetchTrackData,
  id,
  trackData,
  canRetry,
  message,
  setPaymentModalMessage,
  onRequestCancel,
}) => {
  const dispatch = useDispatch();
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const { mutate: paymentMethodUpdateMutation, isLoading: orderLoading } =
    useMutation(
      "order-payment-method-update",
      OrderApi.FailedPaymentMethodUpdate
    );

  const handleOnSuccess = () => {
    const handleSuccess = (response) => {
      toast.success(response.data.message);
      refetchOrderDetails();
      refetchTrackData();
      setModalOpenForPayment(false);
      setPaymentModalMessage?.(null);
    };
    const formData = {
      order_id: id,
      _method: "put",
    };
    paymentMethodUpdateMutation(formData, {
      onSuccess: handleSuccess,
      onError: onErrorResponse,
    });
  };

  const resolveCustomerId = () =>
    trackData?.user_id ??
    trackData?.customer_id ??
    trackData?.guest_id ??
    profileInfo?.id ??
    null;

  const resolveContactNumber = () => {
    const address = trackData?.delivery_address;
    if (address) {
      if (typeof address === "string") {
        try {
          const parsed = JSON.parse(address);
          if (parsed?.contact_person_number) {
            return parsed.contact_person_number;
          }
        } catch (error) {
          // ignore parse error
        }
      } else if (address?.contact_person_number) {
        return address.contact_person_number;
      }
    }

    return (
      profileInfo?.phone ??
      trackData?.contact_person_number ??
      guestUserInfo?.contact_person_number ??
      ""
    );
  };

  const requireDigiWalletPhone = (phone) => {
    if (hasValidPhoneNumber(phone)) {
      return true;
    }
    toast.error(t("Add your phone number to enable DigiWallet payments."));
    return false;
  };

  const buildCallbackUrl = () => {
    if (typeof window === "undefined") return undefined;
    const baseOrigin = window.location.origin;
    if (!baseOrigin) return undefined;

    if (trackData?.is_guest || !profileInfo?.id) {
      return `${baseOrigin}/order?order_id=${id}&total=${
        trackData?.order_amount ?? ""
      }`;
    }
    return `${baseOrigin}/profile?page=my-orders&orderId=${id}`;
  };

  const handleRetry = async () => {
    if (!trackData) {
      toast.error(t("Unable to retry payment"));
      return;
    }

    const paymentMethod = trackData?.payment_method;
    const customerId = resolveCustomerId();
    if (!customerId) {
      toast.error(t("Unable to identify customer for retry"));
      return;
    }

    const payloadBase = {
      order_id: id,
      customer_id: customerId,
      payment_method: paymentMethod,
      payment_platform: trackData?.payment_platform ?? "web",
    };
    const callbackUrl = buildCallbackUrl();
    if (callbackUrl) {
      payloadBase.callback = callbackUrl;
    }

    setModalOpenForPayment(false);
    setPaymentModalMessage?.(null);

    try {
      if (paymentMethod === "digiWallet") {
        const { data } = await DigiWalletApi.initiate({
          ...payloadBase,
          payment_method: "digiWallet",
        });
        const redirectUrl = data?.redirect_url;
        let paymentId = data?.payment_id ?? null;
        let requestId = data?.request_id ?? data?.transaction_id ?? null;
        let status = data?.status ?? "otp_sent";
        let message = data?.message;

        if (!paymentId && typeof redirectUrl === "string") {
          const match = redirectUrl.match(/[?&]payment_id=([^&]+)/);
          if (match) {
            paymentId = decodeURIComponent(match[1]);
          }
        }

        if (!paymentId) {
          throw new Error(t("Unable to initiate DigiWallet payment"));
        }

        if (redirectUrl) {
          const payResponse = await DigiWalletApi.triggerPay(redirectUrl);
          const payData = payResponse?.data ?? {};
          requestId =
            payData?.request_id ?? payData?.transaction_id ?? requestId ?? null;
          status = payData?.status ?? status;
          message = payData?.message ?? message;
        }

        const amountToPay = Number(trackData?.order_amount ?? 0);
        const contactNumber = resolveContactNumber();
        const normalizedPhone = normalizePhoneNumber(contactNumber);

        if (!requireDigiWalletPhone(contactNumber)) {
          return;
        }

        dispatch(
          hydrateFromQuery({
            paymentId,
            orderId: id,
            requestId,
            amount: amountToPay,
            phone: normalizedPhone,
            status: (status || "otp_sent").toLowerCase(),
            message,
          })
        );

        Router.push({
          pathname: "/digiwallet-payment",
          query: {
            payment_id: paymentId,
            order_id: id,
            request_id: requestId ?? undefined,
            amount: amountToPay,
            phone: contactNumber,
          },
        });
      } else {
        const { data } = await PaymentApi.initiate(payloadBase);
        const redirectUrl = data?.redirect_url;
        if (!redirectUrl) {
          throw new Error(
            data?.message ?? t("Unable to initiate payment session")
          );
        }
        if (typeof window !== "undefined") {
          window.location.href = redirectUrl;
        } else {
          Router.push(redirectUrl);
        }
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.message ||
        error?.message ||
        t("Unable to retry payment");
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setModalOpenForPayment(false);
    setPaymentModalMessage?.(null);
    onRequestCancel?.();
  };

  return (
    <>
      <WrapperForCustomDialogConfirm width="23rem">
        <DialogTitle id="alert-dialog-title" sx={{ padding: "10px 24px" }}>
          <Typography textAlign="center" variant="h6">
            {t("Switch Your payment method ")}
          </Typography>
        </DialogTitle>
        {message && (
          <Typography
            variant="body2"
            color="error"
            textAlign="center"
            px={3}
            pb={1}
          >
            {message}
          </Typography>
        )}
        <DialogActions>
          <Stack
            alignItems="center"
            justifyContent="center"
            width="100%"
            spacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <CustomButtonSuccess
              loading={orderLoading}
              variant="contained"
              onClick={handleOnSuccess}
              width="14rem"
            >
              {t("Switch to Cash on Delivery")}
            </CustomButtonSuccess>
            {canRetry && (
              <CustomButtonSuccess
                variant="contained"
                color="info"
                onClick={handleRetry}
                width="14rem"
              >
                {t("Retry Payment")}
              </CustomButtonSuccess>
            )}
            <CustomButtonCancel
              width="14.5rem"
              variant="contained"
              onClick={handleClose}
            >
              {t("Cancel Order")}
            </CustomButtonCancel>
          </Stack>
        </DialogActions>
      </WrapperForCustomDialogConfirm>
    </>
  );
};

export default DigitalPaymentManage;
