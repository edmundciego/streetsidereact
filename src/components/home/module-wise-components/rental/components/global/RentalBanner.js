import React from "react";
import { Skeleton, styled, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import CustomSlider from "components/common/CustomSlider";
import Link from "next/link";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import NextImage from "components/NextImage";
import { useGetVehicleBannerList } from "../../rental-api-manage/hooks/react-query/banner/useGetVehicleBannerList";

// Same wrapper/UI as the shared Banners component
// (src/components/home/banners/index.js)
export const BannersWrapper = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  borderRadius: "16px",
  width: "100%",
  height: "150px",
  position: "relative",
  overflow: "hidden",
  img: {
    width: "100%",
    height: "100%",
  },

  "&:hover": {
    img: {
      transform: "scale(1.04)",
    },
  },

  [theme.breakpoints.down("sm")]: {
    height: "160px",
  },
}));

const RentalBanner = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: bannerLists, isLoading } = useGetVehicleBannerList();

  const banners = bannerLists?.banners ?? [];

  // Count-based slidesToShow — same approach as Banners.
  const getBannerCount = () => {
    if (banners.length === 1) return 1;
    if (banners.length === 2) return 2;
    return 3.1;
  };

  // react-slick breakpoint:600 meant "apply for width <= 600" (descending);
  // this Swiper breakpoint means "apply for width >= 601" (ascending).
  const bannerBreakpoints = {
    601: { slidesPerView: getBannerCount() },
  };

  // ── Business logic preserved (unchanged from the original RentalBanner) ──
  //   store_wise → rental provider page
  //   link       → external/internal link
  //   else       → no redirect
  const renderBanner = (item) => {
    const isClickable = item?.type === "store_wise" || !!item?.link;

    const banner = (
      <BannersWrapper sx={{ cursor: isClickable ? "pointer" : "default" }}>
        <NextImage
          src={item?.image_full_url}
          alt={item?.title}
          height={isSmallScreen ? "160" : "150"}
          width={300}
          objectFit="cover"
          borderRadius="16px"
        />
      </BannersWrapper>
    );

    if (item?.type === "store_wise") {
      return (
        <Link href={`/rental/provider/${item?.slug || item?.provider_id}`}>
          {banner}
        </Link>
      );
    }

    if (item?.link) {
      return <Link href={item?.link || ""}>{banner}</Link>;
    }

    return <Box>{banner}</Box>;
  };

  return (
    <CustomStackFullWidth
      sx={{
        mt: { xs: 0, sm: "10px" },
        "& .swiper-pagination": {
          position: "static",
          marginTop: { xs: "8px", sm: "10px" },
          display: "flex !important",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px",
        },
        "& .swiper-pagination-bullet": {
          width: 8,
          height: 8,
          margin: "0 !important",
          borderRadius: "50%",
          backgroundColor: (theme) =>
            theme.palette.action?.disabled || "#C7C7CC",
          opacity: 1,
        },
        "& .swiper-pagination-bullet-active": {
          backgroundColor: "primary.main",
          opacity: 1,
          transform: "scale(1.1)",
        },
        marginInlineStart: { xs: 0, sm: "-8px" },
      }}
    >
      {isLoading ? (
        <CustomSlider
          items={Array.from({ length: 2 })}
          renderItem={() => (
            <BannersWrapper>
              <Skeleton variant="rectangular" height="100%" width="100%" />
            </BannersWrapper>
          )}
          arrowVariant="none"
          allowOverflowY={false}
          slidesPerView={1.15}
          spaceBetween={16}
          breakpoints={bannerBreakpoints}
        />
      ) : (
        banners?.length > 0 && (
          <SliderCustom padding="0px">
            <CustomSlider
              items={banners}
              getKey={(item, index) => index}
              renderItem={(item) => renderBanner(item)}
              arrowVariant="none"
              allowOverflowY={false}
              showDots
              loop={banners.length > 1}
              autoplay={banners.length > 1}
              autoplayDelay={4000}
              speed={800}
              slidesPerView={1.15}
              spaceBetween={16}
              breakpoints={bannerBreakpoints}
            />
          </SliderCustom>
        )
      )}
    </CustomStackFullWidth>
  );
};

export default RentalBanner;
