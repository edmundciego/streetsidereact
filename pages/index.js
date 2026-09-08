import { LandingLayout } from "components/layout/LandingLayout";
import LandingPage from "../src/components/landing-page";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setConfigData, setLandingPageData } from "redux/slices/configData";
import Router from "next/router";
import SEO from "../src/components/seo";
import useGetLandingPage from "../src/api-manage/hooks/react-query/useGetLandingPage";
import { useGetConfigData } from "../src/api-manage/hooks/useGetConfigData";
import { RTL } from "components/rtl";
import { checkMaintenanceMode } from "../src/utils/serverSidePropsHelper";

const Root = (props) => {
  const { configData, landingPageData } = props;
  // SSR already fetched both documents in getServerSideProps — seed the
  // queries instead of refetching the same payloads on mount (config is
  // cached forever server-side; landing page is the uncached fan-out).
  const { data } = useGetLandingPage({ initialData: landingPageData });
  const dispatch = useDispatch();
  const { data: dataConfig } = useGetConfigData({ initialData: configData });
  useEffect(() => {
    dispatch(setLandingPageData(data));
    if (dataConfig) {
      if (dataConfig.length === 0) {
        Router.push("/404");
      } else {
        dispatch(setConfigData(dataConfig));
      }
    }
  }, [dataConfig, data]);
  let lanDirection = undefined;

  return (
    <>
      <CssBaseline />
      {/* <DynamicFavicon configData={configData} /> */}
      <SEO
        image={landingPageData?.meta_image || configData?.fav_icon_full_url}
        businessName={configData?.business_name}
        configData={configData}
        title={landingPageData?.meta_title || configData?.business_name}
        description={
          landingPageData?.meta_description || configData?.meta_description
        }
      />
      {data && (
        <LandingLayout configData={dataConfig} landingPageData={data}>
          <LandingPage configData={dataConfig} landingPageData={data} />
        </LandingLayout>
      )}
    </>
  );
};
export default Root;
export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const language = req.cookies.languageSetting;

  const configHeaders = {
    "X-software-id": 33571750,
    "X-server": "server",
    "X-localization": language,
    origin: process.env.NEXT_CLIENT_HOST_URL,
  };
  const landingHeaders = {
    "X-software-id": 33571750,
    "X-server": "server",
    "X-localization": language,
    origin: process.env.NEXT_CLIENT_HOST_URL,
  };

  // Config and the landing-page CMS document are independent — start both
  // requests in parallel instead of paying two sequential round-trips.
  // (In the rare maintenance-mode case the landing request is wasted, but
  // the redirect is still served immediately once config resolves.)
  const [configSettled, landingSettled] = await Promise.allSettled([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/config`, {
      method: "GET",
      headers: configHeaders,
    }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/react-landing-page`, {
      method: "GET",
      headers: landingHeaders,
    }),
  ]);

  if (configSettled.status === "rejected") {
    throw configSettled.reason;
  }
  const config = await configSettled.value.json();

  if (checkMaintenanceMode(config)) {
    return {
      redirect: {
        destination: "/maintainance",
        permanent: false,
      },
    };
  }

  if (landingSettled.status === "rejected") {
    throw landingSettled.reason;
  }
  const landingPageData = await landingSettled.value.json();
  // Set cache control headers for 1 hour (3600 seconds)
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate",
  );

  return {
    props: {
      configData: config,
      landingPageData: landingPageData,
    },
  };
};
