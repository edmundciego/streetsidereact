import {
  alpha,
  Box,
  Button,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomContainer from "../../container";
import LargerScreen from "./LargerScreen";
import SmallerScreen from "./SmallerScreen";

const Wrapper = styled(Box)(({ theme }) => ({
  background: `linear-gradient(112.54deg, rgba(255, 255, 255, 0.2) 0%, rgba(153, 245, 202, 0.2) 33.19%, ${alpha(
    theme.palette.primary.main,
    0.2
  )} 66.37%, rgba(255, 255, 255, 0.2) 99.56%)`,
  width: "100%",
  position: "relative",
}));
export const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: "10px",
  gap: "10px",
  padding: "12px 15px",
  fontSize: "16px",
  fontWeight: 700,
  maxWidth: "400px",
  background: `linear-gradient(133deg, ${theme.palette.primary.customType1} 0%, ${theme.palette.primary.main} 51.01%)`,
  color: theme.palette.whiteContainer.main,
  [theme.breakpoints.down("md")]: {
    padding: "12px 15px",
    fontSize: "14px",
    gap: "8px",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "10px",
    fontSize: "12px",
    gap: "5px",
  },
}));

const AppDownloadSection = ({ configData, landingPageData }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const goToApp = (s) => {
    window.open(s);
  };

  return (
    <CustomContainer>
      <Wrapper>
        <CustomStackFullWidth>
          {isSmall ? (
            <SmallerScreen
              theme={theme}
              landingPageData={landingPageData}
              goToApp={goToApp}
              t={t}
            />
          ) : (
            <LargerScreen
              landingPageData={landingPageData}
              goToApp={goToApp}
              t={t}
            />
          )}
        </CustomStackFullWidth>
      </Wrapper>
    </CustomContainer>
  );
};

AppDownloadSection.propTypes = {};

export default AppDownloadSection;
