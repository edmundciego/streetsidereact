import React from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { useTranslation } from "react-i18next";

import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getInfoFromZoneData } from "utils/CustomFunctions";

// Min-order / free-delivery hint — shared by the empty state AND the
// with-items cart views (sidebar + mobile drawer). Free delivery is set up
// per (zone, module) now, not as a single admin-wide setting — read it off
// the current module's entry in the zone lookup response (zoneData.zone_data),
// same source/lookup getInfoFromZoneData() already uses for delivery pivots.
export const FreeDeliveryHint = ({ zoneData }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const freeDelivery = getInfoFromZoneData(zoneData)?.free_delivery;
  const freeDeliveryThreshold = Number(freeDelivery?.minimum_order_amount) || 0;
  const isAllStoreFree =
    freeDelivery?.status === true && freeDelivery?.type === "all_store";
  const isOfferActive =
    freeDelivery?.status === true &&
    (isAllStoreFree ||
      (freeDelivery?.type === "specific_criteria" && freeDeliveryThreshold > 0));

  if (!isOfferActive) return null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      justifyContent="center"
      sx={{ alignSelf: "stretch", px: 1.5, py: 1 }}
    >
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: theme.palette.warning.main,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <LocalShippingOutlinedIcon
          sx={{ fontSize: 11, color: theme.palette.whiteContainer.main }}
        />
      </Box>
      <Typography
        sx={{
          fontSize: "11.5px",
          color: theme.palette.text.primary,
          lineHeight: 1.3,
        }}
      >
        {isAllStoreFree ? (
          t("Free delivery on this order")
        ) : (
          <>
            {t("Order min")}{" "}
            <Box
              component="span"
              sx={{ fontWeight: 700, color: theme.palette.warning.dark }}
            >
              {getAmountWithSign(freeDeliveryThreshold)}
            </Box>{" "}
            {t("to get free delivery")}
          </>
        )}
      </Typography>
    </Stack>
  );
};

// Empty-cart placeholder shared by the desktop sidebar and mobile drawer.
const EmptyCartState = ({ zoneData }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ padding: "32px 24px 32px" }}
    >
      {/* Basket with sparkle lines */}
      <Box
        sx={{
          position: "relative",
          width: 64,
          height: 64,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {[12, 18, 12].map((h, i) => (
            <Box
              key={i}
              sx={{
                width: 2,
                height: h,
                borderRadius: 1,
                backgroundColor: theme.palette.error.main,
                transformOrigin: "bottom",
                transform:
                  i === 0 ? "rotate(-15deg)" : i === 2 ? "rotate(15deg)" : "none",
              }}
            />
          ))}
        </Stack>
        <Box
          component="img"
          src="/empty-cart-bag.svg"
          alt="Empty cart"
          sx={{ width: 80, height: 80 }}
        />
      </Box>

      <Stack alignItems="center" spacing={0.5}>
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 700,
            color: theme.palette.text.primary,
            textAlign: "center",
          }}
        >
          {t("Your Cart is Empty!")}
        </Typography>
        <Typography
          sx={{
            fontSize: "12.5px",
            color: theme.palette.text.secondary,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {t("To order with us add anything to your cart.")}
        </Typography>
      </Stack>

      <FreeDeliveryHint zoneData={zoneData} />
    </Stack>
  );
};

export default EmptyCartState;
