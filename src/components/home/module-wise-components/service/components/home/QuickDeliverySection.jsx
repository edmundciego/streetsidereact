import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { Skeleton, Stack, Typography, useTheme, styled } from "@mui/material";
import { t } from "i18next";
import CustomSlider from "components/common/CustomSlider";
import { HomeComponentsWrapper } from "components/home/HomePageComponents";
import ExpressStoreCard from "components/cards/newCard/ExpressStoreCard";
import { useGetQuickEmergencyExperts } from "../../service-api-manage/hooks/react-query/quick-emergency-experts";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
const QUICK_DELIVERY_BREAKPOINTS = {
  401: { slidesPerView: 1.2 },
  481: { slidesPerView: 1.5 },
  601: { slidesPerView: 2 },
  761: { slidesPerView: 2.5 },
  901: { slidesPerView: 2.5, spaceBetween: 20 },
  1025: { slidesPerView: 2.8, spaceBetween: 20 },
};

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  // clip horizontal overflow but allow vertical for box-shadow
  "& .slick-list": {
    overflowX: "hidden",
    overflowY: "visible",
    padding: "0",
  },
  "& .slick-track": {
    marginLeft: 0,
    marginRight: "auto",
  },
  "& .slick-slide": {
    paddingRight: "20px",
  },
  "& .slick-slide:first-child": {
    paddingLeft: 0,
  },
  // NewStoreCard has fixed width:300px — override to fill slide
  "& .slick-slide > div > *": {
    width: "100% !important",
  },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": {
      paddingRight: "12px",
    },
  },
}));

const QuickDeliverySection = ({ title, subtitle, cardVariant = "" }) => {
  const theme = useTheme();
  const { data, isLoading } = useGetQuickEmergencyExperts({
    offset: 1,
    preview_count: 4,
  });
  const stores = data?.data ?? data?.providers ?? data?.experts ?? [];

  if (!isLoading && !stores.length) return null;

  return (
    <HomeComponentsWrapper sx={{ gap: "1rem" }}>
      <SliderWrapper>
        <CustomSlider
          items={isLoading ? Array.from({ length: 4 }) : stores}
          renderItem={(item) =>
            isLoading ? (
              <NewStoreCardSkeleton />
            ) : (
              <ExpressStoreCard
                store={item}
                items={(
                  item?.top_items ??
                  item?.top_services ??
                  item?.services ??
                  []
                ).map((service) => ({
                  ...service,
                  module_type: "service",
                }))}
              />
            )
          }
          arrowVariant="section"
          title={
            isLoading ? (
              <Skeleton variant="text" width="140px" />
            ) : (
              <Stack direction="row" alignItems="center" gap="12px">
                <Stack sx={{ gap: "2px" }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "18px", md: "24px" },
                      fontWeight: 700,
                      color: "neutral.1050",
                      lineHeight: 1.1,
                      letterSpacing: "-1.2px",
                    }}
                  >
                    {t(title ?? "Expert at Work")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "neutral.500",
                      lineHeight: 1.3,
                      display: { xs: "none", md: "block" },
                    }}
                  >
                    {t(
                      subtitle ??
                        "Discover professionals solving real problems",
                    )}
                  </Typography>
                </Stack>
              </Stack>
            )
          }
          slidesPerView={1.1}
          spaceBetween={16}
          breakpoints={QUICK_DELIVERY_BREAKPOINTS}
        />
      </SliderWrapper>
    </HomeComponentsWrapper>
  );
};

export default QuickDeliverySection;
