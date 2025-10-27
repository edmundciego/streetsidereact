# Archive vs 6amMart React - Migration Guide

This document contains the modifications made to the 6amMart React application compared to the Archive version. Use this as a reference to apply the same changes to newer versions of the software.

## Implementation Summary

The following files were modified with these key changes:

1. **OfflineOrderDetailsModal.js** - Enhanced payment status handling with conditional icons and messages
2. **CenacelOrder.js** - Component was cleared/removed (empty file)
3. **TopDetails.js** - Added payment processing status logic and improved order state handling
4. **BasicInformationForm.js** - Made username field read-only

## Modified Files Comparison

### src/components/my-orders/order-details/offline-order/OfflineOrderDetailsModal.js

**Changes Made:**
- Added conditional icons (CancelIcon, ErrorIcon) for payment failure scenarios
- Enhanced conditional messaging for cancelled/failed payments
- Improved user experience with clearer payment status indicators
- Added Cash on Delivery alternative messaging for failed payments

**Key Imports to Add:**
```jsx
import ErrorIcon from "@mui/icons-material/Error";
import CancelIcon from "@mui/icons-material/Cancel";
```

**Modified Code:**
```jsx
import React from "react";
import {
  Button,
  Grid,
  Skeleton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CancelIcon from "@mui/icons-material/Cancel";
import { t } from "i18next";

import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import DotSpin from "../../../DotSpin";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import {
  ItemWrapper,
  ModalCustomTypography,
} from "../../../order-details-modal/OrderDetailsModal.style";

const OfflineOrderDetailsModal = ({
  trackData,
  handleOfflineClose,
  trackDataIsLoading,
  trackDataIsFetching,
  page,
}) => {
  const theme = useTheme();
  return (
    <CustomStackFullWidth
      padding={{ xs: "30px 15px", md: "60px 45px 40px" }}
      alignItems="center"
      gap="20px"
    >
      {/* Conditional Icon based on payment status */}
      {page === "my-orders?flag=cancel" ? (
        <CancelIcon
          sx={{
            height: "45px",
            width: "45px",
            color: theme.palette.error.main,
          }}
        />
      ) : page === "my-orders?flag=fail" ? (
        <ErrorIcon
          sx={{
            height: "45px",
            width: "45px",
            color: theme.palette.error.main,
          }}
        />
      ) : (
        <CheckCircleIcon
          sx={{
            height: "45px",
            width: "45px",
            color: theme.palette.primary.main,
          }}
        />
      )}
      
      {/* Conditional Title based on payment status */}
      <Typography fontSize="16px" fontWeight="700" textAlign="center">
        {page === "my-orders?flag=cancel" || page === "my-orders?flag=fail"
          ? `${t("Payment Failed")} !`
          : `${t("Order Placed Successfully")} !`}
      </Typography>
      <CustomStackFullWidth
        padding={{ xs: "0px 20px", md: "0px 145px" }}
        textAlign="center"
      >
        {trackDataIsLoading ? (
          <Stack
            minWidth={{ xs: "270px", sm: "370px" }}
            width="100%"
            padding="15px 0px"
          >
            <DotSpin />
          </Stack>
        ) : (
          <Typography fontSize="14px" fontWeight="400">
            {page === "my-orders?flag=cancel" ? (
              <>
                <Typography component="span" color={theme.palette.error.main}>
                  {t("Your payment has been cancelled for order ")}
                </Typography>
                <Typography
                  component="span"
                  fontWeight="600"
                  sx={{ color: theme.palette.primary.main }}
                >
                  #{trackData?.id}
                </Typography>
                <Typography component="span" fontWeight="400">
                  {` ${t("has been placed. You can still complete your purchase with Cash on Delivery.")} !`}
                </Typography>
              </>
            ) : page === "my-orders?flag=fail" ? (
              <>
                <Typography component="span" color={theme.palette.error.main}>
                  {t("Your payment has failed for order ")}
                </Typography>
                <Typography
                  component="span"
                  fontWeight="600"
                  sx={{ color: theme.palette.primary.main }}
                >
                  #{trackData?.id}
                </Typography>
                <Typography component="span" fontWeight="400">
                  {` ${t("has been placed. You can still complete your purchase with Cash on Delivery.")} !`}
                </Typography>
              </>
            ) : (
              <>
                <Typography component="span">
                  {`${t("Your payment has been successfully processed, and your order ")} `}
                </Typography>
                <Typography
                  component="span"
                  fontWeight="600"
                  sx={{ color: theme.palette.primary.main }}
                >
                  #{trackData?.id}
                </Typography>
                <Typography component="span" fontWeight="400">
                  {` ${t("has been placed.")} !`}
                </Typography>
              </>
            )}
          </Typography>
        )}
      </CustomStackFullWidth>
      {trackData?.offline_payment && (
        <>
          <CustomStackFullWidth
            padding="40px 10px 20px 20px"
            backgroundColor={alpha(theme.palette.primary.main, 0.1)}
            alignItems="center"
            gap="30px"
            borderRadius="10px"
          >
            <Typography fontWeight={500}>{t("Payment Info")}</Typography>
            <CustomStackFullWidth
              alignItems="center"
              gap="20px"
              borderRadius="10px"
            >
              {trackDataIsLoading && trackDataIsFetching ? (
                <Grid container padding="40px">
                  <DotSpin />
                </Grid>
              ) : (
                <Stack width="max-content">
                  <ItemWrapper container>
                    <ModalCustomTypography>
                      {`${t("Order")} #`}
                    </ModalCustomTypography>
                    <Typography sx={{ wordWrap: "break-word" }}>
                      :&nbsp;&nbsp;{trackData?.id}
                    </Typography>
                  </ItemWrapper>
                  <ItemWrapper>
                    <ModalCustomTypography>
                      {`${t("Order Time")}`}
                    </ModalCustomTypography>
                    <Typography sx={{ wordWrap: "break-word" }}>
                      :&nbsp;&nbsp;{trackData?.created_at}
                    </Typography>
                  </ItemWrapper>
                  <ItemWrapper>
                    <ModalCustomTypography>
                      {`${t("Order Status")}`}
                    </ModalCustomTypography>
                    <Typography sx={{ wordWrap: "break-word" }}>
                      :&nbsp;&nbsp;{trackData?.order_status}
                    </Typography>
                  </ItemWrapper>
                  {trackData?.offline_payment && (
                    <>
                      {trackData?.offline_payment?.input?.map((item, index) => {
                        return (
                          <ItemWrapper key={index}>
                            <ModalCustomTypography
                              sx={{ textTransform: "capitalize" }}
                            >
                              {item?.user_input.replaceAll("_", " ")}
                            </ModalCustomTypography>
                            <Typography sx={{ wordWrap: "break-word" }}>
                              :&nbsp;&nbsp;
                              {item?.user_data.replaceAll("_", " ")}
                            </Typography>
                          </ItemWrapper>
                        );
                      })}
                      <ItemWrapper>
                        {trackData?.offline_payment?.data?.customer_note && (
                          <>
                            <ModalCustomTypography>
                              {"Note"}
                            </ModalCustomTypography>
                            <Typography sx={{ wordWrap: "break-word" }}>
                              :&nbsp;&nbsp;
                              {trackData?.offline_payment?.data?.customer_note}
                            </Typography>
                          </>
                        )}
                      </ItemWrapper>
                    </>
                  )}
                </Stack>
              )}
            </CustomStackFullWidth>
          </CustomStackFullWidth>
          <Typography color={theme.palette.text.secondary}>
            <Typography
              component="span"
              color={theme.palette.error.main}
              fontSize="18px"
            >
              {" "}
              *{" "}
            </Typography>
            {t(
              "If you accidentally provided incorrect payment information, you can edit the details in the order details section while the order is still pending."
            )}
          </Typography>
        </>
      )}
      <Button
        onClick={handleOfflineClose}
        variant="contained"
        // maxWidth="150px"
        // fullWidth
      >
        {t("Ok")}
      </Button>
    </CustomStackFullWidth>
  );
};

