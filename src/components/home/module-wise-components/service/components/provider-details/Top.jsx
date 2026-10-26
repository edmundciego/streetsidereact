import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DirectionsIcon from "@mui/icons-material/Directions";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StarIcon from "@mui/icons-material/Star";
import {
  alpha,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  styled,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CustomSlider from "components/common/CustomSlider";
import { Box, Stack, keyframes } from "@mui/system";
import React, { useEffect, useReducer, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useAddStoreToWishlist } from "api-manage/hooks/react-query/wish-list/useAddStoreToWishLists";
import { useWishListStoreDelete } from "api-manage/hooks/react-query/wish-list/useWishListStoreDelete";
import { useGetStoreCouponList } from "api-manage/hooks/react-query/coupon/useGetStoreCouponList";
import useGetCartDiscountEligibility from "api-manage/hooks/react-query/add-cart/useGetCartDiscountEligibility";
import useGetProActiveOffer from "api-manage/hooks/react-query/pro-plans/useGetProActiveOffer";
import useSubscribeProPlan from "api-manage/hooks/react-query/pro-plans/useSubscribeProPlan";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getToken } from "helper-functions/getToken";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { addWishListStore, removeWishListStore } from "redux/slices/wishList";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import ProviderScheduleDrawer from "./ProviderScheduleDrawer";
import VerifiedStoreBadge from "components/cards/VerifiedStoreBadge";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { not_logged_in_message } from "utils/toasterMessages";
import CustomImageContainer from "components/CustomImageContainer";
import { StyledRating } from "components/CustomMultipleRatings";
import LocationViewOnMap from "components/Map/location-view/LocationViewOnMap";
import { useRouter } from "next/router";
import StoreShare from "components/store-details/StoreShare";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";
import ClosedNowScheduleWise from "components/closed-now/ClosedNowScheduleWise";
import CustomModal from "components/modal";
import dynamic from "next/dynamic";

const ProPlanSubscriptionModal = dynamic(() =>
  import("components/pro-plan/ProPlanSubscriptionModal")
);
const ProPlanPaymentModal = dynamic(() =>
  import("components/pro-plan/ProPlanPaymentModal")
);

// Announcement icon left-right flip animation (default facing left)
const adSpin = keyframes`
  0%   { transform: scaleX(-1); }
  50%  { transform: scaleX(1); }
  100% { transform: scaleX(-1); }
`;

// Card visuals ported from store-details/Top-2.js, adapted for the
// provider (service) dataset — no BOGO here, so only the pro / discount /
// coupon cards are needed.
const COUPON_PRO_ACCENT = "#3979E0";

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
const COUPON_SLIDER_BREAKPOINTS = {
  901: { slidesPerView: 2.8 },
  1201: { slidesPerView: 3.1 },
};

const CouponCard2 = styled(Box)(({ theme, variant }) => {
  const isDark = theme.palette.mode === "dark";
  const bg = {
    pro: isDark ? alpha("#2A61BA", 0.18) : "#F1F6FD",
    discount: isDark ? alpha(theme.palette.warning.main, 0.14) : "#FFFBEB",
  };
  return {
    position: "relative",
    width: "100%",
    boxSizing: "border-box",
    height: "100%",
    minHeight: 100,
    flexShrink: 0,
    borderRadius: "16px",
    border: `2px solid ${theme.palette.background.paper}`,
    backgroundColor: bg[variant] || bg.discount,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflow: "hidden",
  };
});

const ProBadge2 = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "2px",
  height: 20,
  padding: "2px 6px",
  borderRadius: 999,
  backgroundColor: theme.palette.background.paper,
  color: COUPON_PRO_ACCENT,
  fontSize: 14,
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: "-0.42px",
  flexShrink: 0,
}));

const PromoCouponCard2 = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  boxSizing: "border-box",
  height: "100%",
  minHeight: 100,
  flexShrink: 0,
  borderRadius: "16px",
  border: `2px solid ${theme.palette.background.paper}`,
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.error.main, 0.14)
      : "#FEE9E7",
  overflow: "hidden",
  cursor: "pointer",
}));

const TicketCutOut2 = styled(Box)(({ theme, side }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: 20,
  height: 20,
  borderRadius: "50%",
  backgroundColor: theme.palette.background.default,
  border: `2px solid ${theme.palette.background.paper}`,
  ...(side === "left" ? { left: -10 } : { right: -10 }),
}));

