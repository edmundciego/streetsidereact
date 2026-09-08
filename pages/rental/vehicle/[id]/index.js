import CssBaseline from "@mui/material/CssBaseline";

import SEO from "../../../../src/components/seo";
import MainLayout from "../../../../src/components/layout/MainLayout";

import { useDispatch, useSelector } from "react-redux";

import { useGetConfigData } from "../../../../src/api-manage/hooks/useGetConfigData";
import { setConfigData } from "../../../../src/redux/slices/configData";
import { useEffect } from "react";
import VehicleDetailsPage from "../../../../src/components/home/module-wise-components/rental/components/vehicle-details/VehicleDetailsPage";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import { NoSsr } from "@mui/material";

const index = ({ vehicleDetailsData, configData }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { landingPageData, configData: storeConfigData } = useSelector(
    (state) => state.configData
  );
  const effectiveConfigData = configData || storeConfigData;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (configData) {
      dispatch(setConfigData(configData));
    }
  }, [configData]);
  return (
    <>
      <CssBaseline />
      <SEO
        title={
          vehicleDetailsData?.meta_title || effectiveConfigData?.business_name
        }
        image={
          vehicleDetailsData?.meta_image ||
          effectiveConfigData?.fav_icon_full_url
        }
        businessName={effectiveConfigData?.business_name}
        configData={effectiveConfigData}
        description={vehicleDetailsData?.meta_description || ""}
        robotsMeta={vehicleDetailsData?.meta_data}
      />
      <MainLayout
        configData={effectiveConfigData}
        landingPageData={landingPageData}
      >
        <SimpleMobileHeader title="Vehicle Details" />
        <NoSsr>
          <VehicleDetailsPage vehicleDetailsData={vehicleDetailsData} />
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default index;

export const getServerSideProps = async (context) => {
  const { id, module, module_id: legacyModuleId } = context.query;
  const { req } = context;
  const language = req.cookies.languageSetting || "en";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const origin = process.env.NEXT_CLIENT_HOST_URL;
  const moduleId = module || legacyModuleId;

  let vehicleDetailsData = null;
  let config = null;

  const headers = {
    "X-software-id": 33571750,
    "X-server": "server",
    origin,
    "X-localization": language,
  };
  const vehicleHeaders = { ...headers };
  if (moduleId) {
    const moduleIdValue = String(moduleId);
    vehicleHeaders.moduleId = moduleIdValue;
    vehicleHeaders["module_id"] = moduleIdValue;
  }

  // Config and vehicle details are independent documents — fetch both in
  // parallel; vehicle details can gracefully degrade to null on failure.
  const [configSettled, vehicleSettled] = await Promise.allSettled([
    fetch(`${baseUrl}/api/v1/config`, { method: "GET", headers }),
    id
      ? fetch(`${baseUrl}/api/v1/rental/vehicle/get-vehicle-details/${id}`, {
          method: "GET",
          headers: vehicleHeaders,
        })
      : Promise.resolve(null),
  ]);

  if (configSettled.status === "rejected") {
    console.error(
      "SSR config fetch failed:",
      configSettled.reason?.message || configSettled.reason,
    );
  } else if (configSettled.value?.ok) {
    try {
      config = await configSettled.value.json();
    } catch (error) {
      console.error("SSR config parse failed:", error?.message);
    }
  } else {
    console.error(
      "SSR config fetch failed:",
      configSettled.value?.statusText,
    );
  }

  if (vehicleSettled.status === "rejected") {
    console.error(
      "SSR vehicle details fetch failed:",
      vehicleSettled.reason?.message || vehicleSettled.reason,
    );
  } else if (vehicleSettled.value?.ok) {
    try {
      vehicleDetailsData = await vehicleSettled.value.json();
    } catch (error) {
      console.error("SSR vehicle details parse failed:", error?.message);
    }
  } else if (vehicleSettled.value) {
    console.error(
      "SSR vehicle details fetch failed:",
      vehicleSettled.value?.statusText,
    );
  }

  return {
    props: {
      vehicleDetailsData,
      configData: config || null,
    },
  };
};