export default OfflineOrderDetailsModal;
```

### src/components/my-orders/order-details/CenacelOrder.js

**Changes Made:**
- **IMPORTANT**: This file was completely emptied/removed
- The cancel order functionality appears to have been refactored or moved elsewhere
- When implementing on new version, check if this component still exists or if functionality was consolidated

**Modified Code:**
```jsx
// File is empty - component was removed or refactored
```

### src/components/my-orders/order-details/TopDetails.js

**Changes Made:**
- Added "Payment Processing" status button for unpaid orders (not failed)
- Extended cancel button availability to "confirmed" status orders
- Added "Order in Progress" status button for processing/handover/picked_up/accepted states
- Enhanced payment status logic with better conditional rendering

**Key Changes to Look For:**
1. Line ~372: Added payment processing status logic
2. Line ~384: Extended cancel order conditions to include "confirmed" status
3. Line ~394: Added progress indicator for active order states

**Modified Code:**
```jsx
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  IconButton,
  Skeleton,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { GoogleApi } from "api-manage/hooks/react-query/googleApi";
import { useGetOrderCancelReason } from "api-manage/hooks/react-query/order/useGetOrderCancelReason";
import { hasChatAndReview } from "components/my-orders/order-details/other-order/StoreDetails";
import { getGuestId, getToken } from "helper-functions/getToken";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  clearOfflinePaymentInfo,
  setOrderDetailsModal,
} from "redux/slices/offlinePaymentData";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import usePostOrderCancel from "../../../api-manage/hooks/react-query/order/usePostOrderCancel";
import CustomModal from "../../modal";
import TrackSvg from "../assets/TrackSvg";
import { OrderStatusButton } from "../myorders.style";
import CancelOrder from "./CenacelOrder";
import DigitalPaymentManage from "./DigitalPaymentManage";
import OfflineOrderDetailsModal from "./offline-order/OfflineOrderDetailsModal";
import PaymentUpdate from "./other-order/PaymentUpdate";

