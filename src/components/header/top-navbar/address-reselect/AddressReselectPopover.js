import React, { useEffect, useState } from "react";
import {Button, Popover, Stack, Typography, useTheme} from "@mui/material";
import toast from "react-hot-toast";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import CustomAlert from "../../../alert/CustomAlert";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";
import DeliveryAddress from "../../../checkout/delivery-address";
import { useGeolocated } from "react-geolocated";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import useGetGeoCode from "../../../../api-manage/hooks/react-query/google-api/useGetGeoCode";
import useGetZoneId from "../../../../api-manage/hooks/react-query/google-api/useGetZone";
import dynamic from "next/dynamic";
const MapModal = dynamic(() => import("../../../Map/MapModal"));
const AddressReselectPopover = (props) => {
  const { anchorEl, onClose, open, t, address, setAddress, token, currentLatLngForMar, onLocationChange, ...other } =
    props;
  const theme = useTheme();
  const [openMapModal, setOpenMapModal] = useState(false);
  const [location, setLocation] = useState(undefined);
  const [geoLocationEnable, setGeoLocationEnable] = useState(false);
  const [zoneIdEnabled, setZoneIdEnabled] = useState(false);
  const [pendingCurrentLocation, setPendingCurrentLocation] = useState(false);
  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    isGeolocationEnabled: true,
  });

  const handleAgreeLocation = () => {
    if (!coords) {
      toast.error(
        t("Unable to determine your current location. Please pick a location from the map.")
      );
      return;
    }

    setLocation({ lat: coords.latitude, lng: coords.longitude });
    setPendingCurrentLocation(true);
    setGeoLocationEnable(true);
    setZoneIdEnabled(true);
  };

  const {
    data: geoCodeResults,
    isFetching: isFetchingGeoCode,
    error: geoCodeError,
  } = useGetGeoCode(location, geoLocationEnable);
  const {
    data: zoneData,
    isFetching: isFetchingZone,
    error: zoneError,
  } = useGetZoneId(location, zoneIdEnabled);

  useEffect(() => {
    if (!pendingCurrentLocation || !location) return;
    if (isFetchingGeoCode || isFetchingZone) return;

    const responseError = zoneError || geoCodeError;
    if (responseError) {
      const responseData = responseError?.response?.data;
      const errors = responseData?.errors;
      const firstError = Array.isArray(errors)
        ? errors[0]
        : Object.values(errors || {}).flat()[0];
      toast.error(
        (typeof firstError === "string" ? firstError : firstError?.message) ||
          responseData?.message ||
          t("Unable to set this location. Please try another location.")
      );
      setPendingCurrentLocation(false);
      return;
    }

    const formattedAddress = geoCodeResults?.results?.[0]?.formatted_address;
    if (!formattedAddress) {
      toast.error(t("Unable to find an address for your current location."));
      setPendingCurrentLocation(false);
      return;
    }

    if (!zoneData?.zone_id) {
      toast.error(t("Sorry, we are not available in this area yet."));
      setPendingCurrentLocation(false);
      return;
    }

    localStorage.setItem("location", formattedAddress);
    localStorage.setItem("currentLatLng", JSON.stringify(location));
    localStorage.setItem("zoneid", zoneData.zone_id);
    setPendingCurrentLocation(false);
    onLocationChange?.(formattedAddress);
    onClose?.();
  }, [
    pendingCurrentLocation,
    location,
    isFetchingGeoCode,
    isFetchingZone,
    geoCodeError,
    zoneError,
    geoCodeResults,
    zoneData,
    t,
    onClose,
    onLocationChange,
  ]);
  const handleCloseMapModal = () => {
    setOpenMapModal(false);
    onClose();
  };
  const popOverHeightHandler = () => {
    if (token) {
      return "475px";
    } else {
      return "150px";
    }
  };
  return (
    <>
      <Popover
        disableScrollLock={true}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        onClose={onClose}
        open={open}
        PaperProps={{
          sx: { width: { xs: 300, sm: 320, md: 350 }, p: "1rem" },
        }}
        transitionDuration={2}
        {...other}
      >
        <Stack justifyContent="center" textAlign="center" spacing={2}>
          <SimpleBar
            className="custom-scrollbar"
            style={{
              maxHeight: popOverHeightHandler(),
              paddingRight: "5px",
            }}
          >
            <Stack width="100%" alignItems="center">
              {token ? (
                open && (
                  <Stack
                    pt="15px"
                    gap={{ xs: "0px", sm: "15px" }}
                    paddingRight="5px"
                  >
                    <Typography
                      fontSize="16px"
                      fontWeight={500}
                      textAlign="left"
                    >
                      {t("Select from saved addresses or pick from map")}
                    </Typography>
                    <DeliveryAddress
                      setAddress={setAddress}
                      address={address}
                      hideAddressSelectionField="true"
                      renderOnNavbar="true"
                    />
                  </Stack>
                )
              ) : (
                <CustomAlert
                  type="info"
                  text={t(
                    "To select from saved addresses, you need to sign in."
                  )}
                />
              )}
            </Stack>
          </SimpleBar>
         <Button
           fullWidth
              disabled={pendingCurrentLocation}
              onClick={handleAgreeLocation}
              startIcon={
                <ControlPointOutlinedIcon sx={{ color: theme.palette.primary.main }} />
              }
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                fontWeight: 600,
                color: theme.palette.primary.main,
              }}
            >
              {pendingCurrentLocation
                ? t("Setting location...")
                : t("Use Current Location")}
            </Button>
          <Stack width="100%" justifyContent="center" alignItems="center">
            <CustomButtonPrimary onClick={() => setOpenMapModal(true)}>
              {t("Pick from map")}
            </CustomButtonPrimary>
          </Stack>
        </Stack>
      </Popover>
      {openMapModal && (
        <MapModal
          open={openMapModal}
          handleClose={handleCloseMapModal}
          handleLocation={(_coordinates, formattedAddress) =>
            onLocationChange?.(formattedAddress)
          }
          selectedLocation={currentLatLngForMar}
        />
      )}
    </>
  );
};

AddressReselectPopover.propTypes = {};

export default AddressReselectPopover;
