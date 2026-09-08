import CssBaseline from "@mui/material/CssBaseline";

import SEO from "../../../../src/components/seo";
import MainLayout from "../../../../src/components/layout/MainLayout";

import { useDispatch } from "react-redux";

import { useGetConfigData } from "api-manage/hooks/useGetConfigData";
import { setConfigData } from "redux/slices/configData";
import { useEffect } from "react";
import RentalProviderDetailsPage from "../../../../src/components/home/module-wise-components/rental/components/rental-provider-details/RentalProviderDetailsPage";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import { NoSsr } from "@mui/material";

const Index = ({ providerMetaData, configData }) => {
  const dispatch = useDispatch();

  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();

  // Hydrate redux from whichever source we have:
  //  - SSR succeeded → push the prop into redux so navbar/TaxiView etc.
  //    don't read `null` on first render.
  //  - SSR missed → trigger the client-side fetch (the hook is
  //    `enabled: false` by default, so we have to kick it manually).
  // Dependencies are empty because `configData` is an SSR prop that
  // doesn't change after mount.
  useEffect(() => {
    if (configData) {
      dispatch(setConfigData(configData));
    } else {
      configRefetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the client-side fallback resolves, push it into redux too.
  useEffect(() => {
    if (dataConfig) {
      dispatch(setConfigData(dataConfig));
    }
  }, [dataConfig, dispatch]);
  return (
    <>
      <CssBaseline />
      <SEO
        title={providerMetaData?.meta_title || (configData ? `Provider` : "")}
        image={providerMetaData?.meta_image || configData?.logo_full_url}
        businessName={configData?.business_name}
        configData={configData}
        description={providerMetaData?.meta_description}
        robotsMeta={providerMetaData?.meta_data}
      />
      <MainLayout configData={configData}>
        <SimpleMobileHeader title="Provider Details" />
        <NoSsr>
          <RentalProviderDetailsPage configData={configData} />
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default Index;
export const getServerSideProps = async (context) => {
  const { id, module, module_id: legacyModuleId } = context.query;
  const { req } = context;
  const language = req.cookies.languageSetting || "en";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const origin = process.env.NEXT_CLIENT_HOST_URL;

  let providerMetaData = null;
  let config = null;

  const headers = {
    "X-software-id": 33571750,
    "X-server": "server",
    origin,
    "X-localization": language,
  };

  // Config and provider details are independent documents — fetch both in
  // parallel; both can gracefully degrade to null on failure.
  const [configSettled, providerSettled] = await Promise.allSettled([
    fetch(`${baseUrl}/api/v1/config`, { method: "GET", headers }),
    id
      ? fetch(`${baseUrl}/api/v1/rental/provider/get-provider-details/${id}`, {
          method: "GET",
          headers,
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
    console.error("SSR config fetch failed:", configSettled.value?.statusText);
  }

  if (providerSettled.status === "rejected") {
    console.error(
      "SSR provider details fetch failed:",
      providerSettled.reason?.message || providerSettled.reason,
    );
  } else if (providerSettled.value?.ok) {
    try {
      const providerDetailsData = await providerSettled.value.json();

      providerMetaData = {
        meta_title: providerDetailsData?.meta_title || null,
        meta_image: providerDetailsData?.meta_image_full_url || null,
        meta_description: providerDetailsData?.meta_description || null,
        meta_data: providerDetailsData?.meta_data || null,
      };
    } catch (error) {
      console.error("SSR provider details parse failed:", error?.message);
    }
  } else if (providerSettled.value) {
    console.error(
      "SSR provider details fetch failed:",
      providerSettled.value?.statusText,
    );
  }

  return {
    props: {
      providerMetaData,
      configData: config || null,
    },
  };
};