const TopDetails = (props) => {
  const {
    data,
    trackData,
    trackDataIsLoading,
    trackDataIsFetching,
    currentTab,
    configData,
    id,
    openModal,
    setOpenModal,
    refetchOrderDetails,
    refetchTrackData,
    dataIsLoading,
    page,
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();

  const { orderDetailsModal, offlineInfoStep } = useSelector(
    (state) => state.offlinePayment
  );
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [cancelOpenModal, setCancelOpenModal] = useState(false);
  const [openModalForPayment, setModalOpenForPayment] = useState();
  const [cancelReason, setCancelReason] = useState(null);
  const [openModalOffline, setOpenModelOffline] = useState(orderDetailsModal);
  const dispatch = useDispatch();

  const buttonBackgroundColor = () => {
    if (trackData?.order_status === "pending") {
      return theme.palette.info.main;
    }
    if (trackData?.order_status === "confirmed") {
      return theme.palette.footer.inputButtonHover;
    }
    if (
      trackData?.order_status === "processing" ||
      trackData?.order_status === "handover" ||
      trackData?.order_status === "picked_up" ||
      trackData?.order_status === "accepted"
    ) {
      return theme.palette.warning.dark;
    }
    if (trackData?.order_status === "delivered") {
      return theme.palette.primary.main;
    }
    if (trackData?.order_status === "canceled") {
      return theme.palette.error.main;
    }
    if (
      trackData?.order_status === "refund_requested" ||
      trackData?.order_status === "refund_request_canceled"
    ) {
      return theme.palette.error.main;
    }
    if (trackData?.order_status === "refunded") {
      return theme.palette.primary.main;
    }
    if (trackData?.order_status === "failed") {
      return theme.palette.error.main;
    }
  };
  const fontColor = () => {
    if (trackData?.order_status === "pending") {
      return theme.palette.info.main;
    }
    if (trackData?.order_status === "processing") {
      return theme.palette.warning.dark;
    }
    if (trackData?.order_status === "delivered") {
      return theme.palette.primary.main;
    }
    if (trackData?.order_status === "canceled") {
      return theme.palette.error.main;
    }
  };
  const currentLatLng = JSON.parse(
    window.localStorage.getItem("currentLatLng")
  );
  const { data: zoneData } = useQuery(
    ["zoneId", location],
    async () => GoogleApi.getZoneId(currentLatLng),
    {
      retry: 1,
    }
  );
  const { data: cancelReasonsData, refetch } = useGetOrderCancelReason();
  useEffect(() => {
    refetch().then();
  }, []);

  const { mutate: orderCancelMutation, isLoading: orderLoading } =
    usePostOrderCancel();
  const handleOnSuccess = () => {
    if (!cancelReason) {
      toast.error("Please select a cancellation reason");
    } else {
      const handleSuccess = (response) => {
        refetchOrderDetails();
        refetchTrackData();
        setCancelOpenModal(false);
        toast.success(response.message);
      };
      const formData = {
        guest_id: getGuestId(),
        order_id: id,
        reason: cancelReason,
        _method: "put",
      };
      orderCancelMutation(formData, {
        onSuccess: handleSuccess,
        onError: onErrorResponse,
      });
    }
  };

  const today = moment(new Date());
  const differenceInMinutes = () => {
    const deliveryTime = trackData?.store?.delivery_time;
    const createdAt = trackData?.created_at;
    const processingTime = trackData?.processing_time;
    const scheduleAt = trackData?.schedule_at;
    let minTime = processingTime != null ? processingTime : 0;
    if (
      deliveryTime !== null &&
      deliveryTime !== "" &&
      processingTime === null
    ) {
      const timeArr = deliveryTime?.split("-");
      minTime = Number.parseInt(timeArr[0]);
    }
    const newDeliveryTime = scheduleAt ? scheduleAt : createdAt;
    const newDeliveryTimeWithAdditionalMin = moment(newDeliveryTime)
      .add(minTime, "minutes")
      .format();
    const duration = moment.duration(
      today.diff(newDeliveryTimeWithAdditionalMin)
    );
    const minutes = duration?.asMinutes();
    //here minutes give negative values for positive changes, that's why the condition given below
    if (minutes <= -1) {
      return Number.parseInt(Math.abs(minutes));
    }
  };
  const handleTime = () => {
    if (differenceInMinutes() > 5) {
      return `${differenceInMinutes() - 5} - ${differenceInMinutes()} `;
    } else {
      return `1-5`;
    }
  };

  const handleOfflineClose = () => {
    dispatch(clearOfflinePaymentInfo());
    dispatch(setOrderDetailsModal(false));
    setOpenModelOffline(false);
  };
  const capitalizeText = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  return (
    // <HeadingBox>
    <CustomStackFullWidth
      alignItems="center"
      justifyContent="space-between"
      direction="row"
      padding={{
        xs: "0px 0px 5px 0px",
        sm: "30px 20px 20px 25px",
        md: "30px 20px 20px 25px",
      }}
      rowGap="10px"
      flexWrap="wrap"
    >
      <Stack spacing={{ xs: 1, md: 1 }} flexGrow="1">
        {dataIsLoading ? (
          <Skeleton variant="text" width="150px" />
        ) : (
          <Typography fontSize={{ xs: "12px", md: "16px" }} fontWeight="600">
            {t("Order ID:")}
            <Typography
              component="span"
              fontSize={{ xs: "12px", md: "16px" }}
              fontWeight="600"
              marginLeft="5px"
            >
              {data?.[0]?.order_id ? data?.[0]?.order_id : data?.id}
            </Typography>
            {/*{data?.[0]?.order_id ? data?.[0]?.order_id : data?.id}*/}

            <Typography
              component="span"
              fontSize="12px"
              sx={{
                textTransform: "capitalize",
                padding: "4px",
                marginLeft: "15px",
                borderRadius: "3px",
                backgroundColor: buttonBackgroundColor(),
                color: (theme) => theme.palette.whiteContainer.main,
                fontWeight: "600",
              }}
            >
              {t(capitalizeText(trackData?.order_status))}
            </Typography>
            <Typography
              component="span"
              fontSize="12px"
              sx={{
                textTransform: "capitalize",
                padding: "4px",
                marginLeft: "15px",
                borderRadius: "3px",
                backgroundColor: (theme) => theme.palette.neutral[400],
                color: (theme) => theme.palette.whiteContainer.main,
                fontWeight: "600",
              }}
            >
              {t(capitalizeText(trackData?.order_type))}
            </Typography>
          </Typography>
        )}

        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={0.5}
        >
          <Typography
            fontSize={{ xs: "10px", md: "12px" }}
            fontWeight="600"
            color={theme.palette.neutral[500]}
            marginRight="1rem"
          >
            {t("Order date:")}
            <Typography
              component="span"
              fontSize={{ xs: "10px", md: "12px" }}
              fontWeight="500"
              marginLeft="5px"
              color={theme.palette.neutral[600]}
            >
              {moment(trackData?.created_at)?.format("DD MMM, YYYY")}
            </Typography>
          </Typography>

          {trackData?.module_type === "food" && (
            <Stack
              direction="row"
              borderLeft={!isSmall && `2px solid ${theme.palette.neutral[400]}`}
              paddingLeft={!isSmall && "1rem"}
              alignItems="center"
              spacing={1}
            >
              {" "}
              <TrackSvg />
              <Typography
                color={theme.palette.primary.main}
                fontSize={{ xs: "10px", md: "12px" }}
                fontWeight="500"
              >
                {t("Estimated delivery:")}{" "}
                <Typography
                  fontSize={{ xs: "10px", md: "12px" }}
                  fontWeight="500"
                  component="span"
                >
                  {handleTime()}
                </Typography>
                <Typography
                  color="primary"
                  fontSize={{ xs: "10px", md: "12px" }}
                  fontWeight="500"
                >
                  {t("min")}
                </Typography>
              </Typography>
            </Stack>
          )}
        </Stack>
        {configData?.order_delivery_verification ? (
          <Typography
            fontSize={{ xs: "10px", md: "14px" }}
            fontWeight="600"
            color={theme.palette.primary.main}
          >
            <Typography
              fontSize={{ xs: "10px", md: "14px" }}
              fontWeight="600"
              color={theme.palette.neutral[500]}
              component="span"
            >
              {t("Order OTP")}:{" "}
            </Typography>
            {trackData?.otp}
          </Typography>
        ) : null}
      </Stack>

      {trackData?.order_status === "refund_requested" && trackData?.refund && (
        <Stack>
          <OrderStatusButton
            background={
              trackData?.refund?.refund_status === "pending"
                ? theme.palette.info.main
                : theme.palette.error.main
            }

            // color={theme.palette.whiteContainer}
          >
            {trackData?.refund?.refund_status}
          </OrderStatusButton>
        </Stack>
      )}
      {trackData?.order_status === "refund_requested" &&
        trackData?.refund_cancellation_note && (
          <Stack>
            <OrderStatusButton
              background={alpha(theme.palette.error.light, 0.3)}
              onClick={() => setOpenModal(true)}
              // color={theme.palette.whiteContainer}
            >
              {trackData?.refund_cancellation_note}
            </OrderStatusButton>
          </Stack>
        )}

      {data &&
        !data?.[0]?.item_campaign_id &&
        trackData &&
        trackData?.order_status === "delivered" &&
        getToken() && data?.length > 0 &&
        hasChatAndReview(trackData?.store)?.isReview === 1 && (
          <Stack direction="row" spacing={0.5}>
            <Link href={`/rate-and-review/${id}`}>
              <Button
                variant="outlined"
                background={theme.palette.error.light}
                // color={theme.palette.whiteContainer}
                sx={{
                  [theme.breakpoints.down("md")]: {
                    padding: "5px 5px",
                    fontSize: "10px",
                  },
                }}
              >
                {" "}
                {isSmall ? t("Review") : t("Give a review")}
                {/*{t("Give a review")}*/}
              </Button>
            </Link>
            {configData?.refund_active_status && getToken() && (
              <OrderStatusButton
                background={theme.palette.error.light}
                onClick={() => setOpenModal(true)}
                // color={theme.palette.whiteContainer}
              >
                {isSmall ? t("Refund") : t("Refund Request")}
              </OrderStatusButton>
            )}
          </Stack>
        )}
      {trackData &&
      trackData?.payment_method === "digital_payment" &&
      trackData?.payment_status === "unpaid" &&
      zoneData?.data?.zone_data?.[0]?.cash_on_delivery ? (
        <OrderStatusButton
          background={theme.palette.primary.main}
          onClick={() => setModalOpenForPayment(true)}
          // color={theme.palette.whiteContainer}
        >
          {isSmall ? t("Switch to COD") : t("Switch to cash on delivery")}
        </OrderStatusButton>
      ) : trackData?.payment_status === "unpaid" && trackData?.order_status !== "failed" ? (
        <OrderStatusButton
          background={theme.palette.warning.main}
          // color={theme.palette.whiteContainer}
        >
          {t("Payment Processing")}
        </OrderStatusButton>
      ) : (
        <>
          {trackData && trackData?.order_status === "failed" ? (
            <PaymentUpdate
              id={id}
              refetchOrderDetails={refetch}
              refetchTrackData={refetchTrackData}
              trackData={trackData}
              isSmall={isSmall}
            />
          ) : (
            (trackData?.order_status === "pending" || trackData?.order_status === "confirmed") && (
              <OrderStatusButton
                background={theme.palette.error.deepLight}
                onClick={() => setCancelOpenModal(true)}
                // color={theme.palette.whiteContainer}
                // sx={{ marginInlineStart: "auto" }}
              >
                {t("Cancel Order")}
              </OrderStatusButton>
            )
          )}
          {trackData?.order_status === "processing" || 
           trackData?.order_status === "handover" || 
           trackData?.order_status === "picked_up" || 
           trackData?.order_status === "accepted" ? (
            <OrderStatusButton
              background={theme.palette.warning.main}
              // color={theme.palette.whiteContainer}
            >
              {t("Order in Progress")}
            </OrderStatusButton>
          ) : null}
        </>
      )}
      <CustomModal
        openModal={orderDetailsModal}
        handleClose={() => handleOfflineClose()}
      >
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ position: "relative" }}
        >
          <IconButton
            onClick={() => handleOfflineClose()}
            sx={{
              zIndex: "99",
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: (theme) => theme.palette.neutral[100],
              borderRadius: "50%",
              [theme.breakpoints.down("md")]: {
                top: 10,
                right: 5,
              },
            }}
          >
            <CloseIcon sx={{ fontSize: "24px", fontWeight: "500" }} />
          </IconButton>
        </CustomStackFullWidth>
        <OfflineOrderDetailsModal
          trackData={trackData}
          trackDataIsLoading={trackDataIsLoading}
          trackDataIsFetching={trackDataIsFetching}
          handleOfflineClose={handleOfflineClose}
          page={page}
        />
      </CustomModal>

      <CustomModal
        openModal={cancelOpenModal}
        setModalOpen={setCancelOpenModal}
        handleClose={() => setCancelOpenModal(false)}
      >
        <CancelOrder
          cancelReason={cancelReason}
          setCancelReason={setCancelReason}
          cancelReasonsData={cancelReasonsData}
          setModalOpen={setCancelOpenModal}
          handleOnSuccess={handleOnSuccess}
          orderLoading={orderLoading}
        />
      </CustomModal>

      <CustomModal
        openModal={openModalForPayment}
        setModalOpen={setModalOpenForPayment}
        handleClose={() => setModalOpenForPayment(false)}
      >
        <DigitalPaymentManage
          setModalOpenForPayment={setModalOpenForPayment}
          setModalOpen={setOpenModal}
          refetchOrderDetails={refetchOrderDetails}
          refetchTrackData={refetchTrackData}
          id={trackData?.id}
        />
      </CustomModal>
    </CustomStackFullWidth>
    // </HeadingBox>
  );
};

