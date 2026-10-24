import { Skeleton, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import CustomSlider from "components/common/CustomSlider";
import { getLanguage } from "helper-functions/getLanguage";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { RTL } from "components/rtl";
import { HomeComponentsWrapper } from "../../../../HomePageComponents";
import { useTranslation } from "react-i18next";
import { useGetTopRatedVehicleLists } from "../../rental-api-manage/hooks/top-rated/useGetTopRatedVehicleLists";
import { useRouter } from "next/router";
import CarCard from "../global/CarCard";

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
// Note: the 761-780 vs 781-992 dip (3.2 then down to 2) is preserved exactly
// as the original react-slick config specified.
const TOP_RATED_VEHICLES_BREAKPOINTS = {
  341: { slidesPerView: 1.2 },
  401: { slidesPerView: 1.4 },
  481: { slidesPerView: 2.2 },
  601: { slidesPerView: 3 },
  761: { slidesPerView: 3.2 },
  781: { slidesPerView: 2 },
  993: { slidesPerView: 4.5 },
};

const TopRatedVehicles = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const {
    data: topRatedVehicles,
    isFetching,
    isLoading,
  } = useGetTopRatedVehicleLists();
  const lanDirection = getLanguage() ? getLanguage() : "ltr";

  const handleSeemoreClick = () => {
    router.push({
      pathname: "/rental/vehicle-search",
      query: {
        top_rated: 1,
        ...(router.query.module ? { module: router.query.module } : {}),
      },
    });
  };

  return (
    <>
      {isLoading ? (
        <HomeComponentsWrapper sx={{ cursor: "pointer", mb: "50px" }}>
          <CustomStackFullWidth
            alignItems="center"
            justyfyContent="center"
            mb={3}
            spacing={1}
          >
            <CustomStackFullWidth
              alignItems="center"
              justifyContent="space-between"
              direction="row"
            >
              <Skeleton variant="text" width="110px" />
              <Skeleton width="100px" variant="80px" />
            </CustomStackFullWidth>

            <RTL direction={lanDirection}>
              <CustomBoxFullWidth>
                <CustomSlider
                  items={Array.from({ length: 4 })}
                  renderItem={() => (
                    <Skeleton variant="rounded" height={383} width={400} />
                  )}
                  arrowVariant="none"
                  speed={800}
                  slidesPerView={1.1}
                  breakpoints={TOP_RATED_VEHICLES_BREAKPOINTS}
                />
              </CustomBoxFullWidth>
            </RTL>
          </CustomStackFullWidth>
        </HomeComponentsWrapper>
      ) : topRatedVehicles?.vehicles?.length > 0 ? (
        <HomeComponentsWrapper
          sx={{
            cursor: "pointer",
            backgroundColor: theme.palette.background.paper,
            borderRadius: { xs: 0, md: "20px" },
            padding: 0,
            paddingBottom: { xs: 0, md: "3px" },
          }}
        >
          <CustomStackFullWidth
            alignItems="center"
            justyfyContent="center"
            mb={3}
            spacing={1.2}
          >
            <CustomStackFullWidth
              alignItems="flex-start"
              justifyContent="flex-start"
              direction="column"
              spacing={0.5}
              sx={{
                px: { xs: "16px", md: "20px" },
                pt: { xs: "16px", md: "16px" },
              }}
            >
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: "20px", md: "24px" },
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.2,
                  letterSpacing: "-0.5px",
                }}
              >
                {t("Discover Local Favorites")}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "13px", md: "14px" },
                  fontWeight: 400,
                  color: theme.palette.neutral[500],
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.4,
                }}
              >
                {t("Most trusted vehicles chosen by thousands of users.")}
              </Typography>
            </CustomStackFullWidth>

            <RTL direction={lanDirection}>
              <CustomBoxFullWidth sx={{ pl: { xs: "16px", md: "20px" } }}>
                <CustomSlider
                  items={topRatedVehicles?.vehicles ?? []}
                  getKey={(item, index) => index}
                  renderItem={(item) => (
                    <Box sx={{ img: { borderRadius: ".5rem" } }}>
                      <CarCard data={item} />
                    </Box>
                  )}
                  arrowVariant="none"
                  autoplay
                  autoplayDelay={4000}
                  speed={800}
                  slidesPerView={1.1}
                  breakpoints={TOP_RATED_VEHICLES_BREAKPOINTS}
                />
              </CustomBoxFullWidth>
            </RTL>
          </CustomStackFullWidth>
        </HomeComponentsWrapper>
      ) : null}
    </>
  );
};

export default TopRatedVehicles;
