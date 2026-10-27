import { lazy, Suspense } from "react";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import CustomModal from "components/modal";
import DeferredPanel from "components/common/DeferredPanel";

const AuthModal = lazy(() => import("./AuthModal"));

const DeferredAuthModal = ({ open, handleClose, ...props }) => (
  <DeferredPanel open={open}>
    <Suspense
      fallback={
        open ? (
          <CustomModal openModal handleClose={handleClose}>
            <Stack alignItems="center" spacing={2} sx={{ p: 4 }} role="status">
              <CircularProgress size={28} />
              <Typography>{t("Loading...")}</Typography>
            </Stack>
          </CustomModal>
        ) : null
      }
    >
      <AuthModal open={open} handleClose={handleClose} {...props} />
    </Suspense>
  </DeferredPanel>
);

export default DeferredAuthModal;