const PageBackground = styled(Box)(() => ({
  width: "100%",
}));

const HeroCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    borderRadius: "0 0 16px 16px",
    border: "none",
    width: "100%",
    boxShadow: `0px 4px 12px ${alpha(theme.palette.text.primary, 0.08)}`,
  },
}));

const LogoBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "68px",
  height: "68px",
  borderRadius: "12px",
  overflow: "hidden",
  flexShrink: 0,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("md")]: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
  },
}));

const BannerWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  minHeight: "180px",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    minHeight: "160px",
    borderRadius: "0 0 8px 8px",
  },
}));

const FloatingIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.92),
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  backdropFilter: "blur(4px)",
  boxShadow: `0px 2px 6px ${alpha(theme.palette.text.primary, 0.12)}`,
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
  },
}));

const initialState = {
  viewMap: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "setViewMap":
      return {
        ...state,
        viewMap: action.payload,
      };
    default:
      return state;
  }
};

const Top = (props) => {
  const {
    bannerCover,
    providerDetails,
    configData,
    logo,
    storeShare,
    bannersData,
    isLoading,
    setOpenReviewModal,
    onCondensedHeaderChange,
  } = props;
  const [state, dispatchLocal] = useReducer(reducer, initialState);
  const theme = useTheme();
  const [openShareModel, setOpenShareModel] = useState(false);
  const [openAnnouncementModal, setOpenAnnouncementModal] = useState(false);
  const [openScheduleDrawer, setOpenScheduleDrawer] = useState(false);
  const dispatchRedux = useDispatch();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const router = useRouter();

  // Pro benefit + store-discount eligibility — same data sources Top-2.js
  // (store-details) uses, keyed on the provider instead of a store.
  const proFeatureEnabled = configData?.pro_member_status === 1;
  const hasToken = !!getToken();
  const { data: activeOfferRaw, isLoading: activeOfferLoading } =
    useGetProActiveOffer({ enabled: proFeatureEnabled && hasToken });
  const activeOffer = activeOfferRaw?.data ?? activeOfferRaw ?? null;
  const isProActive = hasToken && activeOffer?.status === true;
  const proBenefit = activeOffer?.benefit ?? null;
  const { data: cartDiscountEligibility } = useGetCartDiscountEligibility(
    providerDetails?.id,
    !!providerDetails?.id
  );
  const [proModalOpen, setProModalOpen] = useState(false);
  const [proPaymentOpen, setProPaymentOpen] = useState(false);
  const [proSelectedPlan, setProSelectedPlan] = useState(null);
  const subscribeProMutation = useSubscribeProPlan();
  const handleProSubscribeClick = () => {
    if (!hasToken) {
      toast.error(t("Please login to subscribe"));
      return;
    }
    setProModalOpen(true);
  };
  const handleProSubscribe = (plan) => {
    if (!plan) return;
    if (plan.price === 0) {
      subscribeProMutation.mutate(
        {
          plan_id: plan.id,
          payment_type: "free_trial",
          payment_method: "free_trial",
          callback_url:
            typeof window !== "undefined" ? window.location.href : "",
        },
        {
          onSuccess: (res) => {
            const redirect = res?.redirect_link ?? res?.data?.redirect_link;
            if (redirect && typeof window !== "undefined") {
              window.location.href = redirect;
              return;
            }
            toast.success(t("Subscribed successfully"));
            setProModalOpen(false);
          },
          onError: (err) => {
            toast.error(
              err?.response?.data?.message || t("Subscription failed")
            );
          },
        }
      );
      return;
    }
    setProSelectedPlan(plan);
    setProModalOpen(false);
    setProPaymentOpen(true);
  };

  const { data: providerCouponData } = useGetStoreCouponList(
    providerDetails?.id
  );
  const rawApiCoupons = Array.isArray(providerCouponData?.data)
    ? providerCouponData.data
    : Array.isArray(providerCouponData)
    ? providerCouponData
    : [];
  const apiProviderCoupons = rawApiCoupons.filter((coupon) => {
    if (coupon?.coupon_type === "pro_customer") return true;
    // Zone-wide coupons carry no store_id at all — they apply to every
    // store/provider in the zone, so they're always relevant here.
    if (coupon?.coupon_type === "zone_wise") return true;
    return (
      coupon?.store_id != null &&
      String(coupon.store_id) === String(providerDetails?.id)
    );
  });

  console.log("[Top.jsx] debug", {
    providerDetails,
    proFeatureEnabled,
    hasToken,
    activeOfferRaw,
    activeOfferLoading,
    activeOffer,
    isProActive,
    proBenefit,
    cartDiscountEligibility,
    providerCouponData,
    rawApiCoupons,
    apiProviderCoupons,
    "providerDetails.coupons": providerDetails?.coupons,
    "providerDetails.is_pro_discount_available":
      providerDetails?.is_pro_discount_available,
    "providerDetails.discount": providerDetails?.discount,
  });

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      const moduleParam =
        router.query.module ||
        router.query.module_type ||
        getCurrentModuleType();
      router.push(moduleParam ? `/home?module=${moduleParam}` : "/home");
    }
  };

  // Mobile-only condensed sticky header (back + store name) when top section scrolls out
  const heroSentinelRef = useRef(null);
  const [showCondensedHeader, setShowCondensedHeader] = useState(false);
  const onCondensedHeaderChangeRef = useRef(onCondensedHeaderChange);

  useEffect(() => {
    onCondensedHeaderChangeRef.current = onCondensedHeaderChange;
  }, [onCondensedHeaderChange]);

  useEffect(() => {
    let observer;
    // Wait one frame for navigation scroll handling before observing the hero.
    // Without this, on client-side navigation the previous page's scroll
    // position can briefly put the sentinel out of view and flash the header.
    const raf = requestAnimationFrame(() => {
      const sentinel = heroSentinelRef.current;
      if (!sentinel) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          const show = !entry.isIntersecting;
          setShowCondensedHeader(show);
          onCondensedHeaderChangeRef.current?.(show);
        },
        { threshold: 0, rootMargin: "0px" }
      );
      observer.observe(sentinel);
    });
    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hasStoreRatingOrReview =
    Number(providerDetails?.avg_rating) > 0 ||
    Number(providerDetails?.rating_count) > 0;

  const ACTION = {
    setViewMap: "setViewMap",
  };

  const openMapHandler = () => {
    dispatchLocal({ type: ACTION.setViewMap, payload: true });
  };

  const { wishLists } = useSelector((state) => state.wishList);

  let token = undefined;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const { mutate: addFavoriteMutation } = useAddStoreToWishlist();
  const addToFavorite = () => {
    if (token) {
      addFavoriteMutation(providerDetails?.id, {
        onSuccess: (response) => {
          if (response) {
            dispatchRedux(addWishListStore(providerDetails));
            toast.success(response?.message);
          }
        },
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      });
    } else toast.error(t(not_logged_in_message));
  };

  const isInWishList = () => {
    return !!wishLists?.store?.find(
      (wishStore) => wishStore.id === providerDetails?.id
    );
  };

  const onSuccessHandlerForDelete = (res) => {
    dispatchRedux(removeWishListStore(providerDetails?.id));
    toast.success(res.message, { id: "wishlist" });
  };

  const { mutate } = useWishListStoreDelete();
  const deleteWishlistStore = (id) => {
    mutate(id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };

  const handleBannerClick = (link) => {
    if (link) {
      window.open(link, "_blank");
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    toast(() => <span>{t("Your provider URL has been copied")}</span>);
  };

  const ratingValue =
    Number(providerDetails?.avg_rating) === 0
      ? 0
      : providerDetails?.avg_rating
      ? Number(providerDetails?.avg_rating)
      : 0;

  const discount = providerDetails?.discount;
  const discountPercentText = discount
    ? discount.discount_type === "percent"
      ? `${discount.discount}% ${t("OFF")}`
      : `${getAmountWithSign(discount.discount)} ${t("OFF")}`
    : null;

  const renderBanner = () => {
    if (isLoading) {
      return <Skeleton variant="rectangular" width="100%" height="100%" />;
    }
    if (bannersData?.length) {
      return (
        <Box sx={{ width: "100%", height: "100%" }}>
          <CustomSlider
            items={bannersData}
            getKey={(banner) => banner?.id}
            renderItem={(banner) => (
              <Stack
                onClick={() => handleBannerClick(banner?.default_link)}
                sx={{ cursor: "pointer", width: "100%", height: "100%" }}
              >
                <CustomImageContainer
                  src={banner?.image_full_url}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  borderRadius="16px"
                />
              </Stack>
            )}
            arrowVariant="none"
            allowOverflowY={false}
            loop={bannersData.length > 1}
            autoplay={bannersData.length > 1}
            autoplayDelay={4000}
            speed={800}
            slidesPerView={1}
          />
        </Box>
      );
    }
    return (
      <CustomImageContainer
        src={bannerCover}
        width="100%"
        height="100%"
        objectFit="cover"
      />
    );
  };

  return (
    <PageBackground>
      {/* Mobile-only condensed sticky header — appears when hero scrolls out */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          backgroundColor: theme.palette.background.paper,
          boxShadow: (theme) =>
            `0px 2px 8px ${alpha(theme.palette.text.primary, 0.06)}`,
          transform: showCondensedHeader
            ? "translateY(0)"
            : "translateY(-100%)",
          transition: "transform 200ms ease",
          willChange: "transform",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ px: 1.5, py: 1.25 }}
        >
          <IconButton
            onClick={handleBack}
            size="small"
            sx={{
              p: 0.5,
              color: "neutral.1050",
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 24 }} />
          </IconButton>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "neutral.1050",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
              flex: 1,
            }}
          >
            {providerDetails?.name}
          </Typography>
        </Stack>
      </Box>

      <CustomStackFullWidth spacing={1.5}>
        {/* Hero card — breadcrumb + info on left, banner on right */}
        <HeroCard>
          <Grid container alignItems="stretch">
            <Grid
              item
              xs={12}
              md={7}
              sx={{
                p: { xs: 2, sm: 2.5 },
                order: { xs: 2, md: 1 },
              }}
            >
              {/* Breadcrumb */}
              <Box sx={{ mb: 1.75 }}>
                <CustomPageBreadCrumb
                  items={[
                    {
                      key: "home",
                      label: t("Home"),
                      icon: <HomeOutlinedIcon style={{ fontSize: "14px" }} />,
                      onRedirect: "/home",
                    },
                    {
                      key: "module",
                      label: t("Provider List"),
                      onRedirect: "/service/all-providers",
                    },
                    {
                      key: "provider",
                      label: providerDetails?.name || "",
                    },
                  ]}
                />
              </Box>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ height: "auto" }}
              >
                <LogoBox>
                  <CustomImageContainer
                    src={logo}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    borderRadius="12px"
                  />
                  <ClosedNowScheduleWise
                    active={providerDetails?.active}
                    schedules={providerDetails?.schedules}
                    open={providerDetails?.open}
                    borderRadius="12px"
                  />
                </LogoBox>

                <Stack flex={1} spacing={0.5} sx={{ minWidth: 0 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.75}
                    sx={{ minWidth: 0 }}
                  >
                    <Typography
                      ref={heroSentinelRef}
                      sx={{
                        fontSize: { xs: "18px", sm: "22px" },
                        fontWeight: 700,
                        color: "neutral.1050",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {providerDetails?.name}
                    </Typography>
                    <VerifiedStoreBadge
                      verified={providerDetails?.verified_seller}
                      fontSize="20px"
                    />
                  </Stack>

                  {providerDetails?.address && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      sx={{ minWidth: 0 }}
                    >
                      <LocationOnOutlinedIcon
                        sx={{
                          fontSize: "16px",
                          color: "neutral.500",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "neutral.600",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {providerDetails?.address}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Stack>

              {/* Stat pill cards — rating, service time, min booking */}
              {(() => {
                const displayRating = Number(
                  providerDetails?.avg_rating ?? 0
                ).toFixed(1);
                const displayReviewCount = providerDetails?.rating_count ?? 0;
                const displayServiceTime =
                  providerDetails?.delivery_time || "—";
                const displayMinBooking =
                  providerDetails?.minimum_order != null
                    ? getAmountWithSign(providerDetails.minimum_order)
                    : "—";
                const showReviews = Number(displayReviewCount) > 0;
                const showMinBooking =
                  Number(providerDetails?.minimum_order) > 0;

                return (
                  <Stack
                    direction="row"
                    alignItems="stretch"
                    spacing={1}
                    sx={{ mt: 1.5 }}
                  >
                    {showReviews && (
                      <Stack
                        onClick={() => setOpenReviewModal(true)}
                        sx={{
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "background.secondary",
                          borderRadius: "10px",
                          p: 1.1,
                          cursor: "pointer",
                        }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <StarIcon
                            sx={{
                              fontSize: "16px",
                              color: theme.palette.warning.main,
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "15px",
                              fontWeight: 700,
                              color: "neutral.1050",
                              lineHeight: 1.15,
                            }}
                          >
                            {displayRating}
                          </Typography>
                        </Stack>
                        <Typography
                          sx={{
                            fontSize: "11.5px",
                            color: "neutral.500",
                          }}
                        >
                          {displayReviewCount} {t("Reviews")}
                        </Typography>
                      </Stack>
                    )}

                    <Stack
                      sx={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "background.secondary",
                        borderRadius: "10px",
                        p: 1.1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "neutral.1050",
                          lineHeight: 1.15,
                        }}
                      >
                        {displayServiceTime}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "11.5px",
                          color: "neutral.500",
                        }}
                      >
                        {t("Est. Service Time")}
                      </Typography>
                    </Stack>

                    {showMinBooking && (
                      <Stack
                        sx={{
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "background.secondary",
                          borderRadius: "10px",
                          p: 1.1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "neutral.1050",
                            lineHeight: 1.15,
                          }}
                        >
                          {displayMinBooking}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "11.5px",
                            color: "neutral.500",
                          }}
                        >
                          {t("Min Booking")}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                );
              })()}
            </Grid>

            <Grid
              item
              xs={12}
              md={5}
              sx={{
                display: "flex",
                order: { xs: 1, md: 2 },
                "& > *": { width: "100%" },
              }}
            >
              <BannerWrapper sx={{ height: 210, minHeight: 210 }}>
                {renderBanner()}
                {/* Mobile-only back arrow */}
                <Box
                  sx={{
                    display: { xs: "block", md: "none" },
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 2,
                  }}
                >
                  <FloatingIconButton onClick={handleBack}>
                    <ChevronLeftIcon
                      sx={{
                        fontSize: "20px",
                        color: "neutral.1050",
                      }}
                    />
                  </FloatingIconButton>
                </Box>
                {/* Floating action buttons over banner */}
                <Stack
                  direction="row"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 2,
                    flexDirection: { xs: "row-reverse", md: "row" },
                    gap: { xs: 1.5, md: 0.75 },
                  }}
                >
                  {!isInWishList() ? (
                    <Tooltip title={t("Add to wishlist")} arrow>
                      <FloatingIconButton onClick={addToFavorite}>
                        <FavoriteBorderIcon
                          sx={{
                            fontSize: "16px",
                            color: theme.palette.primary.main,
                          }}
                        />
                      </FloatingIconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title={t("Remove from wishlist")} arrow>
                      <FloatingIconButton
                        onClick={() => deleteWishlistStore(providerDetails?.id)}
                      >
                        <FavoriteIcon
                          sx={{
                            fontSize: "16px",
                            color: theme.palette.primary.main,
                          }}
                        />
                      </FloatingIconButton>
                    </Tooltip>
                  )}
                  <Tooltip title={t("Location")} arrow>
                    <FloatingIconButton onClick={openMapHandler}>
                      <DirectionsIcon
                        sx={{
                          fontSize: "16px",
                          color: theme.palette.primary.main,
                        }}
                      />
                    </FloatingIconButton>
                  </Tooltip>
                  <Tooltip title={t("View Service Time")} arrow>
                    <FloatingIconButton
                      onClick={() => setOpenScheduleDrawer(true)}
                    >
                      <ScheduleOutlinedIcon
                        sx={{
                          fontSize: "16px",
                          color: theme.palette.primary.main,
                        }}
                      />
                    </FloatingIconButton>
                  </Tooltip>
                  <Tooltip title={t("Share")} arrow>
                    <FloatingIconButton onClick={() => setOpenShareModel(true)}>
                      <ShareOutlinedIcon
                        sx={{
                          fontSize: "16px",
                          color: theme.palette.primary.main,
                        }}
                      />
                    </FloatingIconButton>
                  </Tooltip>
                </Stack>

                {/* Announcement button — only shown when provider has announcement */}
                {providerDetails?.announcement === 1 && (
                  <Box
                    onClick={() => setOpenAnnouncementModal(true)}
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      zIndex: 3,
                      display: "flex",
                      flexDirection: "row-reverse", // icon stays right, text expands left
                      alignItems: "center",
                      height: 36,
                      borderRadius: "999px",
                      backgroundColor: theme.palette.customColor.newBadge,
                      cursor: "pointer",
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.20)",
                      "&:hover": {
                        "& .announcement-label": {
                          maxWidth: "140px",
                          pl: "12px",
                        },
                        "& .announcement-icon i": {
                          animationDuration: "0.6s",
                        },
                      },
                    }}
                  >
                    {/* Icon — fixed 36×36, always right, continuously spinning */}
                    <Box
                      className="announcement-icon"
                      sx={{
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <i
                        className="fi fi-sr-megaphone"
                        style={{
                          fontSize: 18,
                          display: "flex",
                          lineHeight: 1,
                          color: theme.palette.common.black,
                          animation: `${adSpin} 3s linear infinite`,
                        }}
                      />
                    </Box>
                    {/* Text — hidden under icon, slides left on hover */}
                    <Box
                      className="announcement-label"
                      sx={{
                        maxWidth: 0,
                        overflow: "hidden",
                        pl: 0,
                        transition:
                          "max-width 0.35s cubic-bezier(0.4,0,0.2,1), padding-left 0.35s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: theme.palette.common.black,
                          whiteSpace: "nowrap",
                          lineHeight: 1,
                          pr: "5px",
                        }}
                      >
                        {t("Announcement")}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </BannerWrapper>
            </Grid>
          </Grid>
        </HeroCard>

        {/* Coupons & discount slider — StackFood-style cards ported from
            store-details/Top-2.js, adapted to the provider dataset (no
            BOGO for service). */}
        {(() => {
          const coupons = [];
          // Same reasoning as Top-2.js: skip the Pro card entirely while
          // still waiting to know the real Pro benefit, rather than
          // flashing the generic provider discount first.
          const proBenefitPending = hasToken && activeOfferLoading;
          // Unlike stores, the service provider API never sends an
          // `is_pro_discount_available` flag — `proBenefit` itself (from
          // useGetProActiveOffer) is the only signal of whether Pro
          // discount applies here.
          if (proFeatureEnabled && proBenefit && !proBenefitPending) {
            const proHeading =
              Number(proBenefit?.percentage) > 0
                ? `${proBenefit.percentage}% ${t("OFF")}`
                : discountPercentText;
            if (proHeading) {
              const proCapAmount =
                Number(proBenefit?.max_amount) > 0
                  ? proBenefit.max_amount
                  : Number(discount?.max_discount) > 0
                  ? discount.max_discount
                  : null;
              const proCapText = proCapAmount
                ? ` (${t("up to")} ${getAmountWithSign(proCapAmount)})`
                : "";
              const proBody =
                proBenefit?.min_order_status &&
                Number(proBenefit?.min_order_amount) > 0
                  ? `${t("Min purchase")} ${getAmountWithSign(
                      proBenefit.min_order_amount
                    )}${proCapText} ${t(
                      "and special saving for mart pro members"
                    )}`
                  : Number(discount?.min_purchase) > 0
                  ? `${t("Min purchase")} ${getAmountWithSign(
                      discount.min_purchase
                    )}${proCapText} ${t(
                      "and special saving for mart pro members"
                    )}`
                  : proCapText
                  ? `${t("Special saving for mart pro members")}${proCapText}`
                  : t("Special saving for mart pro members");
              coupons.push({
                key: "pro",
                variant: "pro",
                heading: proHeading,
                body: proBody,
                showSubscribeButton: !isProActive,
              });
            }
          }
          // Provider discount can be null even when a live discount exists
          // — the eligibility endpoint is the fallback source, same as
          // Top-2.js's store-discount handling.
          const eligibilityPercent =
            Number(cartDiscountEligibility?.percentage) || 0;
          if (discount) {
            coupons.push({
              key: "discount",
              variant: "discount",
              heading: discountPercentText,
              body: `${t("Min purchase")} ${getAmountWithSign(
                discount?.min_purchase
              )} ${t("and special saving for")} ${getAmountWithSign(
                discount?.max_discount
              )}`,
            });
          } else if (eligibilityPercent > 0) {
            coupons.push({
              key: "discount",
              variant: "discount",
              heading: `${eligibilityPercent}% ${t("OFF")}`,
              body:
                Number(cartDiscountEligibility?.min_purchase) > 0
                  ? `${t("Min purchase")} ${getAmountWithSign(
                      cartDiscountEligibility.min_purchase
                    )} ${t("and special saving for")} ${getAmountWithSign(
                      cartDiscountEligibility?.max_discount
                    )}`
                  : t("Discount on all items"),
            });
          }
          const seenCouponKeys = new Set();
          const allCoupons = [
            ...(providerDetails?.coupons || []),
            ...apiProviderCoupons,
          ].filter((coupon) => {
            const key = coupon?.id ?? coupon?.code;
            if (key == null) return true;
            if (seenCouponKeys.has(key)) return false;
            seenCouponKeys.add(key);
            return true;
          });
          const ticketCoupons = allCoupons.map((coupon, idx) => {
            const expireDate = coupon?.expire_date || coupon?.end_date;
            return {
              key: `coupon-${coupon?.id ?? coupon?.code ?? idx}`,
              code: coupon?.code,
              heading:
                coupon?.discount_type === "percent"
                  ? `${coupon?.discount}% ${t("OFF")}`
                  : `${getAmountWithSign(coupon?.discount)} ${t("OFF")}`,
              startDate: coupon?.start_date,
              expireDate,
              minPurchase: coupon?.min_purchase,
            };
          });

          const slideCount = coupons.length + ticketCoupons.length;
          if (slideCount === 0) return null;

          return (
            <Box
              sx={{
                position: "relative",
                pl: { xs: 1, md: 0 },
                pr: { xs: 1, md: 0 },
              }}
            >
              <CustomSlider
                items={[
                  ...coupons.map((c) => ({ ...c, _kind: "coupon" })),
                  ...ticketCoupons.map((c) => ({ ...c, _kind: "ticket" })),
                ]}
                getKey={(item) => item.key}
                arrowVariant="none"
                allowOverflowY={false}
                speed={400}
                slidesPerView={1.15}
                spaceBetween={16}
                breakpoints={COUPON_SLIDER_BREAKPOINTS}
                renderItem={(c) =>
                  c._kind === "ticket" ? (
                    <PromoCouponCard2
                      onClick={() => {
                        if (!c.code) return;
                        navigator.clipboard.writeText(c.code);
                        toast.success(t("Coupon code copied."));
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{ pt: "12px", pb: "4px", px: "16px" }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ flex: 1, minWidth: 0 }}
                        >
                          <LocalOfferOutlinedIcon
                            sx={{
                              fontSize: 18,
                              color: "error.main",
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            noWrap
                            sx={{
                              fontSize: 14,
                              fontWeight: 500,
                              color:
                                theme.palette.mode === "dark"
                                  ? theme.palette.text.primary
                                  : "#1E1E1E",
                              lineHeight: 1.1,
                              letterSpacing: "-0.42px",
                            }}
                          >
                            {t("Code")}: {c.code}
                          </Typography>
                        </Stack>
                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 700,
                            color:
                              theme.palette.mode === "dark"
                                ? theme.palette.text.primary
                                : "#1E1E1E",
                            lineHeight: 1.1,
                            letterSpacing: "-0.48px",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {c.heading}
                        </Typography>
                      </Stack>

                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: "20px",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            left: "10px",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            borderTop: (theme) =>
                              `2px dashed ${theme.palette.background.paper}`,
                          }}
                        />
                        <TicketCutOut2 side="left" />
                        <TicketCutOut2 side="right" />
                      </Box>

                      <Box sx={{ pb: "12px", px: "16px" }}>
                        <Typography
                          sx={{
                            fontSize: 12,
                            color:
                              theme.palette.mode === "dark"
                                ? theme.palette.text.secondary
                                : "#757575",
                            lineHeight: 1.3,
                          }}
                        >
                          {c.startDate && c.expireDate
                            ? `${t("Valid from")} ${c.startDate} - ${
                                c.expireDate
                              }. ${t("Minimum order")} ${getAmountWithSign(
                                c.minPurchase
                              )}.`
                            : `${t("Minimum order")} ${getAmountWithSign(
                                c.minPurchase
                              )}.`}
                        </Typography>
                      </Box>
                    </PromoCouponCard2>
                  ) : (
                    <CouponCard2 variant={c.variant}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        justifyContent="space-between"
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ minWidth: 0 }}
                        >
                          {c.variant === "pro" ? (
                            <ProBadge2>
                              <StarIcon
                                sx={{ fontSize: 12, color: "#F0C048" }}
                              />
                              {t("Pro")}
                            </ProBadge2>
                          ) : (
                            <LocalOfferOutlinedIcon
                              sx={{
                                fontSize: 18,
                                color: "warning.main",
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <Typography
                            noWrap
                            sx={{
                              fontSize: 16,
                              fontWeight: 700,
                              color:
                                theme.palette.mode === "dark"
                                  ? theme.palette.text.primary
                                  : "#303030",
                              lineHeight: 1.1,
                              letterSpacing: "-0.48px",
                              textTransform: "capitalize",
                            }}
                          >
                            {c.heading}
                          </Typography>
                        </Stack>
                        {c.showSubscribeButton && (
                          <Box
                            component="button"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProSubscribeClick();
                            }}
                            sx={{
                              flexShrink: 0,
                              appearance: "none",
                              border: "none",
                              cursor: "pointer",
                              fontFamily: "inherit",
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#FFFFFF",
                              backgroundColor: COUPON_PRO_ACCENT,
                              borderRadius: "999px",
                              px: "10px",
                              py: "4px",
                            }}
                          >
                            {t("Subscribe")}
                          </Box>
                        )}
                      </Stack>
                      <Typography
                        sx={{
                          fontSize: 12,
                          color:
                            theme.palette.mode === "dark"
                              ? theme.palette.text.secondary
                              : "#757575",
                          lineHeight: 1.3,
                        }}
                      >
                        {c.body}
                      </Typography>
                    </CouponCard2>
                  )
                }
              />
            </Box>
          );
        })()}
      </CustomStackFullWidth>

      {state.viewMap && (
        <LocationViewOnMap
          open={state.viewMap}
          handleClose={() =>
            dispatchLocal({ type: ACTION.setViewMap, payload: false })
          }
          latitude={providerDetails?.latitude}
          longitude={providerDetails?.longitude}
          address={providerDetails?.address}
          storeDetails={providerDetails}
        />
      )}
      <ProviderScheduleDrawer
        open={openScheduleDrawer}
        onClose={() => setOpenScheduleDrawer(false)}
        schedules={providerDetails?.schedules}
      />
      {openShareModel && (
        <StoreShare
          handleCopy={handleCopy}
          setOpenShareModal={setOpenShareModel}
          openShareModal={openShareModel}
        />
      )}

      {/* Announcement Modal */}
      <CustomModal
        openModal={openAnnouncementModal}
        handleClose={() => setOpenAnnouncementModal(false)}
        closeButton
        maxWidth="500px"
      >
        <Box sx={{ pt: 0.5, px: { xs: 2, md: 3 }, pb: { xs: 8, md: 4 } }}>
          <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: theme.palette.customColor.newBadge,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <i
                className="fi fi-sr-megaphone"
                style={{
                  fontSize: 18,
                  display: "flex",
                  lineHeight: 1,
                  color: theme.palette.common.black,
                }}
              />
            </Box>
            <Typography
              sx={{ fontSize: "16px", fontWeight: 700, color: "text.primary" }}
            >
              {t("Announcement")}
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontSize: "14px",
              color: "text.secondary",
              lineHeight: 1.7,
              whiteSpace: "pre-line",
            }}
          >
            {providerDetails?.announcement_message ||
              t("No announcement available.")}
          </Typography>
        </Box>
      </CustomModal>

      {proFeatureEnabled && proModalOpen && (
        <ProPlanSubscriptionModal
          open={proModalOpen}
          onClose={() => setProModalOpen(false)}
          onSubscribe={handleProSubscribe}
          isSubmitting={subscribeProMutation.isLoading}
        />
      )}
      {proFeatureEnabled && proPaymentOpen && (
        <ProPlanPaymentModal
          open={proPaymentOpen}
          onClose={() => setProPaymentOpen(false)}
          plan={proSelectedPlan}
        />
      )}
    </PageBackground>
  );
};

Top.propTypes = {};

export default Top;
