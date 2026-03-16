import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import {
  resetDigiWallet,
  setError,
  setMessage,
  setRequestId,
  setStatus,
} from "../../../redux/slices/digiWalletSlice";
import { digiWalletApi } from "../../../api-manage/api-call-functions/digiWalletApi";
import { getToken } from "../../../helper-functions/getToken";
import {
  getDigiWalletErrorMessage,
  resolveDigiWalletConfirmation,
  resolveDigiWalletInitiation,
  resolveDigiWalletPollStatus,
  resolveDigiWalletResend,
} from "./digiWalletState";

const DigiWalletPayment = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const {
    paymentId,
    orderId,
    requestId,
    status,
    message,
    error,
    callback,
  } = useSelector((state) => state.digiWallet);

  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const pollCount = useRef(0);

  const canSubmitOtp = otp.length === 6 && !!requestId;
  const isLoading =
    status === "initiating" ||
    status === "verifying" ||
    status === "polling";

  const returnUrl = useMemo(() => {
    if (callback) return callback;
    if (getToken()) return "/profile?page=my-orders";
    return "/";
  }, [callback]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (!paymentId || status !== "ready") return;
    const initiate = async () => {
      dispatch(setStatus("initiating"));
      dispatch(setError(""));
      try {
        const { data } = await digiWalletApi.initiate(paymentId);
        const result = resolveDigiWalletInitiation(data, t);

        if (result.requestId) {
          dispatch(setRequestId(result.requestId));
        }
        dispatch(setMessage(result.message));
        dispatch(setError(result.error));
        dispatch(setStatus(result.nextStatus));
        setResendCooldown(result.resendCooldown);
      } catch (err) {
        dispatch(
          setError(
            getDigiWalletErrorMessage(
              err,
              t("Unable to start DigiWallet payment.")
            )
          )
        );
        dispatch(setStatus("failed"));
      }
    };
    initiate();
  }, [dispatch, paymentId, status, t]);

  useEffect(() => {
    if (status !== "polling" || !paymentId) return;

    const poll = async () => {
      try {
        const { data } = await digiWalletApi.getStatus(paymentId);
        const result = resolveDigiWalletPollStatus({
          data,
          pollCount: pollCount.current,
          t,
        });

        pollCount.current = result.pollCount;
        dispatch(setMessage(result.message));
        dispatch(setError(result.error));
        dispatch(setStatus(result.nextStatus));
      } catch (err) {
        dispatch(setError(t("Unable to check payment status.")));
        dispatch(setStatus("failed"));
      }
    };

    const timer = setInterval(poll, 8000);
    return () => clearInterval(timer);
  }, [dispatch, paymentId, status, t]);

  const handleOtpSubmit = async () => {
    if (!canSubmitOtp) return;
    dispatch(setStatus("verifying"));
    dispatch(setError(""));
    try {
      const { data } = await digiWalletApi.confirmOtp({
        request_id: requestId,
        otp,
      });
      const result = resolveDigiWalletConfirmation(data, t);

      dispatch(setMessage(result.message));
      dispatch(setError(result.error));
      dispatch(setStatus(result.nextStatus));
    } catch (err) {
      dispatch(
        setError(
          getDigiWalletErrorMessage(
            err,
            t("Unable to verify OTP. Please try again.")
          )
        )
      );
      dispatch(setStatus("otp_sent"));
    }
  };

  const handleResend = async () => {
    if (!paymentId || resendCooldown > 0) return;
    dispatch(setStatus("verifying"));
    dispatch(setError(""));
    try {
      const { data } = await digiWalletApi.resendOtp(paymentId);
      const result = resolveDigiWalletResend(data, t);

      if (result.requestId) {
        dispatch(setRequestId(result.requestId));
      }
      dispatch(setMessage(result.message));
      dispatch(setError(result.error));
      dispatch(setStatus(result.nextStatus));
      setResendCooldown(result.resendCooldown);
      if (result.clearOtp) {
        setOtp("");
      }
    } catch (err) {
      dispatch(
        setError(
          getDigiWalletErrorMessage(err, t("Unable to resend OTP."))
        )
      );
      dispatch(setStatus("otp_sent"));
    }
  };

  const handleReturn = () => {
    dispatch(resetDigiWallet());
    if (returnUrl.startsWith("http")) {
      window.location.assign(returnUrl);
      return;
    }
    router.push(returnUrl);
  };

  if (!paymentId) {
    return (
      <Stack alignItems="center" spacing={2} padding={4}>
        <Typography variant="h6">{t("Payment information is missing.")}</Typography>
        <Button variant="contained" onClick={handleReturn}>
          {t("Go back")}
        </Button>
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" spacing={3} padding={{ xs: 3, md: 6 }}>
      <Typography variant="h5">{t("DigiWallet Payment")}</Typography>
      <Typography variant="body2" color={theme.palette.neutral[500]}>
        {t("Order")} #{orderId || paymentId}
      </Typography>

      {(status === "initiating" || status === "verifying") && (
        <Stack alignItems="center" spacing={1}>
          <CircularProgress size={32} />
          <Typography variant="body2">
            {status === "initiating"
              ? t("Requesting OTP...")
              : t("Verifying OTP...")}
          </Typography>
        </Stack>
      )}

      {message && (
        <Typography variant="body2" color={theme.palette.neutral[700]}>
          {message}
        </Typography>
      )}

      {error && (
        <Typography variant="body2" color={theme.palette.error.main}>
          {error}
        </Typography>
      )}

      {status === "otp_sent" && (
        <Stack spacing={2} alignItems="center">
          <Typography variant="body2">
            {t("Enter the 6-digit OTP sent to your phone.")}
          </Typography>
          <Box
            sx={{
              ".otp-input": {
                width: "40px",
                height: "44px",
                borderRadius: "8px",
                border: `1px solid ${theme.palette.primary.main}`,
                fontSize: "16px",
                color: theme.palette.primary.main,
              },
            }}
          >
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span style={{ width: "8px" }} />}
              renderInput={(props) => <input {...props} className="otp-input" />}
            />
          </Box>
          <Button
            variant="contained"
            disabled={!canSubmitOtp || isLoading}
            onClick={handleOtpSubmit}
          >
            {t("Confirm Payment")}
          </Button>
          <Button
            variant="text"
            disabled={resendCooldown > 0 || isLoading}
            onClick={handleResend}
          >
            {resendCooldown > 0
              ? t("Resend OTP in {{count}}s", { count: resendCooldown })
              : t("Resend OTP")}
          </Button>
        </Stack>
      )}

      {status === "polling" && (
        <Stack alignItems="center" spacing={1}>
          <CircularProgress size={28} />
          <Typography variant="body2">{t("Checking payment status...")}</Typography>
        </Stack>
      )}

      {status === "pending" && (
        <Stack alignItems="center" spacing={2}>
          <Typography variant="body2">
            {t("Payment is still pending. You can check again in a moment.")}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              pollCount.current = 0;
              dispatch(setStatus("polling"));
            }}
          >
            {t("Check Status")}
          </Button>
        </Stack>
      )}

      {(status === "success" || status === "failed") && (
        <Stack alignItems="center" spacing={2}>
          <Typography variant="body1">
            {status === "success"
              ? t("Your payment was successful.")
              : t("Your payment was not completed.")}
          </Typography>
          <Button variant="contained" onClick={handleReturn}>
            {t("Return to orders")}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default DigiWalletPayment;
