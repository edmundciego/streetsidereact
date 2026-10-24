import { Button, Skeleton, Typography } from "@mui/material";
import CustomSlider from "components/common/CustomSlider";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { HomeComponentsWrapper } from "../../../../HomePageComponents";
import { useTranslation } from "react-i18next";

import RentalCategory from "../global/RentalCategory";
import { useGetCategoryVehicleLists } from "../../rental-api-manage/hooks/react-query/category/useGetCategoryLists";
import { useRouter } from "next/router";

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
const VEHICLE_CATEGORIES_BREAKPOINTS = {
  993: { slidesPerView: 6.5 },
};

const VehicleCategories = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    data: categories,
    isFetching,
    isLoading,
  } = useGetCategoryVehicleLists();

  const handleSeeAllClick = () => {
    router.push({
      pathname: "/rental/vehicle-search",
      query: {
        all_category: 1,
        ...(router.query.module ? { module: router.query.module } : {}),
      },
    });
  };

  return (
    <>
      {isLoading ? (
        <HomeComponentsWrapper sx={{ cursor: "pointer" }}>
          <CustomStackFullWidth
            alignItems="center"
            justyfyContent="center"
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

            <CustomBoxFullWidth>
              <CustomSlider
                items={Array.from({ length: 4 })}
                renderItem={() => (
                  <Skeleton variant="rounded" height={180} width={400} />
                )}
                arrowVariant="none"
                speed={800}
                slidesPerView={2}
                breakpoints={VEHICLE_CATEGORIES_BREAKPOINTS}
              />
            </CustomBoxFullWidth>
          </CustomStackFullWidth>
        </HomeComponentsWrapper>
      ) : categories?.vehicles?.length > 0 ? (
        <HomeComponentsWrapper sx={{ cursor: "pointer", pl: 0 }}>
          <CustomStackFullWidth alignItems="center" justyfyContent="center" spacing={1}>
            <CustomBoxFullWidth>
              <CustomSlider
                items={categories.vehicles}
                getKey={(item, index) => index}
                renderItem={(item) => <RentalCategory data={item} />}
                arrowVariant="section"
                title={
                  <Typography
                    sx={{
                      fontSize: { xs: "18px", md: "24px" },
                      fontWeight: 700,
                      color: "neutral.1050",
                      lineHeight: 1.1,
                      letterSpacing: "-1.2px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t("Vehicle Categories")}
                  </Typography>
                }
                trailing={
                  <Button
                    variant="text"
                    onClick={handleSeeAllClick}
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
                }
                speed={800}
                slidesPerView={2}
                breakpoints={VEHICLE_CATEGORIES_BREAKPOINTS}
              />
            </CustomBoxFullWidth>
          </CustomStackFullWidth>
        </HomeComponentsWrapper>
      ) : null}
    </>
  );
};

export default VehicleCategories;
