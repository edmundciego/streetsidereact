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
