import { alpha, Stack, Typography } from "@mui/material";
import CustomImageContainer from "components/CustomImageContainer";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import React from "react";
import CustomSlider from "components/common/CustomSlider";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";

const RentalCarDetailsBannerImg = ({
  cover_photo_url,
  bannerData,
  bannerLoading,
  data,
}) => {
  const tempBanner = Array.isArray(bannerData)
    ? [
        ...bannerData,
        {
          image_full_url: cover_photo_url,
        },
      ]
    : [
        {
          image_full_url: cover_photo_url,
        },
      ];

  const handleBannerClick = (link) => {
    if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <>
      <CustomBoxFullWidth
        sx={{
          borderRadius: "10px",
          height: { xs: "200px", sm: "265px", position: "relative" },
        }}
      >
        {tempBanner?.length ? (
          <CustomSlider
            items={tempBanner}
            getKey={(banner, index) => banner?.id ?? index}
            renderItem={(banner) => (
              <Stack
                onClick={
                  banner?.link ? () => handleBannerClick(banner?.link) : undefined
                }
                sx={{
                  cursor: banner?.link ? "pointer" : "default",
                  borderRadius: "10px",
                  height: { xs: "200px", sm: "265px" },
                }}
              >
                <CustomImageContainer
                  src={banner?.image_full_url}
                  width="100%"
                  height="100%"
                  borderRadius="10px"
                />
              </Stack>
            )}
            arrowVariant="none"
            loop={tempBanner.length > 1}
            autoplay={tempBanner.length > 1}
            autoplayDelay={3000}
            speed={800}
            slidesPerView={1}
          />
        ) : (
          <CustomImageContainer
            width="100%"
            height="100%"
            borderRadius="10px"
            src={cover_photo_url}
          />
        )}
        {data?.discount ? (
          <Stack
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.7),
              color: (theme) => theme.palette.neutral[100],
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            <Typography fontSize="13px" fontWeight="600" textAlign="center">
              {`${data?.discount?.discount}% discount will be applicable when booking amount is more than ${getAmountWithSign(
                data?.discount?.min_purchase
              )} max ${getAmountWithSign(
                data?.discount?.max_discount
              )} discount is applicable.`}

            </Typography>
          </Stack>
        ) : null}
      </CustomBoxFullWidth>
    </>
  );
};

export default RentalCarDetailsBannerImg;
