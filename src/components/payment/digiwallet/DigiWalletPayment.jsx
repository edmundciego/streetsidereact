import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import DigiWalletOtp from "./DigiWalletOTP";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import DigiWalletApi from "api-manage/api-call-functions/digiWalletApi";
import {
  hydrateFromQuery,
  resetDigiWallet,
  setError,
  setLoading,
  setStatus,
} from "redux/slices/digiWalletSlice";
import { getAmountWithSign } from "helper-functions/CardHelpers";

const STATUS_LABELS = {
  otp_sent: "OTP Sent",
  pending: "Pending",
  processing: "Processing",
  success: "Success",
  error: "Failed",
};

const DigiWalletPayment = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const {
    paymentId,
    orderId,
    requestId,
    amount,
    phone,
    status,
    message,
    loading,
  error,
  transactionId,
} = useSelector((state) => state.digiWallet);
  const [otp, setOtp] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [isResendCooling, setIsResendCooling] = useState(false);

  const buildErrorPayload = (err, fallbackMessage) => {
    const data = err?.response?.data;
    const status = String(data?.status ?? "").toUpperCase();
    const message =
      data?.message ||
      data?.errors?.[0]?.message ||
      err?.message ||
      fallbackMessage;
    const hint = data?.hint;
    return { status, message, hint };
  };

  const buildResponsePayload = (data, fallbackMessage) => {
    const status = String(data?.status ?? "").toUpperCase();
    const message = data?.message ?? fallbackMessage;
    const hint = data?.hint;
    return { status, message, hint };
  };

  const displayStatus = STATUS_LABELS[status] ?? status;
  const formattedAmount = useMemo(() => {
    if (!amount) return "";
    try {
      return getAmountWithSign(Number(amount));
    } catch (err) {
      return amount;
    }
  }, [amount]);

  const maskedPhone = useMemo(() => {
    if (!phone) return "";
    if (phone.length < 4) return phone;
    const suffix = phone.slice(-4);
    return `${"*".repeat(Math.max(0, phone.length - 4))}${suffix}`;
  }, [phone]);

  useEffect(() => {
    if (!router.isReady) return;
    const { payment_id, order_id, request_id, amount, phone, status, message } =
      router.query;
    if (payment_id) {
      dispatch(
        hydrateFromQuery({
          paymentId: payment_id,
          orderId: order_id,
          requestId: request_id,
          amount,
          phone,
          status,
          message,
        })
      );
      setRemainingSeconds(300);
    }
  }, [router.isReady, router.query, dispatch]);

  useEffect(() => {
    if (!requestId) return;
    setRemainingSeconds(300);
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [requestId]);

  const pollStatus = useCallback(async () => {
    if (!paymentId) return;
    try {
      const { data } = await DigiWalletApi.getStatus(paymentId);
      const payload = data?.digiwallet_status ?? data;
      const normalizedStatus = String(payload?.status ?? "").toUpperCase();
      if (normalizedStatus === "SUCCESS") {
        dispatch(
          setStatus({
            status: "success",
            message: payload?.message,
            transactionId:
              payload?.data?.transactionId ?? data?.transaction_id ?? null,
          })
        );
        toast.success(t("Payment confirmed"));
      } else if (normalizedStatus === "ERROR") {
        dispatch(
          setStatus({
            status: "error",
            message: payload?.message ?? t("Payment failed"),
          })
        );
        dispatch(setError(payload?.message ?? t("Payment failed")));
      } else {
        dispatch(
          setStatus({
            status: "processing",
            message: payload?.message ?? t("Payment is processing"),
          })
        );
      }
    } catch (err) {
      dispatch(setError(err?.response?.data?.message ?? err.message));
    }
  }, [dispatch, paymentId, t]);

  useEffect(() => {
    if (status !== "processing" || !paymentId) return undefined;
    const interval = setInterval(() => {
      pollStatus();
    }, 6000);
    return () => clearInterval(interval);
  }, [status, pollStatus, paymentId]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error(t("Please enter the 6 digit OTP"));
      return;
    }
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const { data } = await DigiWalletApi.confirmOtp({
        request_id: requestId,
        otp,
      });
      const { status: normalizedStatus, message: respMessage, hint } =
        buildResponsePayload(data, t("Payment confirmed"));
      if (normalizedStatus === "SUCCESS") {
        dispatch(
          setStatus({
            status: "success",
            message: respMessage,
            transactionId: data?.transaction_id,
          })
        );
        toast.success(respMessage);
      } else if (normalizedStatus === "PENDING") {
        dispatch(
          setStatus({
            status: "processing",
            message: respMessage ?? t("Payment is processing"),
            transactionId: data?.transaction_id,
          })
        );
        toast(t("Payment is processing, we will update you shortly"));
      } else {
        dispatch(
          setStatus({
            status: "error",
            message: respMessage ?? t("Payment failed"),
          })
        );
        const userMessage = hint ? `${respMessage} (${hint})` : respMessage;
        dispatch(setError(userMessage));
        toast.error(userMessage);
      }
    } catch (err) {
      const { message: userMessage, hint } = buildErrorPayload(
        err,
        t("Payment failed")
      );
      const display = hint ? `${userMessage} (${hint})` : userMessage;
      dispatch(setError(display));
      dispatch(
        setStatus({
          status: "error",
          message: display,
        })
      );
      toast.error(display);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleResend = async () => {
    if (!paymentId) return;
    setIsResendCooling(true);
    dispatch(setError(null));
    dispatch(setLoading(true));
    try {
      const { data } = await DigiWalletApi.resendOtp({
        payment_id: paymentId,
      });
      if (String(data?.status ?? "").toUpperCase() === "OTP_SENT") {
        dispatch(
          setStatus({
            status: "otp_sent",
            message: data?.message ?? t("OTP sent successfully"),
            requestId: data?.request_id ?? requestId,
          })
        );
        toast.success(data?.message ?? t("OTP sent successfully"));
        setOtp("");
        setRemainingSeconds(300);
      } else {
        const { status: normalizedStatus, message: respMessage, hint } =
          buildResponsePayload(data, t("Unable to resend OTP"));
        const userMessage = hint ? `${respMessage} (${hint})` : respMessage;
        dispatch(setError(userMessage));
        if (normalizedStatus === "INSUFFICIENT_FUNDS") {
          toast.error(userMessage);
        } else {
          toast.error(userMessage);
        }
      }
    } catch (err) {
      const { message: userMessage, hint } = buildErrorPayload(
        err,
        t("Unable to resend OTP")
      );
      const display = hint ? `${userMessage} (${hint})` : userMessage;
      dispatch(setError(display));
      toast.error(display);
    } finally {
      dispatch(setLoading(false));
      setTimeout(() => setIsResendCooling(false), 5000);
    }
  };

  const handleGoToOrders = () => {
    dispatch(resetDigiWallet());
    router.push({
      pathname: "/profile",
      query: {
        page: "my-orders",
        orderId: orderId,
        flag: "success",
      },
    });
  };

  const handleClose = () => {
    dispatch(resetDigiWallet());
    router.push("/");
  };

  const minutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");

  if (!paymentId) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        padding={{ xs: "16px", md: "32px" }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      padding={{ xs: "16px", md: "32px" }}
      bgcolor={theme.palette.background.default}
    >
      <Card sx={{ maxWidth: 520, width: "100%" }}>
        <CardContent>
          <Stack spacing={3}>
            <Box display="flex" justifyContent="center">
              <Box
                component="img"
                src="/digiwallet-logo.png"
                alt="DigiWallet"
                sx={{ height: 40, objectFit: "contain" }}
              />
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="h6">{t("DigiWallet Payment")}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t("Status")}: {displayStatus}
              </Typography>
              {message && (
                <Typography variant="body2" color="text.secondary">
                  {message}
                </Typography>
              )}
            </Stack>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t("Amount")}
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {formattedAmount}
              </Typography>
            </Box>

            {phone && (
              <Typography variant="body2" color="text.secondary">
                {t("OTP sent to")} {maskedPhone}
              </Typography>
            )}

            {status !== "success" && status !== "error" && (
              <Stack spacing={2}>
                <DigiWalletOtp
                  value={otp}
                  onChange={setOtp}
                  disabled={loading || status === "processing"}
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="contained"
                    onClick={handleVerify}
                    disabled={
                      loading || otp.length !== 6 || status === "processing"
                    }
                  >
                    {loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      t("Verify OTP")
                    )}
                  </Button>
                  <Button
                    color="secondary"
                    disabled={remainingSeconds > 0 || isResendCooling || loading}
                    onClick={handleResend}
                  >
                    {t("Resend OTP")} ({minutes}:{seconds})
                  </Button>
                </Stack>
                {error && (
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                )}
              </Stack>
            )}

            {status === "processing" && (
              <Stack spacing={1} alignItems="flex-start">
                <CircularProgress size={28} />
                <Typography variant="body2" color="text.secondary">
                  {t("We are confirming your payment. This may take a moment.")}
                </Typography>
              </Stack>
            )}

            {(status === "success" || status === "error") && (
              <Stack spacing={1}>
                {transactionId && (
                  <Typography variant="body2" color="text.secondary">
                    {t("Transaction ID")}: {transactionId}
                  </Typography>
                )}
                <Divider />
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color={status === "success" ? "primary" : "error"}
                    onClick={handleGoToOrders}
                  >
                    {t("View Order")}
                  </Button>
                  <Button variant="outlined" onClick={handleClose}>
                    {t("Close")}
                  </Button>
                </Stack>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default DigiWalletPayment;
