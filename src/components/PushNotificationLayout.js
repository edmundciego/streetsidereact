import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  IconButton,
  Paper,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { useStoreFcm } from "api-manage/hooks/react-query/push-notifications/usePushNotification";
import CongratulationsIcon from "../assets/img/CongratulationsIcon";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import { t } from "i18next";

const CustomPaperRefer = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "17px 28px 22px 28px",
  borderRadius: "12px",
  gap: "18px",
  maxWidth: "375px",

  [theme.breakpoints.down("md")]: {
    width: "350px",
  },
  [theme.breakpoints.down("sm")]: {
    width: "301px",
  },
}));

const PushNotificationLayout = ({
  children,
  refetch,
  pathName,
  refetchTrackOrder,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const [notification, setNotification] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isTokenFound, setTokenFound] = useState(false);
  const [fcmToken, setFcmToken] = useState("");
  const darkToast = () =>
    toast("You have a new message", {
      icon: "",
      style: {
        borderRadius: "12px",
        background: theme.palette.primary.main,
        color: theme.palette.neutral[1000],
        height: "60px",
      },
      position: "top-center",
    });
  const CustomToast = ({ title, description, icon, onClick, toastId }) => (
    <CustomPaperRefer sx={{ position: "relative" }}>
      <Stack
        direction="row"
        gap="14px"
        sx={{ cursor: onClick ? "pointer" : "default", flex: 1, minWidth: 0 }}
        onClick={() => {
          onClick?.();
          toast.dismiss(toastId);
        }}
      >
        {icon && (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              flexShrink: 0,
              backgroundColor: (t) => `${t.palette.primary.main}1a`,
              color: "primary.main",
            }}
          >
            {icon}
          </Stack>
        )}
        <Stack gap="4px" sx={{ minWidth: 0 }}>
          <Typography
            fontSize="14px"
            fontWeight={700}
            sx={{ color: "primary.main" }}
          >
            {t(title)}
          </Typography>
          <Typography
            fontSize="12px"
            sx={{ width: "100%", maxWidth: "283px", color: "text.secondary" }}
          >
            {t(description)}
          </Typography>
        </Stack>
      </Stack>
      <IconButton
        sx={{ position: "absolute", top: 10, right: 15 }}
        onClick={() => toast.dismiss(toastId)}
      >
        <CloseIcon sx={{ fontSize: "16px" }} />
      </IconButton>
    </CustomPaperRefer>
  );
  // Defer Firebase Messaging SDK until browser is idle so it never blocks
  // initial render / LCP. Dynamically imports ../firebase (which pulls
  // firebase/messaging) after idle.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { fetchToken } = await import("../firebase");
        if (!cancelled) await fetchToken(setTokenFound, setFcmToken);
      } catch {
        // push unsupported — silently skip
      }
    };
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        const id = window.requestIdleCallback(load, { timeout: 4000 });
        return () => {
          cancelled = true;
          window.cancelIdleCallback?.(id);
        };
      }
      const t = setTimeout(load, 2500);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserToken(localStorage.getItem("token"));
    }
  }, []);

  //const userToken=localStorage.getItem("token")
  const { mutate } = useStoreFcm();

  useEffect(() => {
    if (userToken) {
      mutate(fcmToken);
    }
  }, [fcmToken]);

  const clickHandler = () => {
    if (notification.type === "message") {
      router.push(
        {
          pathname: "/chatting",
          query: {
            conversationId: notification?.conversation_id,
            type: notification.sender_type,
            chatFrom: "true",
          },
        },
        undefined,
        { shallow: true }
      );
    }
    if (notification.type === "order_status") {
      // router.push(`/order-history/${notification.order_id}`, undefined, {
      //   shallow: true,
      // });
      router.push(
        `/profile?orderId=${notification.order_id}&page=my-orders&from=checkout`,
        undefined,
        {
          shallow: true,
        }
      );
    }
  };

  // Listen for foreground messages once (firebase lazily loaded)
  useEffect(() => {
    let cancelled = false;
    import("../firebase")
      .then(({ onMessageListener }) => onMessageListener())
      .then((payload) => {
        if (!cancelled && payload?.data) setNotification(payload.data);
      })
      .catch(() => {}); // push unsupported — skip
    return () => {
      cancelled = true;
    };
  }, []);

  // Render toast when a notification arrives
  useEffect(() => {
    if (notification) {
      if (pathName === "chat" && notification.type === "message") {
        refetch();
      } else if (notification.type === "message") {
        darkToast();
      } else if (notification.type === "referral_code") {
        toast.custom(
          (customToast) => (
            <CustomToast
              toastId={customToast.id}
              title={notification?.title}
              description={notification?.body}
              icon={<CongratulationsIcon />}
            />
          ),
          {
            position: "top-right",
            duration: 5000,
          }
        );
      } else {
        if (pathName === "profile") {
          refetchTrackOrder?.();
        }
        toast.custom(
          (customToast) => (
            <CustomToast
              toastId={customToast.id}
              title={notification?.title}
              description={notification?.body}
              icon={<NotificationsActiveRoundedIcon sx={{ fontSize: 20 }} />}
              onClick={clickHandler}
            />
          ),
          {
            position: "top-center",
            duration: 5000,
          }
        );
      }
    }
  }, [notification]);

  return <>{children}</>;
};

export default PushNotificationLayout;

// title="Someone just used  your code !"
//   description="Be prepare to receive when they complete there first purchase"
//   icon={<CongratulationsIcon />}
//   position="top-right"
