import { checkMaintenanceMode } from "./serverSidePropsHelper";

/**
 * Shared SSR bootstrap for pages that need configuration, but not the landing
 * CMS document. Keeping this separate prevents non-home routes from paying
 * for `/react-landing-page` on every request.
 */
export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const language = req.cookies.languageSetting;
  const configRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/config`,
    {
      method: "GET",
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        "X-localization": language,
        origin: process.env.NEXT_CLIENT_HOST_URL,
      },
    }
  );
  const configData = await configRes.json();

  if (checkMaintenanceMode(configData)) {
    return {
      redirect: {
        destination: "/maintainance",
        permanent: false,
      },
    };
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate"
  );
  return { props: { configData } };
};
