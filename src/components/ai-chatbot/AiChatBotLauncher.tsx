import CloseIcon from "@mui/icons-material/Close";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import {
  Badge,
  Box,
  Fab,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
  Zoom,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { lazy, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getToken } from "../../helper-functions/getToken";
import DeferredPanel from "components/common/DeferredPanel";

const ChatBotPopover = lazy(() => import("./ChatBotPopover"));
const preloadChat = () => {
  void import("./ChatBotPopover").catch(() => {});
};

const ChatLoadingPanel = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        position: "fixed",
        zIndex: (theme) => theme.zIndex.modal + 1,
        inset: { xs: 0, sm: "auto" },
        right: { sm: 24 },
        bottom: { sm: 96 },
        width: { sm: 380 },
        height: { sm: 560 },
        p: 2,
        bgcolor: "background.paper",
        borderRadius: { xs: 0, sm: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography>{t("Loading...")}</Typography>
        <IconButton onClick={onClose} aria-label={t("Close") as string}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Skeleton
        animation={false}
        variant="rounded"
        height={56}
        sx={{ mb: 2 }}
      />
      <Skeleton
        animation={false}
        variant="rounded"
        height={96}
        sx={{ mb: 2 }}
      />
      <Skeleton animation={false} variant="rounded" height={56} />
    </Box>
  );
};

interface AiChatBotLauncherProps {
  unreadCount?: number;
  happyHourBannerActive?: boolean;
}

const DEFAULT_MOBILE_BOTTOM = 80;
const HAPPY_HOUR_BANNER_BOTTOM = 65;
const HAPPY_HOUR_BANNER_HEIGHT = 60;
const FLOATING_STACK_GAP = 12;
const ACTIVE_MOBILE_BOTTOM =
  HAPPY_HOUR_BANNER_BOTTOM + HAPPY_HOUR_BANNER_HEIGHT + FLOATING_STACK_GAP;

const AiChatBotLauncher = ({
  unreadCount = 0,
  happyHourBannerActive = false,
}: AiChatBotLauncherProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { profileInfo } = useSelector((state: any) => state.profileInfo);

  useEffect(() => {
    setIsLoggedIn(Boolean(getToken()));
    const handleStorage = () => setIsLoggedIn(Boolean(getToken()));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [profileInfo]);

  // if (!isLoggedIn) return null;

  return (
    <>
      <Tooltip
        title={
          open ? (t("Close") as string) : (t("Ask AI Assistant") as string)
        }
        placement="left"
      >
        <Box
          sx={{
            position: "fixed",
            right: { xs: 16, sm: 24 },
            bottom: {
              xs: happyHourBannerActive
                ? ACTIVE_MOBILE_BOTTOM
                : DEFAULT_MOBILE_BOTTOM,
              sm: "10%",
            },
            transition: "bottom 0.2s ease",
            zIndex: (th) => th.zIndex.appBar - 10,
          }}
        >
          <Badge
            badgeContent={open ? 0 : unreadCount}
            color="error"
            overlap="circular"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Fab
              color="primary"
              aria-label={t("AI Assistant") as string}
              aria-expanded={open}
              aria-haspopup="dialog"
              onPointerEnter={preloadChat}
              onFocus={preloadChat}
              onPointerDown={preloadChat}
              onClick={() => setOpen((v) => !v)}
              sx={{
                width: 56,
                height: 56,
                background: `linear-gradient(135deg, ${
                  theme.palette.primary.main
                } 0%, ${alpha(theme.palette.primary.main, 0.78)} 100%)`,
                boxShadow: `0 10px 24px ${alpha(
                  theme.palette.primary.main,
                  0.45
                )}`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  boxShadow: `0 12px 28px ${alpha(
                    theme.palette.primary.main,
                    0.55
                  )}`,
                },
                "&::after": open
                  ? {}
                  : {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: `2px solid ${theme.palette.primary.main}`,
                      animation: "chatbotPulse 2s ease-out infinite",
                      "@keyframes chatbotPulse": {
                        "0%": { transform: "scale(1)", opacity: 0.6 },
                        "100%": { transform: "scale(1.5)", opacity: 0 },
                      },
                    },
              }}
            >
              <Zoom in={!open} unmountOnExit>
                <SmartToyOutlinedIcon sx={{ fontSize: 26, color: "#fff" }} />
              </Zoom>
              <Zoom in={open} unmountOnExit>
                <CloseIcon
                  sx={{ fontSize: 26, color: "#fff", position: "absolute" }}
                />
              </Zoom>
            </Fab>
          </Badge>
        </Box>
      </Tooltip>

      <DeferredPanel open={open}>
        <Suspense
          fallback={
            open ? <ChatLoadingPanel onClose={() => setOpen(false)} /> : null
          }
        >
          <ChatBotPopover open={open} onClose={() => setOpen(false)} />
        </Suspense>
      </DeferredPanel>
    </>
  );
};

export default AiChatBotLauncher;
