import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Stack,
  Typography,
  alpha,
  styled,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import CustomSlider from "components/common/CustomSlider";
import CustomModal from "components/modal";
import CartStoreCard from "components/cards/newCard/CartStoreCard";
import useGetServiceLastBookings from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/booking/useGetServiceLastBookings";
import usePostServiceRebook, {
  rebookToastMessageHandler,
} from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/booking/usePostServiceRebook";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";

const formatTripDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ─── Styled ────────────────────────────────────────────────────────────────

const Container = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  padding: "24px 0px 24px 24px",
  boxShadow:
    "0px 1px 4px 0px rgba(0,0,0,0.05), 0px 1px 4px 0px rgba(0,0,0,0.10)",
  [theme.breakpoints.down("sm")]: {
    borderRadius: 0,
    boxShadow: "none",
    padding: "20px 0px 20px 16px",
    background:
      theme.palette.mode === "dark"
        ? `linear-gradient(180deg, ${theme.palette.warning.light}22 0%, ${theme.palette.background.default} 100%)`
        : "linear-gradient(180deg, #FFF1C2 0%, #F7F7F7 100%)",
  },
}));

// CartStoreCard has its own fixed width (280px / 364px for "running"), so
// the slider sizes slides to the card's real content width via "auto"
// rather than a computed fractional cell.
const LAST_BOOKING_GAP_BREAKPOINTS = {
  901: { spaceBetween: 20 },
};

// ─── Main ──────────────────────────────────────────────────────────────────

const ServiceLastBookingSection = ({ title, store_id }) => {
  const theme = useTheme();
  const [reorderingId, setReorderingId] = useState(null);
  const [pendingReorder, setPendingReorder] = useState(null); // { orderId, storeName }
  const { cartList } = useSelector((state) => state.cart);
  const { configData } = useSelector((state) => state.configData);
  const canRebook = Boolean(configData?.service_module?.rebooking_option);

  const { data } = useGetServiceLastBookings({
    provider_id: store_id,
    limit: 20,
    offset: 1,
    canRebook,
  });

  // Normalize service bookings into the shape CartStoreCard expects.
  // Backend shape: { provider, services: string[], booking_amount, created_at }
  const orders = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data?.map((row) => ({
      ...row,
      id: row.id,
      order_id: row.id,
      // provider is the store equivalent for service module
      store: row.provider,
      // services[] is an array of service name strings — no images in the API response
      items_preview: (row.services || []).map((name) => ({
        image_full_url: null,
        name: typeof name === "string" ? name : name?.name ?? "",
      })),
      order_amount: row.booking_amount ?? row.order_amount ?? 0,
      placedDate: formatTripDate(row.created_at),
    }));
  }, [data]);

  const { mutate: rebookMutate } = usePostServiceRebook();

  const handleReorder = (orderId) => {
    if (!canRebook || reorderingId) return;
    setReorderingId(orderId);
    rebookMutate(
      { booking_id: orderId },
      {
        onSuccess: (res) => {
          setReorderingId(null);
          rebookToastMessageHandler(res, true);
        },
        onError: (err) => {
          setReorderingId(null);
          rebookToastMessageHandler(err, false);
        },
      },
    );
  };

  // ── Confirm modal handlers ─────────────────────────────────────────────────
  const handleReorderClick = (order) => {
    if (!canRebook) return;
    const storeId = order.store?.id;
    const hasCartFromSameStore =
      Array.isArray(cartList) &&
      cartList.length > 0 &&
      cartList.some((item) => String(item?.store_id) === String(storeId));

    if (hasCartFromSameStore) {
      setPendingReorder({
        orderId: order.order_id,
        storeName: order.store?.name,
      });
    } else {
      handleReorder(order.order_id);
    }
  };

  const handleCancelReorder = () => {
    setPendingReorder(null);
  };

  const handleConfirmReorder = () => {
    if (!pendingReorder) return;
    handleReorder(pendingReorder.orderId);
    setPendingReorder(null);
  };

  if (!Array.isArray(orders) || orders.length === 0) {
    return null;
  }

  return (
    <>
      <Container>
        <CustomBoxFullWidth>
          <CustomSlider
            items={orders}
            getKey={(order) => order.id}
            renderItem={(order) => (
              <CartStoreCard
                variant="order_placed"
                store={order.store}
                items={order.services?.length ? order.services : []}
                placedDate={order.placedDate ?? order.created_at}
                totalPrice={order.order_amount ?? order.totalPrice}
                isReordering={reorderingId === order.order_id}
                onReorder={() => handleReorderClick(order)}
                showReorder={canRebook}
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
                  whiteSpace: "nowrap",
                }}
              >
                {title ?? t("Your Previous Booking")}
              </Typography>
            }
            headerSx={{ pr: { xs: "16px", md: "24px" } }}
            stretchItems={false}
            allowOverflowY={false}
            slidesPerView="auto"
            spaceBetween={16}
            breakpoints={LAST_BOOKING_GAP_BREAKPOINTS}
          />
        </CustomBoxFullWidth>
      </Container>

      {/* ── Reorder Confirm Modal ─────────────────────────────────────────── */}
      <CustomModal
        openModal={Boolean(pendingReorder)}
        handleClose={handleCancelReorder}
        maxWidth="400px"
      >
        <Stack spacing={2.5} alignItems="center" sx={{ p: "28px 24px 24px" }}>
          {/* Icon */}
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <i
              className="fi fi-rr-refresh"
              style={{
                fontSize: "26px",
                display: "flex",
                lineHeight: 1,
                color: theme.palette.primary.main,
              }}
            />
          </Stack>

          {/* Text */}
          <Stack alignItems="center" spacing={1}>
            <Typography
              fontSize="18px"
              fontWeight={700}
              textAlign="center"
              color="text.primary"
              lineHeight={1.2}
            >
              {t("Start a New Booking?")}
            </Typography>
            <Typography
              fontSize="13px"
              color="text.secondary"
              textAlign="center"
              lineHeight={1.65}
              sx={{ maxWidth: "290px" }}
            >
              {t(
                "Reordering from {{name}} will clear your current provider cart. Do you want to continue?",
                { name: pendingReorder?.storeName },
              )}
            </Typography>
          </Stack>

          {/* Buttons */}
          <Stack direction="row" spacing={1.5} width="100%">
            <Button
              fullWidth
              variant="outlined"
              onClick={handleCancelReorder}
              sx={{
                borderRadius: "10px",
                fontWeight: 600,
                textTransform: "none",
                py: 1.25,
                borderColor: theme.palette.divider,
                color: theme.palette.text.secondary,
                "&:hover": { borderColor: theme.palette.text.primary },
              }}
            >
              {t("Cancel")}
            </Button>
            <Button
              fullWidth
              variant="contained"
              disableElevation
              onClick={handleConfirmReorder}
              sx={{
                borderRadius: "10px",
                fontWeight: 600,
                textTransform: "none",
                py: 1.25,
              }}
            >
              {t("Yes, Rebook")}
            </Button>
          </Stack>
        </Stack>
      </CustomModal>
    </>
  );
};

export default ServiceLastBookingSection;
