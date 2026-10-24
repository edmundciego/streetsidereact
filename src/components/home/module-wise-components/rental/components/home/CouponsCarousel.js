import { alpha, Button, Skeleton, useTheme } from "@mui/material";
import CustomSlider from "components/common/CustomSlider";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { HomeComponentsWrapper } from "../../../../HomePageComponents";
import { Box } from "@mui/system";
import H2 from "components/typographies/H2";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import CouponItems from "components/home/module-wise-components/rental/components/global/CouponItems";
import { useGetCouponLists } from "../../rental-api-manage/hooks/react-query/coupon/useCouponsLists";

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
const COUPONS_BREAKPOINTS = {
  577: { slidesPerView: 2 },
  993: { slidesPerView: 3.1 },
};

const VehicleCategories = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { data, isFetching } = useGetCouponLists();

  return (
    <>
      {data?.length > 0 && (
        <HomeComponentsWrapper
          bgcolor={
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : alpha(theme.palette.primary.main, 0.05)
          }
          sx={{
            padding: "20px 20px 1px",
            borderRadius: 2,
            cursor: "pointer",
          }}
        >
          <CustomStackFullWidth alignItems="center" justyfyContent="center" mb={3} spacing={1}>
            <CustomBoxFullWidth>
              {isFetching ? (
                <CustomSlider
                  items={Array.from({ length: 4 })}
                  renderItem={() => (
                    <Skeleton variant="rounded" height={100} width={335} />
                  )}
                  arrowVariant="section"
                  title={<Skeleton variant="text" width="110px" />}
                  trailing={<Skeleton width="100px" variant="80px" />}
                  autoplay
                  autoplayDelay={4000}
                  speed={800}
                  slidesPerView={1}
                  breakpoints={COUPONS_BREAKPOINTS}
                />
              ) : (
                <CustomSlider
                  items={data}
                  getKey={(item, index) => index}
                  renderItem={(item) => (
                    <Box sx={{ img: { borderRadius: ".5rem" } }}>
                      <CouponItems data={item} />
                    </Box>
                  )}
                  arrowVariant="section"
                  title={
                    <H2
                      text={t("Coupons")}
                      component="h2"
                      sx={{ color: (theme) => theme.palette.neutral[1000] }}
                    />
                  }
                  trailing={
                    <Link
                      href={{
                        pathname: "/profile",
                        query: { page: "coupons" },
                      }}
                      legacyBehavior
                    >
                      <Button
                        variant="text"
                        sx={{
                          transition: "all ease 0.5s",
                          textTransform: "capitalize",
                          "&:hover": {
                            letterSpacing: "0.03em",
                          },
                        }}
                      >
                        {t("See all")}
                      </Button>
                    </Link>
                  }
                  autoplay
                  autoplayDelay={4000}
                  speed={800}
                  slidesPerView={1}
                  breakpoints={COUPONS_BREAKPOINTS}
                />
              )}
            </CustomBoxFullWidth>
          </CustomStackFullWidth>
        </HomeComponentsWrapper>
      )}
    </>
  );
};

export default VehicleCategories;
