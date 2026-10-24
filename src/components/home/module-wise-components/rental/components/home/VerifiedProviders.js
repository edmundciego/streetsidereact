import { Typography, useTheme } from "@mui/material";
import CustomSlider from "components/common/CustomSlider";
import { useRouter } from "next/router";
import { getLanguage } from "helper-functions/getLanguage";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { RTL } from "components/rtl";
import { HomeComponentsWrapper } from "../../../../HomePageComponents";
import { useTranslation } from "react-i18next";
import RentalProviderCard from "../global/RentalProviderCard";
import { normalizeRentalProvider } from "../global/rentalProviderModel";

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
const VERIFIED_PROVIDERS_BREAKPOINTS = {
  577: { slidesPerView: 2 },
  769: { slidesPerView: 2.5 },
  993: { slidesPerView: 3.2 },
  1201: { slidesPerView: 3.5 },
};

const VerifiedProviders = ({ data, isLoading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const lanDirection = getLanguage() ? getLanguage() : "ltr";

  // Backend response can come back as either `data.providers`, `data.stores`,
  // or just a top-level array. Normalize each entry through
  // `normalizeRentalProvider` so the card props stay stable.
  const apiProvidersRaw =
    data?.providers ?? data?.stores ?? data?.data ?? data ?? null;
  const providers = Array.isArray(apiProvidersRaw)
    ? apiProvidersRaw.map(normalizeRentalProvider)
    : [];

  // Defensive: even if a parent forgets to gate on the list length, the
  // section bails out here so no empty / demo content sneaks through.
  if (providers.length === 0) return null;

  const handleProviderClick = (provider) => {
    const slugOrId = provider?.slug || provider?.id;
    if (!slugOrId) return;
    const moduleParam =
      typeof router.query.module === "string" ? router.query.module : "rental";
    router.push({
      pathname: `/rental/provider/${slugOrId}`,
      query: { module: moduleParam },
    });
  };

  return (
    <HomeComponentsWrapper sx={{ cursor: "default" }}>
      <CustomStackFullWidth
        alignItems="center"
        justifyContent="center"
        mb={2}
        spacing={1}
      >
        <CustomStackFullWidth
          alignItems="flex-start"
          justifyContent="flex-start"
          direction="column"
          spacing={0.5}
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
            {t("Verified Providers")}
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
            {t("Trust & secure buying experience.")}
          </Typography>
        </CustomStackFullWidth>

        <RTL direction={lanDirection}>
          <CustomBoxFullWidth>
            <CustomSlider
              items={providers}
              getKey={(provider) => provider.id}
              renderItem={(provider) => (
                <RentalProviderCard
                  data={provider}
                  onClick={() => handleProviderClick(provider)}
                />
              )}
              arrowVariant="none"
              speed={600}
              slidesPerView={1.2}
              breakpoints={VERIFIED_PROVIDERS_BREAKPOINTS}
            />
          </CustomBoxFullWidth>
        </RTL>
      </CustomStackFullWidth>
    </HomeComponentsWrapper>
  );
};

export default VerifiedProviders;
