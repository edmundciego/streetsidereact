import { Grid, Skeleton, styled, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { getModuleId } from "../../helper-functions/getModuleId";
import { CustomBoxFullWidth } from "../../styled-components/CustomStyles.style";
import { textWithEllipsis } from "../../styled-components/TextWithEllipsis";
import CustomImageContainer from "../CustomImageContainer";
import NextImage from "components/NextImage";

const Wrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: "5px",
  border: "1px solid #EAEEF2",

  borderRadius: "10px",
  cursor: "pointer",
  width: "225px",
  transition: "all ease 0.5s",
  ".MuiTypography-h7": {
    transition: "all ease 0.5s",
  },
  "&:hover": {
    boxShadow: "0px 10px 20px rgba(88, 110, 125, 0.1)",
    ".MuiTypography-h7": {
      color: theme.palette.primary.main,
      letterSpacing: "0.02em",
    },
    img: {
      transform: "scale(1.1)",
    },
  },
}));
const ImageWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  position: "relative",
  borderRadius: "10px",
  height: "115px",
}));

const ShopCategoryCard = (props) => {
  const { item, imageUrl, onlyshimmer } = props;
  const { t } = useTranslation();
  const classes = textWithEllipsis();
  return (
    <Wrapper>


        <Link
          href={{
            pathname: "/home",
            query: {
              search: "category",
              id: `${item?.id}`,
              module_id: `${getModuleId()}`,
              name: item?.name && item?.name,
              data_type: "category",
            },
          }}
        >
          <Grid container>
            <Grid
              item
              xs={6}
              container
              sx={{ p: "8px" }}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12}>
                <Tooltip
                  title={item?.name}
                  placement="bottom"
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: (theme) => theme.palette.toolTipColor,
                        "& .MuiTooltip-arrow": {
                          color: (theme) => theme.palette.toolTipColor,
                        },
                      },
                    },
                  }}
                >
                  <Typography
                    variant="h7"
                    fontWeight="400"
                    className={classes.multiLineEllipsis}
                    component="h4"
                  >
                    {onlyshimmer ? <Skeleton variant="text" width="70px" /> : item?.name}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color="customColor.textGray"
                  component="span"
                >
                  {t("Explore Items")}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <ImageWrapper>
                {onlyshimmer ? (<Skeleton variant="ractangle" height="100%" width="100%" />) : (
                  <NextImage
                    height={115}
                    width={106}
                    src={imageUrl}
                    borderRadius="5px"
                    objectFit="cover"
                    //loading="loading"
                    bg="#ddd"
                  />
                )}
              </ImageWrapper>
            </Grid>
          </Grid>
        </Link>
    </Wrapper>
  );
};

ShopCategoryCard.propTypes = {};

export default ShopCategoryCard;
