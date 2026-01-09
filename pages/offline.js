import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useRouter } from "next/router";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import RefreshIcon from "@mui/icons-material/Refresh";

const OfflinePage = () => {
  const router = useRouter();

  const handleRetry = () => {
    router.reload();
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          py: 4,
        }}
      >
        <WifiOffIcon
          sx={{
            fontSize: 120,
            color: "text.secondary",
            mb: 3,
            opacity: 0.6,
          }}
        />
        
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          You're Offline
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 400 }}
        >
          It looks like you've lost your internet connection. Please check your
          network and try again.
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<RefreshIcon />}
          onClick={handleRetry}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 500,
            backgroundColor: "#111827",
            "&:hover": {
              backgroundColor: "#1f2937",
            },
          }}
        >
          Try Again
        </Button>

        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ mt: 4 }}
        >
          Some previously viewed content may still be available
        </Typography>
      </Box>
    </Container>
  );
};

export default OfflinePage;
