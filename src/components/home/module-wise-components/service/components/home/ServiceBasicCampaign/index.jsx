import { Skeleton, Typography, styled } from "@mui/material";
import { Box } from "@mui/system";
import { t } from "i18next";
import { useRouter } from "next/router";
import CustomSlider from "components/common/CustomSlider";
import NextImage from "components/NextImage";
import { handleServiceRedirect } from "helper-functions/handleProductRedirect";
import useGetServiceCampaigns from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/campaigns/useGetServiceCampaigns";
import { HomeComponentsWrapper } from "components/home/HomePageComponents";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";

const ImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  borderRadius: "8px",
  aspectRatio: "1 / 1",
  overflow: "hidden",
  cursor: "pointer",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  "&:hover img": {
    transform: "scale(1.04)",
  },
}));

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
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
    paddingRight: "16px",
  },
  "& .slick-slide:first-child": {
    paddingLeft: 0,
  },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": {
      paddingRight: "12px",
    },
  },
}));

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
const SERVICE_CAMPAIGNS_BREAKPOINTS = {
  481: { slidesPerView: 2.8 },
  601: { slidesPerView: 3.5 },
  761: { slidesPerView: 4.5 },
  901: { slidesPerView: 4.5, spaceBetween: 20 },
  1025: { slidesPerView: 5.5, spaceBetween: 20 },
  1451: { slidesPerView: 6, spaceBetween: 20 },
};

const ServiceBasicCampaign = () => {
  const { data, isFetching } = useGetServiceCampaigns();
  const router = useRouter();

  const handleClick = (campaign) => {
    handleServiceRedirect(campaign, router, "campaign");
  };

  if (!isFetching && !data?.length) {
    return null;
  }

  return (
    <HomeComponentsWrapper sx={{ gap: "1rem" }}>
      <SliderWrapper>
        <CustomSlider
          items={isFetching ? Array.from({ length: 6 }) : data}
          renderItem={(item) =>
            isFetching ? (
              <ImageContainer>
                <Skeleton variant="rectangle" height="100%" width="100%" />
              </ImageContainer>
            ) : (
              <ImageContainer onClick={() => handleClick(item)}>
                <NextImage
                  src={item?.thumbnail_full_url}
                  alt={item?.name}
                  height={160}
                  width={160}
                  objectFit="cover"
                />
              </ImageContainer>
            )
          }
          arrowVariant="section"
          title={
            <Typography
              sx={{
                fontSize: { xs: "18px", md: "24px" },
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-1.2px",
              }}
              component="h2"
            >
              {t("Just For You")}
            </Typography>
          }
          allowOverflowY={false}
          slidesPerView={2.2}
          spaceBetween={16}
          breakpoints={SERVICE_CAMPAIGNS_BREAKPOINTS}
        />
      </SliderWrapper>
    </HomeComponentsWrapper>
  );
};

export default ServiceBasicCampaign;
