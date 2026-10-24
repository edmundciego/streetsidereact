import {
  Box,
  IconButton,
  Skeleton,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CustomSlider from "components/common/CustomSlider";
import { setYouWillLoveItems } from "redux/slices/storedData";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import NewProductCard from "components/cards/newCard/NewProductCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import { useGetPopularServices } from "../../service-api-manage/hooks/react-query/popular-services";

// ─── Styled ────────────────────────────────────────────────────────────────

const Container = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  paddingTop: "24px",
  paddingBottom: "24px",
  overflow: "hidden",
  boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.05)",
  [theme.breakpoints.down("sm")]: {
    paddingTop: "16px",
    paddingBottom: "16px",
  },
}));

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  paddingLeft: "24px",
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "16px",
  },
  "& .slick-track": { marginLeft: 0 },
  "& .slick-slide": { paddingRight: "20px" },
  "& .slick-slide:first-child": { paddingLeft: 0 },
}));

// ─── Main ──────────────────────────────────────────────────────────────────

const PopularServices = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const { data, isFetched } = useGetPopularServices({
    offset: 1,
    type: "all",
  });

  const activeProducts = data?.services ?? [];

  const isActiveLoading = !isFetched;

  if (isFetched && !activeProducts.length) return null;

  return (
    <Container>
      <Stack gap="16px">
        <SliderWrapper>
          <CustomSlider
            items={!isFetched ? Array.from({ length: 5 }) : activeProducts}
            renderItem={(item) =>
              !isFetched ? (
                <ProductCardSimmer />
              ) : (
                <NewProductCard
                  variant="vertical"
                  item={item}
                  cardWidth={{ xs: "150px", md: "170px" }}
                />
              )
            }
            arrowVariant="section"
            title={
              !isFetched ? (
                <Box>
                  <Skeleton variant="text" width="160px" height="32px" />
                  <Skeleton variant="text" width="220px" height="20px" />
                </Box>
              ) : (
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: "20px", sm: "24px" },
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      lineHeight: 1.1,
                    }}
                  >
                    {t("Most Popular Services")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {t("Most trusted services chosen by thousands of users.")}
                  </Typography>
                </Box>
              )
            }
            headerSx={{ px: { xs: "16px", sm: "24px" } }}
            stretchItems={false}
            allowOverflowY={false}
            slidesPerView="auto"
            spaceBetween={16}
            breakpoints={{ 901: { spaceBetween: 20 } }}
          />
        </SliderWrapper>
      </Stack>
    </Container>
  );
};

export default PopularServices;