export default TopDetails;
```

### src/components/profile/basic-information/BasicInformationForm.js

**Changes Made:**
- Made the username TextField read-only by adding `readOnly: true` to InputProps
- This prevents users from editing their username after registration
- Change is located in the TextField component for the "name" field

**Key Change Location:**
- Around line 320: Added `readOnly: true` to the username TextField InputProps
- Removed `onChange={profileFormik.handleChange}` from the name field

**Modified Code:**
```jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Grid,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import ValidationSechemaProfile from "./Validation";
import IconButton from "@mui/material/IconButton";
import toast from "react-hot-toast";
import { useDeleteProfile } from "api-manage/hooks/react-query/profile/useDeleteProfile";
import { useRouter } from "next/router";
import ImageUploaderWithPreview from "../../single-file-uploader-with-preview/ImageUploaderWithPreview";
import useUpdateProfile from "../../../api-manage/hooks/react-query/profile/useUpdateProfile";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "api-manage/api-error-response/ErrorResponses";
import { setUser } from "redux/slices/profileInfo";
import { useDispatch } from "react-redux";
import ImageAddIcon from "../../single-file-uploader-with-preview/ImageAddIcon";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CustomAlert from "../../alert/CustomAlert";
import FormSubmitButton from "../FormSubmitButton";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import VerifiedIcon from "components/profile/VerifiedIcon";
import CustomModal from "components/modal";
import OtpForm from "components/auth/sign-up/OtpForm";
import { auth } from "firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useFireBaseOtpVerify } from "api-manage/hooks/react-query/forgot-password/useFIreBaseOtpVerify";

