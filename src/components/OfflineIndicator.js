import React, { useState, useEffect } from "react";
import { Snackbar, Alert, Slide } from "@mui/material";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import WifiIcon from "@mui/icons-material/Wifi";

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Check initial status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowReconnected(true);
        // Auto-hide reconnected message after 3 seconds
        setTimeout(() => setShowReconnected(false), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline]);

  return (
    <>
      {/* Offline Banner */}
      <Snackbar
        open={!isOnline}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={SlideTransition}
        sx={{ top: { xs: 0, sm: 0 } }}
      >
        <Alert
          severity="warning"
          icon={<WifiOffIcon />}
          sx={{
            width: "100%",
            borderRadius: 0,
            backgroundColor: "#fef3c7",
            color: "#92400e",
            "& .MuiAlert-icon": {
              color: "#d97706",
            },
            fontWeight: 500,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          You're offline — Some features may be limited
        </Alert>
      </Snackbar>

      {/* Reconnected Toast */}
      <Snackbar
        open={showReconnected}
        autoHideDuration={3000}
        onClose={() => setShowReconnected(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          severity="success"
          icon={<WifiIcon />}
          onClose={() => setShowReconnected(false)}
          sx={{
            backgroundColor: "#d1fae5",
            color: "#065f46",
            "& .MuiAlert-icon": {
              color: "#10b981",
            },
            fontWeight: 500,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          You're back online!
        </Alert>
      </Snackbar>
    </>
  );
};

export default OfflineIndicator;
