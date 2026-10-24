import {
  Box,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NewProductCard from "components/cards/newCard/NewProductCard";
import CustomSlider from "components/common/CustomSlider";
import { HomeComponentsWrapper } from "components/home/HomePageComponents";
import { t } from "i18next";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { useGetRecommendedServices } from "../../service-api-manage/hooks/react-query/recommended-services";

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
const RECOMMENDED_SERVICES_BREAKPOINTS = {
  451: { slidesPerView: 1.5 },
  601: { slidesPerView: 2 },
  901: { slidesPerView: 2, spaceBetween: 20 },
  1025: { slidesPerView: 2.5, spaceBetween: 20 },
};

// ─── Styled ────────────────────────────────────────────────────────────────

const SectionWrapper = styled(Box)({
  width: "100%",
});

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
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
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": { paddingRight: "12px" },
  },
}));

// ─── Main ──────────────────────────────────────────────────────────────────

const RecommendedServices = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data } = useGetRecommendedServices({ offset: 1, type: "all" });

  const items = data?.services ?? [];

  if (!items.length) return null;

  return (
    <SectionWrapper>
      <HomeComponentsWrapper sx={{ gap: "1rem" }}>
        <SliderWrapper>
          <CustomSlider
            items={items}
            getKey={(item) => item.id}
            renderItem={(item) => (
              <NewProductCard
                max_width="100%"
                variant="horizontal"
                item={item}
                horizontalStyle={{
                  border: "none",
                  "&:hover": { boxShadow: "none" },
                }}
              />
            )}
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
              >
                {t("Recommended Services Nearby")}
              </Typography>
            }
            slidesPerView={1}
            spaceBetween={16}
            breakpoints={RECOMMENDED_SERVICES_BREAKPOINTS}
          />
        </SliderWrapper>
      </HomeComponentsWrapper>
    </SectionWrapper>
  );
};

export default RecommendedServices;