export const BackIconButton = styled(IconButton)(({ theme }) => ({
  padding: "10px",
  borderRadius: "4px",
  justifyContent: "center",
  fontSize: "13px",
  color: theme.palette.primary.main,
}));
export const ResetButton = styled(Button)(({ theme }) => ({
  borderRadius: "5px",
  borderColor: theme.palette.neutral[400],
  color: theme.palette.neutral[400],
  marginRight: "5px",
  paddingInline: "30px",
}));

export const convertValuesToFormData = (values, resData, verificationId) => {
  const { name, phone, email, image, button_type, reset_token, password } =
    values;
  let formData = new FormData();
  if (values?.reset_token) {
    formData.append("name", name ?? resData?.name);
    // formData.append('l_name', l_name ?? resData?.l_name)
    formData.append(
      "phone",
      resData?.verification_on === "email"
        ? resData?.phone
        : phone ?? resData?.phone
    );
    formData.append("email", email ?? resData?.email);
    formData.append("image", image ?? resData?.image ?? resData?.image);
    formData.append("button_type", button_type ?? resData?.button_type);
    formData.append("otp", reset_token ? reset_token : null);
    formData.append(
      "verification_medium",
      reset_token ? resData?.verification_medium : null
    );
    formData.append(
      "verification_on",
      reset_token ? resData?.verification_on : null
    );
    formData.append("session_info", verificationId);
  } else {
    formData.append("name", name ?? resData?.name);
    formData.append("phone", phone ?? resData?.phone);
    formData.append("email", email ?? resData?.email);
    formData.append("image", image ?? resData?.image ?? resData?.image);
    if (button_type) {
      formData.append("button_type", button_type);
    } else if (resData?.button_type) {
      formData.append("button_type", resData.button_type);
    }

    formData.append("password", password ?? resData?.password);
  }
  return formData;
};
const BasicInformationForm = ({
  data,
  configData,
  t,
  refetch,
  setEditProfile,
  formSubmit,
  handleCloseEmail,
  handleClosePhone,
  handleClick,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openEmail, setOpenEmail] = React.useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [resData, setResData] = React.useState([]);
  const [loginValue, setLoginValue] = useState(null);
  const recaptchaWrapperRef = useRef(null);
  const imageContainerRef = useRef();
  const { f_name, l_name, phone, email, image_full_url } = data;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const customerImageUrl = configData?.base_urls?.customer_image_url;
  const dispatch = useDispatch();
  const profileFormik = useFormik({
    initialValues: {
      name: f_name ? `${f_name} ${l_name ? l_name : ""}` : "",
      email: email ? email : "",
      phone: phone ? phone : "",
      image: image_full_url ? image_full_url : "",
      password: "",
      confirm_password: "",
    },
    validationSchema: ValidationSechemaProfile(),
    onSubmit: async (values, helpers) => {
      try {
        formSubmitOnSuccess(values);
      } catch (err) {}
    },
  });
  const { mutate: fireBaseOtpMutation, isLoading: fireIsLoading } =
    useFireBaseOtpVerify();
  const setUpRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-update",
        {
          size: "invisible",
          callback: (response) => {
            // console.log("Recaptcha verified", response);
          },
          "expired-callback": () => {
            window.recaptchaVerifier?.reset();
          },
        },
        auth
      );
    } else {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
      // setUpRecaptcha()
    }
  };

  useEffect(() => {
    setUpRecaptcha();
    return () => {
      if (recaptchaWrapperRef.current) {
        //recaptchaWrapperRef.current.clear(); // Clear Recaptcha when component unmounts
        recaptchaWrapperRef.current = null;
      }
    };
  }, []);
  const sendOTP = (response, values) => {
    const phoneNumber = values?.phone;
    if (!phoneNumber) {
      console.error("Invalid phone number");
      return;
    }

    if (!window.recaptchaVerifier) {
      setUpRecaptcha();
    }
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setOpen(true);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  const { mutate: profileUpdateByMutate, isLoading } = useUpdateProfile();
  const formSubmitOnSuccess = (values) => {
    const onSuccessHandler = (response) => {
      if (response) {
        setResData({
          ...resData,
          ...response,
          name: values?.name,
          // l_name: l_name,
          phone: values?.phone,
          email: values?.email,
          image: values?.image,
          button_type: values?.button_type,
        });
        if (response?.otp_send) {
          if (response?.verification_on === "phone") {
            if (configData?.firebase_otp_verification === 1) {
              sendOTP(response, values);
            } else {
              setOpen(true);
            }
          } else {
            setOpenEmail(true);
          }
        } else {
          setOpenEmail(false);
          setOpen(false);
          toast.success(response?.message);
          refetch();
          handleClick();
        }
      }
    };

    const formData = convertValuesToFormData(values, resData, verificationId);
    profileUpdateByMutate(formData, {
      onSuccess: onSuccessHandler,
      onError: (error) => {
        if (Array.isArray(error?.response?.data?.errors)) {
          return onErrorResponse(error);
        } else {
          toast.error(error?.response?.data?.message);
        }
      },
    });
  };
  const singleFileUploadHandlerForImage = (value) => {
    profileFormik.setFieldValue("image", value.currentTarget.files[0]);
  };
  const imageOnchangeHandlerForImage = (value) => {
    profileFormik.setFieldValue("image", value);
  };
  const router = useRouter();
  const onSuccessHandlerForUserDelete = (res) => {
    if (res?.errors) {
      toast.error(res?.errors?.[0]?.message);
    } else {
      localStorage.removeItem("token");
      toast.success(t("Account has been deleted"));
      dispatch(setUser(null));
      router.push("/", undefined, { shallow: true });
    }
    setOpenModal(false);
  };
  const { mutate, isLoading: isLoadingDelete } = useDeleteProfile(
    onSuccessHandlerForUserDelete
  );
  const deleteUserHandler = () => {
    mutate();
  };
  const handleReset = () => {
    profileFormik.setFieldValue("name", "");
    profileFormik.setFieldValue("l_name", "");
    profileFormik.setFieldValue("email", "");
    profileFormik.setFieldValue("password", "");
  };
  const handleVerified = (type) => {
    if (type === "email") {
      formSubmitOnSuccess({ ...profileFormik?.values, button_type: "email" });
    } else {
      formSubmitOnSuccess({ ...profileFormik?.values, button_type: "phone" });
    }
  };
  return (
    <>
      <Grid item md={12} xs={12} alignSelf="center">
        <div ref={recaptchaWrapperRef}>
          <div id="recaptcha-update"></div>
        </div>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle2" fontWeight="700">
            {t("Edit Personal Details")}
          </Typography>
          <BackIconButton onClick={() => setEditProfile(false)}>
            <ArrowBackIosNewIcon
              sx={{
                fontSize: "10px",
                color: (theme) => theme.palette.primary.main,
                fontWeight: "700",
                marginRight: "3px",
              }}
            />
            {t("Go Back")}
          </BackIconButton>

          {/*<ButtonBox onClick={() => setOpenModal(true)}>*/}
          {/*  <Button*/}
          {/*    variant="outlined"*/}
          {/*    type="submit"*/}
          {/*    startIcon={<PersonRemoveIcon />}*/}
          {/*  >*/}
          {/*    <Typography fontWeight="400" fontSize="12px">*/}
          {/*      {t("Delete My Account")}*/}
          {/*    </Typography>*/}
          {/*  </Button>*/}
          {/*</ButtonBox>*/}
        </Stack>
      </Grid>
      <form noValidate onSubmit={profileFormik.handleSubmit}>
        <Grid
          container
          md={12}
          xs={12}
          spacing={{ xs: 2, sm: 2, md: 3 }}
          paddingRight={{ xs: "0px", md: "60px" }}
          paddingLeft={{ xs: "0px", md: "60px" }}
          marginLeft="0px"
        >
          <Grid item md={12} xs={12} textAlign="-webkit-center">
            <Stack
              sx={{
                position: "relative",
                width: "140px",
                borderRadius: "50%",
              }}
            >
              <ImageUploaderWithPreview
                type="file"
                labelText={t("Upload your photo")}
                hintText="Image format - jpg, png, jpeg, gif Image Size - maximum size 2 MB Image Ratio - 1:1"
                file={profileFormik.values.image}
                onChange={singleFileUploadHandlerForImage}
                imageOnChange={imageOnchangeHandlerForImage}
                width="8.125rem"
                // imageUrl={customerImageUrl}
                borderRadius="50%"
                objectFit
                //height='140px'
              />
              {image_full_url && (
                <ImageAddIcon
                  imageChangeHandler={singleFileUploadHandlerForImage}
                />
              )}
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              sx={{ width: "100%" }}
              InputProps={{
                style: {
                  height: "45px", // Set your desired height value here
                },
                readOnly: true,
              }}
              id="outlined-basic"
              variant="outlined"
              name="name"
              value={profileFormik.values.name}
              label={t("User Name")}
              required
              error={
                profileFormik.touched.name && Boolean(profileFormik.errors.name)
              }
              helperText={
                profileFormik.touched.name && profileFormik.errors.name
              }
              touched={profileFormik.touched.name && "true"}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Stack position="relative">
              <TextField
                sx={{ width: "100%" }}
                InputProps={{
                  style: {
                    height: "45px", // Set your desired height value here
                  },
                }}
                id="outlined-basic"
                // label="Enter Email"
                variant="outlined"
                name="email"
                value={profileFormik.values.email}
                onChange={profileFormik.handleChange}
                label={t("Email")}
                required
                error={
                  profileFormik.touched.email &&
                  Boolean(profileFormik.errors.email)
                }
                helperText={
                  profileFormik.touched.email && profileFormik.errors.email
                }
                touched={profileFormik.touched.email && "true"}
              />
              <Stack
                sx={{
                  position: "absolute",
                  right: "10px",
                  top: "12px",
                }}
              >
                <>
                  {" "}
                  {email && (
                    <>
                      {data?.is_email_verified === "1" &&
                      email === profileFormik?.values.email ? (
                        <VerifiedIcon />
                      ) : (
                        <>
                          {configData?.centralize_login
                            ?.email_verification_status === 1 && (
                            <ReportProblemIcon
                              onClick={() => handleVerified("email")}
                              sx={{
                                color: (theme) => theme.palette.error.main,
                                width: "1.2rem",
                                cursor: "pointer",
                              }}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              </Stack>
            </Stack>
          </Grid>
          <Grid item md={6} xs={12}>
            <Stack position="relative">
              <TextField
                name="phone"
                disabled={data?.is_phone_verified === 1}
                label={
                  <span>
                    {t("Phone")}{" "}
                    {data?.is_phone_verified === 1 && (
                      <>
                        <span style={{ color: "red" }}>
                          ({t("Not Changeable")})
                        </span>{" "}
                      </>
                    )}
                  </span>
                }
                variant="outlined"
                sx={{ width: "100%" }}
                InputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  style: {
                    height: "45px", // Set your desired height value here
                  },
                }}
                value={profileFormik.values.phone}
                onChange={(e) => {
                  let inputValue = e.target.value;

                  // Allow + at the beginning and remove all non-numeric characters after the first position
                  if (inputValue[0] === "+") {
                    inputValue = `+${inputValue.slice(1).replace(/\D/g, "")}`;
                  } else {
                    inputValue = inputValue.replace(/\D/g, ""); // Remove all non-numeric characters
                  }

                  profileFormik.setFieldValue("phone", inputValue);
                }}
              />
              <Stack
                sx={{
                  position: "absolute",
                  right: "10px",
                  top: "12px",
                }}
              >
                {data?.is_phone_verified === 1 ? (
                  <VerifiedIcon />
                ) : (
                  <>
                    {configData?.centralize_login?.phone_verification_status ===
                      1 && (
                      <ReportProblemIcon
                        onClick={() => handleVerified("phone")}
                        sx={{
                          color: (theme) => theme.palette.error.main,
                          width: "1.2rem",
                          cursor: "pointer",
                        }}
                      />
                    )}
                  </>
                )}
              </Stack>
            </Stack>
          </Grid>
          {configData?.centralize_login?.manual_login_status === 1 ? (
            <>
              <Grid item md={6} xs={12}>
                <TextField
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: "100%" }}
                  id="password"
                  variant="outlined"
                  placeholder={t("Password")}
                  value={profileFormik.values.password}
                  onChange={profileFormik.handleChange}
                  name="password"
                  label={t("Password")}
                  type={showPassword ? "text" : "password"}
                  error={
                    profileFormik.touched.password &&
                    Boolean(profileFormik.errors.password)
                  }
                  helperText={
                    profileFormik.touched.password &&
                    profileFormik.errors.password
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowPassword((prevState) => !prevState)
                          }
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: {
                      height: "45px", // Set your desired height value here
                    },
                  }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={{ width: "100%" }}
                  id="confirm_password"
                  label={t("Confirm Password")}
                  variant="outlined"
                  placeholder={t("Confirm Password")}
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={profileFormik.values.confirm_password}
                  onChange={profileFormik.handleChange}
                  error={
                    profileFormik.touched.confirm_password &&
                    Boolean(profileFormik.errors.confirm_password)
                  }
                  helperText={
                    profileFormik.touched.confirm_password &&
                    profileFormik.errors.confirm_password
                  }
                  touched={profileFormik.touched.confirm_password && "true"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setConfirmShowPassword((prevState) => !prevState)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: {
                      height: "45px", // Set your desired height value here
                    },
                  }}
                />
              </Grid>
            </>
          ) : (
            ""
          )}

          <Grid item md={12} xs={12} align="end">
            <FormSubmitButton
              handleReset={handleReset}
              isLoading={isLoading}
              reset={t("Reset")}
              submit={t("Update Profile")}
            />
            {/*<ResetButton variant="outlined" onClick={handleReset}>*/}
            {/*  {t("Reset")}*/}
            {/*</ResetButton>*/}
            {/*<SaveButton variant="contained" type="submit" loading={isLoading}>*/}
            {/*  {t("Update Profile")}*/}
            {/*</SaveButton>*/}
          </Grid>
        </Grid>
      </form>
      {open && (
        <CustomModal
          openModal={open}
          handleClose={() => setOpen(false)}
          setModalOpen={setOpen}
        >
          <OtpForm
            data={data?.phone}
            handleClose={() => setOpen(false)}
            formSubmitHandler={formSubmitOnSuccess}
            loginValue={resData}
            reSendOtp={formSubmitOnSuccess}
          />
        </CustomModal>
      )}
      {openEmail && (
        <CustomModal
          handleClose={() => setOpenEmail(false)}
          openModal={openEmail}
          setModalOpen={setOpenEmail}
        >
          <OtpForm
            data={profileFormik?.values.email}
            handleClose={() => setOpenEmail(false)}
            formSubmitHandler={formSubmitOnSuccess}
            loginValue={resData}
            reSendOtp={formSubmitOnSuccess}
          />
        </CustomModal>
      )}
    </>
  );
};
export default BasicInformationForm;
```

## Migration Checklist

When applying these changes to a new version of the software:

### 1. OfflineOrderDetailsModal.js
- [ ] Add ErrorIcon and CancelIcon imports from @mui/icons-material
- [ ] Implement conditional icon rendering based on page flags
- [ ] Update title logic to show "Payment Failed" for error scenarios
- [ ] Enhance message formatting with conditional Typography components
- [ ] Add Cash on Delivery messaging for failed payments

### 2. CenacelOrder.js
- [ ] **CRITICAL**: Verify if this component still exists in the new version
- [ ] Check if cancel order functionality was moved to another component
- [ ] If component exists but is functional, consider if it should be removed
- [ ] Update any imports/references that depend on this component

### 3. TopDetails.js
- [ ] Add "Payment Processing" button logic for unpaid non-failed orders
- [ ] Extend cancel button conditions to include "confirmed" order status
- [ ] Implement "Order in Progress" status button for active states
- [ ] Test all payment status combinations to ensure proper button display

### 4. BasicInformationForm.js
- [ ] Add `readOnly: true` to username TextField InputProps
- [ ] Remove `onChange` handler from name field if present
- [ ] Test that username field is no longer editable
- [ ] Verify form submission still works correctly

### Testing Requirements
- [ ] Test all payment status scenarios (success, cancel, fail)
- [ ] Verify order cancellation works for both pending and confirmed orders
- [ ] Test username field is read-only in profile editing
- [ ] Ensure all UI changes are responsive across device sizes
- [ ] Validate error handling and user feedback messages

### Potential Conflicts in New Version
- Component structure changes may require path adjustments
- New MUI version may have different import paths
- Theme palette properties may have changed names
- Translation keys (t()) may need updates