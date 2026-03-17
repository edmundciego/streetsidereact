export const getSocialLoginConfig = (configData, medium) => {
  if (!Array.isArray(configData?.social_login)) {
    return null;
  }

  return (
    configData.social_login.find(
      (loginConfig) => loginConfig?.login_medium === medium
    ) ?? null
  );
};

export const getSocialLoginClientId = (configData, medium) => {
  return getSocialLoginConfig(configData, medium)?.client_id ?? "";
};
