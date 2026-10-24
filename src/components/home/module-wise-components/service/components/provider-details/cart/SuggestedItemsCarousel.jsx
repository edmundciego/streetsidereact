import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomSlider from "components/common/CustomSlider";

import SuggestedItemCard from "./SuggestedItemCard";

const SuggestedItemsCarousel = ({ suggestedItems }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (!suggestedItems?.length) return null;

  return (
    <Box
      sx={{
        mt: 2,
        pt: 1.5,
        pb: 1.5,
        pl: 1.5,
        borderRadius: "14px",
        backgroundColor:
          theme.palette.background.secondary || theme.palette.neutral?.[300],
      }}
    >
      <Typography
        sx={{
          mb: 1.25,
          pr: 1.5,
          fontSize: "14px",
          fontWeight: 700,
          color: theme.palette.text.primary,
        }}
      >
        {t("Also Booked Together")}
      </Typography>
      <CustomSlider
        items={suggestedItems}
        getKey={(rel) => rel?.id}
        renderItem={(rel) => <SuggestedItemCard item={rel} />}
        arrowVariant="none"
        speed={400}
        slidesPerView={Math.min(2.2, suggestedItems.length)}
        spaceBetween={8}
      />
    </Box>
  );
};

export default SuggestedItemsCarousel;
